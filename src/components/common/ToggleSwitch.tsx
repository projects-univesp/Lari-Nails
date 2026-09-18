import React, { useState } from 'react';

interface ToggleSwitchProps {
  initial?: boolean;
  onChange?: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ initial = false, onChange }) => {
  const [isOn, setIsOn] = useState(initial);

  const handleToggle = () => {
    const nextState = !isOn;
    setIsOn(nextState);
    onChange?.(nextState);
  };

  return (
    <div
      className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-[#FF85C2]' : 'bg-gray-200'}`}
      onClick={handleToggle}
      role="switch"
      aria-checked={isOn}
    >
      <div className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );
};

