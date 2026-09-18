import React from 'react';
import { Bell } from 'lucide-react';

interface AppHeaderProps {
  name?: string;
  dateStr?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  name = 'Larissa',
  dateStr = 'Sábado, 5 de Setembro',
}) => {
  return (
    <header className="bg-white px-6 pt-12 sm:pt-8 pb-4 flex justify-between items-center sticky top-0 z-10 rounded-b-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-b border-gray-50">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Olá, {name}</h1>
        <p className="text-sm text-[#FF85C2] font-medium">{dateStr}</p>
      </div>
      <button
        type="button"
        aria-label="Notificações"
        className="relative p-2 bg-[var(--brand-pink-bg)] hover:bg-[#ffe1f0] transition-colors rounded-full text-[#FF85C2]"
      >
        <Bell size={22} />
        <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--brand-pink-bg)]" />
      </button>
    </header>
  );
};

