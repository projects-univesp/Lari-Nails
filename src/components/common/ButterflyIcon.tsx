import React from 'react';

interface ButterflyIconProps {
  className?: string;
}

export const ButterflyIcon: React.FC<ButterflyIconProps> = ({ className }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 14.5C9 14.5 4 19 2 15.5C0 12 3.5 8.5 7.5 10.5C9.5 11.5 11 13 12 13.5C13 13 14.5 11.5 16.5 10.5C20.5 8.5 24 12 22 15.5C20 19 15 14.5 12 14.5Z" />
      <path d="M12 14.5C11 11.5 9 6.5 10.5 5.5C12 4.5 13 6.5 12 14.5Z" opacity="0.8" />
      <path d="M12 14.5C13 11.5 15 6.5 13.5 5.5C12 4.5 11 6.5 12 14.5Z" opacity="0.8" />
    </svg>
  );
};

