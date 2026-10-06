import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';
import type { ScreenOpenHandler } from '../../types';

interface AgendaViewDiaProps { onOpenScreen: ScreenOpenHandler }
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const AgendaViewDia: React.FC<AgendaViewDiaProps> = ({ onOpenScreen }) => {
  const { appointments, agendaBlocks, setAgendaRange, operationsError } = useData();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const monthLabel = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() - selectedDate.getDay() + index);
    return date;
  }), [selectedDate]);
  const rangeFrom = dateKey(weekDates[0]);
  const rangeTo = dateKey(weekDates[6]);

  useEffect(() => { setAgendaRange(rangeFrom, rangeTo); }, [rangeFrom, rangeTo, setAgendaRange]);

  const day = dateKey(selectedDate);
  const entries = [
    ...appointments.filter((item) => item.date === day).map((item) => ({ kind: 'appointment' as const, time: item.time, value: item })),
    ...agendaBlocks.filter((item) => item.date === day).map((item) => ({ kind: 'block' as const, time: item.startTime, value: item })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  return <div className="animate-in fade-in duration-300 space-y-6">
    <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-gray-800 text-lg capitalize">{monthLabel}</h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} aria-label="Mês anterior" className="p-2 rounded-xl bg-gray-50 text-gray-600"><ChevronRight className="rotate-180" size={16} /></button>
          <button type="button" onClick={() => setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} aria-label="Próximo mês" className="p-2 rounded-xl bg-gray-50 text-gray-600"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="flex justify-between">
        {weekDates.map((date) => {
          const selected = dateKey(date) === day;
          return <button key={dateKey(date)} type="button" onClick={() => setSelectedDate(date)} className={`flex flex-col items-center p-2 rounded-2xl w-[12%] ${selected ? 'bg-[#FF85C2] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
            <span className="text-[10px] uppercase">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
            <span className="text-sm font-bold">{date.getDate()}</span>
          </button>;
        })}
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-gray-700">Horários do Dia</h3>
        <button type="button" onClick={() => onOpenScreen('agenda_block', { date: day })} className="text-xs font-bold text-[#FF85C2] uppercase">+ Novo Bloqueio</button>
      </div>
      {operationsError && <p role="alert" className="text-sm text-red-600">{operationsError}</p>}
      {entries.length === 0 && <p className="rounded-2xl bg-white p-5 text-sm text-gray-500">Nenhum agendamento ou bloqueio nesta data.</p>}
      {entries.map((entry) => entry.kind === 'block' ? (
        <button key={`block-${entry.value.id}`} type="button" onClick={() => onOpenScreen('agenda_block', entry.value)} className="w-full flex items-center gap-4 text-left">
          <span className="text-gray-400 font-semibold text-sm w-12">{entry.time}</span>
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex justify-between items-center"><span className="flex items-center gap-2 text-xs font-bold text-amber-800"><Clock size={15} /> {entry.value.reason} · até {entry.value.endTime}</span><StatusBadge status="bloqueado" /></div>
        </button>
      ) : (
        <button key={`appointment-${entry.value.id}`} type="button" onClick={() => onOpenScreen('appointment_details', entry.value)} className="w-full flex items-center gap-4 text-left">
          <span className="text-gray-400 font-semibold text-sm w-12">{entry.time}</span>
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center"><span><strong className="block text-sm text-gray-800">{entry.value.client}</strong><span className="text-xs text-gray-500">{entry.value.service}</span></span><StatusBadge status={entry.value.status} /></div>
        </button>
      ))}
      <button type="button" onClick={() => onOpenScreen('add_appointment', { date: day })} className="w-full border border-dashed border-pink-200 rounded-2xl p-4 text-[#FF85C2] font-bold text-sm">+ Solicitar horário</button>
    </div>
  </div>;
};
