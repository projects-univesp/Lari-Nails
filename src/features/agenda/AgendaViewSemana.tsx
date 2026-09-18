import React, { useMemo, useState } from 'react';
import { ChevronRight, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AgendaViewSemana: React.FC = () => {
  const { appointments } = useData();
  const [weekStart, setWeekStart] = useState(new Date(2026, 8, 1));
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const items = appointments.filter((item) => item.date === key || item.date === 'Hoje');
    return { date, count: items.length, pending: items.filter((item) => item.status === 'pendente' || item.status === 'aguardando').length };
  }), [appointments, weekStart]);
  const currentLabel = `${weekStart.toLocaleDateString('pt-BR')} a ${new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6).toLocaleDateString('pt-BR')}`;

  return (
    <div className="animate-in fade-in duration-300 flex-1 flex flex-col space-y-4">
      <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex-1">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#FF85C2]" />
            <h2 className="font-bold text-gray-800 text-base">{currentLabel}</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWeekStart((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7))}
              aria-label="Semana anterior"
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[var(--brand-pink-bg)] hover:text-[#FF85C2] transition-colors cursor-pointer"
            >
              <ChevronRight className="rotate-180" size={16} />
            </button>
            <button
              type="button"
              onClick={() => setWeekStart((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7))}
              aria-label="Próxima semana"
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[var(--brand-pink-bg)] hover:text-[#FF85C2] transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {days.map((day) => (
            <div
              key={day.date.toISOString()}
              className="flex gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors border border-gray-50 last:border-b-0"
            >
              <div className="w-16 flex flex-col items-center justify-center bg-gray-50 rounded-xl py-2 shrink-0">
                <span className="text-[10px] uppercase font-bold text-gray-400">{day.date.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                <span className="text-lg font-bold text-gray-700">{String(day.date.getDate()).padStart(2, '0')}</span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#FF85C2]" />
                  <span className="text-xs font-bold text-gray-700">
                    {day.count} {day.count === 1 ? 'Agendamento' : 'Agendamentos'}
                  </span>
                </div>
                {day.pending > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[11px] font-bold text-amber-600">
                      {day.pending} {day.pending === 1 ? 'Pendente' : 'Pendentes'}
                    </span>
                  </div>
                )}
              </div>
              <ChevronRight size={18} className="text-gray-300 self-center shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
