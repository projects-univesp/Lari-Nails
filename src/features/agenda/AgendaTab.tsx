import React, { useState } from 'react';
import { AgendaViewDia } from './AgendaViewDia';
import { AgendaViewSemana } from './AgendaViewSemana';
import { AgendaViewMes } from './AgendaViewMes';
import type { ScreenOpenHandler, AgendaViewMode } from '../../types';

interface AgendaTabProps {
  onOpenScreen: ScreenOpenHandler;
}

export const AgendaTab: React.FC<AgendaTabProps> = ({ onOpenScreen }) => {
  const [viewMode, setViewMode] = useState<AgendaViewMode>('dia');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      {/* Seletor de Visão */}
      <div className="flex bg-white p-1 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] mx-1">
        <button
          type="button"
          onClick={() => setViewMode('dia')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            viewMode === 'dia' ? 'bg-[#FF85C2] text-white' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          Dia
        </button>
        <button
          type="button"
          onClick={() => setViewMode('semana')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            viewMode === 'semana' ? 'bg-[#FF85C2] text-white' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          Semana
        </button>
        <button
          type="button"
          onClick={() => setViewMode('mes')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
            viewMode === 'mes' ? 'bg-[#FF85C2] text-white' : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          Mês
        </button>
      </div>

      {viewMode === 'dia' && <AgendaViewDia onOpenScreen={onOpenScreen} />}
      {viewMode === 'semana' && <AgendaViewSemana />}
      {viewMode === 'mes' && <AgendaViewMes />}
    </div>
  );
};

