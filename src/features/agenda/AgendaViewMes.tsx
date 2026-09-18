import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export const AgendaViewMes: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1));
  const [selectedDay, setSelectedDay] = useState<number>(5);

  const month = { name: currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }), daysInMonth: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(), startDay: currentMonth.getDay() };

  const handlePrev = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(1);
  };

  const handleNext = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(1);
  };

  // Monta semanas dinâmicas
  const totalSlots = 35;
  const gridCells: (number | null)[] = [];

  for (let i = 0; i < month.startDay; i++) {
    gridCells.push(null);
  }
  for (let d = 1; d <= month.daysInMonth; d++) {
    gridCells.push(d);
  }
  while (gridCells.length < totalSlots) {
    gridCells.push(null);
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-gray-800 text-lg">{month.name}</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Mês anterior"
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[var(--brand-pink-bg)] hover:text-[#FF85C2] transition-colors cursor-pointer"
            >
              <ChevronRight className="rotate-180" size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próximo mês"
              className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[var(--brand-pink-bg)] hover:text-[#FF85C2] transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-[10px] font-bold text-gray-400 uppercase">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {gridCells.map((day, idx) => {
            const isSelected = day === selectedDay;
            const hasDot = day !== null && (day % 3 === 0 || day === 5 || day === 12);

            return (
              <div key={idx} className="aspect-square flex flex-col items-center justify-center relative p-0.5">
                {day !== null ? (
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`w-full h-full rounded-2xl flex flex-col items-center justify-center text-xs font-semibold cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FF85C2] text-white shadow-md font-bold scale-105'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{day}</span>
                    {hasDot && !isSelected && (
                      <div className="w-1 h-1 rounded-full bg-[#FF85C2] mt-0.5" />
                    )}
                  </button>
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legenda do Mês */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-around text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF85C2]" />
            <span>Dia Selecionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF85C2]" />
            <span>Com Atendimentos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
