import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../presentation/hooks/useAuth';
import { useData } from '../../context/DataContext';

interface AppHeaderProps {
  name?: string;
  dateStr?: string;
  onOpenNotifications: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  name,
  dateStr = 'Sábado, 5 de Setembro',
  onOpenNotifications,
}) => {
  const { currentUser, logout } = useAuth();
  const { pendingApprovals } = useData();
  const pendingCount = pendingApprovals.length;
  const displayName = name || currentUser?.firstName || 'Larissa';

  return (
    <header className="bg-white px-6 pt-12 sm:pt-8 pb-4 flex justify-between items-center sticky top-0 z-10 rounded-b-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-b border-gray-50">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Olá, {displayName}</h1>
        <p className="text-sm text-[#FF85C2] font-medium">{dateStr}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => logout()}
          aria-label="Sair da conta"
          title="Sair"
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full cursor-pointer"
        >
          <LogOut size={18} />
        </button>
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label={pendingCount ? `Notificações: ${pendingCount} agendamentos aguardando aprovação` : 'Notificações: nenhum agendamento pendente'}
          title={pendingCount ? `${pendingCount} agendamentos aguardando aprovação` : 'Nenhum agendamento pendente'}
          className="relative p-2 bg-[var(--brand-pink-bg)] hover:bg-[#ffe1f0] transition-colors rounded-full text-[#FF85C2] cursor-pointer"
        >
          <Bell size={22} />
          {pendingCount > 0 && <span aria-hidden="true" className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white rounded-full border-2 border-white text-[10px] font-bold flex items-center justify-center">{pendingCount > 99 ? '99+' : pendingCount}</span>}
        </button>
      </div>
    </header>
  );
};
