import React, { useMemo, useState } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';
import type { ScreenOpenHandler } from '../../types';

interface AgendaViewDiaProps {
  onOpenScreen: ScreenOpenHandler;
}

export const AgendaViewDia: React.FC<AgendaViewDiaProps> = ({ onOpenScreen }) => {
  const { appointments, agendaBlocks } = useData();

  const [selectedDate, setSelectedDate] = useState(new Date(2026, 8, 5));
  const monthLabel = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() - selectedDate.getDay() + index);
    return date;
  }), [selectedDate]);
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '16:00', '16:30'];

  const handlePrevMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Seletor do Mês e Grade Semanal */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-gray-800 text-lg capitalize">{monthLabel}</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Mês anterior"
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[var(--brand-pink-bg)] hover:text-[#FF85C2] transition-colors cursor-pointer"
            >
              <ChevronRight className="rotate-180" size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Próximo mês"
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[var(--brand-pink-bg)] hover:text-[#FF85C2] transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          {weekDates.map((date, i) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-2 rounded-2xl w-[12%] cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#FF85C2] text-white shadow-[0_4px_12px_rgba(255,133,194,0.3)] scale-105'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <span className="text-[10px] mb-1 font-medium uppercase">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {date.getDate()}
                </span>
                {i === 3 && !isSelected && (
                  <div className="w-1 h-1 bg-[#FF85C2] rounded-full mt-1.5 opacity-50" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Horários do Dia */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-gray-700">Horários do Dia</h3>
          <button
            type="button"
            onClick={() => onOpenScreen('agenda_block', { date: selectedDate.toISOString().slice(0, 10) })}
            className="text-xs font-bold text-[#FF85C2] uppercase tracking-wider hover:text-[#e86ba8] cursor-pointer"
          >
            + Novo Bloqueio
          </button>
        </div>

        {timeSlots.map((time) => {
          // Busca agendamento correspondente ao horário
          const dateKey = selectedDate.toISOString().slice(0, 10);
          const apt = appointments.find((a) => a.time === time && (a.date === 'Hoje' || a.date === dateKey));
          const block = agendaBlocks.find((item) => item.startTime === time && (item.date === 'Hoje' || item.date === dateKey));

          if (block) {
              return (
                <div key={time} className="flex items-center gap-3 sm:gap-4">
                  <span className="text-gray-400 font-semibold text-sm w-12 text-right">{time}</span>
                  <div
                    onClick={() => onOpenScreen('agenda_block', block)}
                    className="flex-1 bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-amber-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        {block.reason}
                      </span>
                    </div>
                    <StatusBadge status="bloqueado" />
                  </div>
                </div>
              );
          }

          if (apt) {

            return (
              <div key={time} className="flex items-center gap-3 sm:gap-4">
                <span className="text-gray-400 font-semibold text-sm w-12 text-right">{time}</span>
                <div
                  onClick={() => onOpenScreen('appointment_details', apt)}
                  className={`flex-1 bg-white border shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:border-[#FF85C2] transition-colors ${
                    apt.status === 'concluido'
                      ? 'border-l-4 border-l-emerald-500 border-gray-100'
                      : apt.status === 'pendente'
                      ? 'border-l-4 border-l-amber-400 border-gray-100'
                      : 'border-l-4 border-l-[#FF85C2] border-gray-100'
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{apt.client}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{apt.service}</p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
              </div>
            );
          }

          if (time === '12:00') {
            return (
              <div key={time} className="flex items-center gap-3 sm:gap-4">
                <span className="text-gray-400 font-semibold text-sm w-12 text-right">{time}</span>
                <div className="flex-1 bg-gray-50 rounded-2xl p-4 flex justify-center items-center text-gray-400 text-xs uppercase tracking-widest font-bold border border-dashed border-gray-200">
                  <Clock size={14} className="mr-2" /> Almoço (Pausa Automática)
                </div>
              </div>
            );
          }

          return (
            <div key={time} className="flex items-center gap-3 sm:gap-4">
              <span className="text-gray-400 font-semibold text-sm w-12 text-right">{time}</span>
              <div
                onClick={() => onOpenScreen('add_appointment', { time })}
                className="flex-1 border border-dashed border-gray-200 rounded-2xl p-4 flex justify-center items-center text-gray-400 text-sm cursor-pointer hover:border-[#FF85C2] hover:bg-[var(--brand-pink-bg)] hover:text-[#FF85C2] transition-all font-medium"
              >
                + Livre
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
