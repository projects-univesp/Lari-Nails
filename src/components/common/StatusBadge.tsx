import React from 'react';
import type { AppointmentStatus } from '../../types';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const BADGE_CONFIG: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  aguardando: { bg: 'bg-[#fffbeb]', text: 'text-[#b45309]', label: 'Aguardando' },
  confirmado: { bg: 'bg-[#e6f7ec]', text: 'text-[#047857]', label: 'Confirmado' },
  pendente: { bg: 'bg-[#fffbeb]', text: 'text-[#b45309]', label: 'Aguardando' },
  concluido: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Concluído' },
  bloqueado: { bg: 'bg-[#fef2f2]', text: 'text-[#be123c]', label: 'Bloqueado' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = BADGE_CONFIG[status] || BADGE_CONFIG.concluido;

  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

