import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  onClose: () => void;
  rightAction?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onClose, rightAction }) => {
  return (
    <header className="bg-white px-4 pt-12 sm:pt-8 pb-4 flex justify-between items-center sticky top-0 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          type="button"
          aria-label="Voltar"
          className="p-2 -ml-2 rounded-full hover:bg-[var(--brand-pink-bg)] hover:text-[#FF85C2] active:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
};

