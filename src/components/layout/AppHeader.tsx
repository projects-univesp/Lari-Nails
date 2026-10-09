import React, { useMemo, useState } from 'react';
import { Bell, LogOut, CalendarClock, Cake, CircleDollarSign, Sparkles } from 'lucide-react';
import { useAuth } from '../../presentation/hooks/useAuth';
import { useData } from '../../context/DataContext';
import { useClients } from '../../presentation/hooks/useClients';
import type { ScreenOpenHandler } from '../../types';

interface AppHeaderProps {
  name?: string;
  dateStr?: string;
  onOpenScreen: ScreenOpenHandler;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  name,
  dateStr,
  onOpenScreen,
}) => {
  const { currentUser, logout } = useAuth();
  const { appointments, transactions } = useData();
  const { clients } = useClients();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const displayName = name || currentUser?.firstName || 'Larissa';
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayLabel = dateStr || today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const birthdayClients = clients.filter((client) => {
    if (!client.bday) return false;
    const parts = client.bday.split(/[/-]/).map(Number);
    return parts[1] === today.getMonth() + 1 && (client.bday.includes('-') ? parts[2] : parts[0]) === today.getDate();
  });
  const notifications = useMemo(() => [
    ...appointments.filter((appointment) => appointment.status === 'aguardando').map((appointment) => ({
      key: `appointment-${appointment.id}`,
      title: 'Solicitação aguardando confirmação',
      description: `${appointment.client} · ${appointment.date} às ${appointment.time}`,
      icon: CalendarClock,
      screen: 'appointment_details' as const,
      data: appointment,
    })),
    ...appointments.filter((appointment) => appointment.status === 'reagendamento_solicitado' || appointment.status === 'aguardando_reagendamento').map((appointment) => ({
      key: `reschedule-${appointment.id}`,
      title: appointment.status === 'reagendamento_solicitado' ? 'Aguardando resposta da cliente' : 'Reagendamento para confirmar',
      description: `${appointment.client} · ${appointment.proposedDate || appointment.date} às ${appointment.proposedTime || appointment.time}`,
      icon: CalendarClock,
      screen: 'appointment_details' as const,
      data: appointment,
    })),
    ...transactions.filter((transaction) => transaction.status === 'pendente' && transaction.agreedPaymentDate === todayKey).map((transaction) => ({
      key: `payment-${transaction.id}`,
      title: 'Pagamento combinado para hoje',
      description: `${transaction.client} · ${transaction.amount}`,
      icon: CircleDollarSign,
      screen: 'faturamento' as const,
      data: undefined,
    })),
    ...birthdayClients.map((client) => ({
      key: `birthday-${client.id}`,
      title: 'Aniversário de cliente',
      description: `${client.nome} faz aniversário hoje`,
      icon: Cake,
      screen: 'client_profile' as const,
      data: client,
    })),
  ], [appointments, birthdayClients, todayKey, transactions]);
  const mockNotifications = notifications.length ? notifications : [{
    key: 'welcome-reminder',
    title: 'Agenda pronta para hoje',
    description: 'Confira os horários e acompanhe novas solicitações.',
    icon: Sparkles,
    screen: 'faturamento' as const,
    data: undefined,
  }];

  return (
    <header className="bg-white px-6 pt-12 sm:pt-8 pb-4 flex justify-between items-center sticky top-0 z-10 rounded-b-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-b border-gray-50">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Olá, {displayName}</h1>
        <p className="text-sm text-[#FF85C2] font-medium">{todayLabel}</p>
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
          onClick={() => setNotificationsOpen((open) => !open)}
          aria-label="Notificações"
          aria-expanded={notificationsOpen}
          className="relative p-2 bg-[var(--brand-pink-bg)] hover:bg-[#ffe1f0] transition-colors rounded-full text-[#FF85C2] cursor-pointer"
        >
          <Bell size={22} />
          {notifications.length > 0 && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--brand-pink-bg)]" />}
        </button>
      </div>
      {notificationsOpen && (
        <section aria-label="Central de notificações" className="absolute right-3 top-full z-50 mt-2 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-bold text-gray-800">Notificações</h2>
            <span className="text-xs text-gray-400">{notifications.length} novas</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {mockNotifications.map((notification) => {
              const Icon = notification.icon;
              return <button key={notification.key} type="button" onClick={() => { setNotificationsOpen(false); onOpenScreen(notification.screen, notification.data); }} className="flex w-full min-w-0 gap-3 border-b border-gray-50 px-4 py-3 text-left hover:bg-pink-50/50">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-pink-50 text-[#FF85C2]"><Icon size={17} /></span>
                <span className="min-w-0"><span className="block text-xs font-bold text-gray-800">{notification.title}</span><span className="mt-1 block truncate text-[11px] text-gray-500">{notification.description}</span></span>
              </button>;
            })}
          </div>
        </section>
      )}
    </header>
  );
};
