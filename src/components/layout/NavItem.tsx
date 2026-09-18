import React from 'react';

interface NavItemProps {
  icon: React.ReactElement<{ size?: number; strokeWidth?: number }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-all ${
        isActive ? 'text-[#FF85C2]' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className={`transition-transform duration-300 ${isActive ? 'scale-110 mb-0.5' : 'scale-100'}`}>
        {React.cloneElement(icon, {
          size: isActive ? 24 : 22,
          strokeWidth: isActive ? 2.5 : 2,
        })}
      </div>
      <span className={`text-[10px] sm:text-xs tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
        {label}
      </span>
    </button>
  );
};

