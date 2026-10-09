import React from 'react';
import { CalendarDays as CalendarDaysIcon, MessageCircle, X, CheckCircle2 } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { ScreenOpenHandler, Appointment } from '../../types';

interface AppointmentDetailsScreenProps {
  appointment?: Appointment;
  onClose: () => void;
  onOpenScreen: ScreenOpenHandler;
}

export const AppointmentDetailsScreen: React.FC<AppointmentDetailsScreenProps> = ({
  appointment,
  onClose,
  onOpenScreen,
}) => {
  const { appointments, cancelAppointment, updateAppointmentStatus, confirmAppointmentReschedule, recordClientRescheduleResponse } = useData();
  const { showToast } = useToast();

  const apt: Appointment = (appointment?.id ? appointments.find((item) => item.id === appointment.id) : undefined) || appointment || {
    client: 'Cliente',
    time: '00:00',
    date: 'Data',
    service: 'Serviço',
    status: 'confirmado',
    price: 'R$ 120,00'
  };

  const isConcluded = apt.status === 'concluido';
  const isWaitingForClient = apt.status === 'reagendamento_solicitado';
  const isWaitingForNailArtist = apt.status === 'aguardando_reagendamento';
  const canConfirm = apt.status === 'aguardando' || isWaitingForNailArtist;

  const handleSendMessage = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Olá ${apt.client}, confirmando seu horário de ${apt.service} às ${apt.time}.`
      )}`,
      '_blank'
    );
    showToast('💬 WhatsApp aberto para contato!', 'info');
  };

  const handleCancelAppointment = () => {
    cancelAppointment(apt.id);
    showToast('❌ Agendamento cancelado.', 'warning');
    onClose();
  };

  const handleOpenCheckout = () => {
    onOpenScreen('checkout', apt);
  };

  const handleConfirm = () => {
    if (isWaitingForNailArtist) confirmAppointmentReschedule(apt.id);
    else updateAppointmentStatus(apt.id, 'confirmado');
    showToast('Agendamento confirmado.', 'success');
    onClose();
  };

  const handleClientAcceptedSuggestion = () => {
    if (!apt.id || !apt.proposedDate || !apt.proposedTime) return;
    recordClientRescheduleResponse(apt.id, apt.proposedDate, apt.proposedTime);
    showToast('Confirmação da cliente registrada. Confirme o novo horário.', 'success');
  };

  return (
    <>
      <ScreenHeader
        title="Detalhes"
        onClose={onClose}
        rightAction={<StatusBadge status={apt.status} />}
      />
      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-6 pb-24">
        {isWaitingForClient && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
            Aguardando confirmação de reagendamento solicitado para a cliente.
            {apt.proposedDate && <p className="mt-2 font-semibold">Sugestão: {apt.proposedDate} às {apt.proposedTime}</p>}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={handleClientAcceptedSuggestion} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-sky-800 border border-sky-200">Registrar aceite da cliente</button>
              <button type="button" onClick={() => onOpenScreen('add_appointment', { mode: 'client_reschedule_response', ...apt })} className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-sky-800 border border-sky-200">Registrar outra data enviada</button>
            </div>
          </div>
        )}
        {isWaitingForNailArtist && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
            A cliente confirmou ou enviou uma nova data. Confirme o horário para atualizar a agenda.
            <p className="mt-2 font-semibold">Nova data: {apt.date} às {apt.time}</p>
          </div>
        )}
        {apt.status === 'aguardando' && (
          <button type="button" onClick={handleConfirm} className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white">Confirmar agendamento</button>
        )}
        {canConfirm && isWaitingForNailArtist && (
          <button type="button" onClick={handleConfirm} className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white">Confirmar novo horário</button>
        )}
        {isConcluded && apt.paymentStatus === 'pendente' && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Pagamento pendente{apt.agreedPaymentDate ? `; combinado para ${new Date(`${apt.agreedPaymentDate}T12:00:00`).toLocaleDateString('pt-BR')}` : ', sem data combinada'}.
          </div>
        )}
        {/* Card do Cliente e Serviço */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--brand-pink-bg)] text-[#FF85C2] font-light flex items-center justify-center text-3xl mb-4 border-2 border-[var(--brand-pink-light)]">
            {apt.client.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{apt.client}</h2>
          <p className="text-gray-500 text-sm font-medium">{apt.service}</p>

          <div className="flex gap-4 mt-6 bg-gray-50 p-4 rounded-2xl w-full justify-center">
            <div className="text-center px-4 border-r border-gray-200">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                Data
              </span>
              <span className="font-bold text-gray-700">{apt.date}</span>
            </div>
            <div className="text-center px-4 border-r border-gray-200">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                Horário
              </span>
              <span className="font-bold text-[#FF85C2]">{apt.time}</span>
            </div>
            <div className="text-center px-4">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                Valor
              </span>
              <span className="font-bold text-gray-700">{apt.price || 'R$ 120'}</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          {/* BOTÃO PRINCIPAL: Concluir Atendimento / Checkout */}
          {apt.status === 'confirmado' ? (
            <button
              type="button"
              onClick={handleOpenCheckout}
              className="w-full py-4 rounded-2xl bg-[#FF85C2] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#e86ba8] active:scale-[0.98] transition-all uppercase tracking-wider shadow-[0_4px_15px_rgba(255,133,194,0.35)] cursor-pointer"
            >
              <CheckCircle2 size={20} /> Concluir Atendimento
            </button>
          ) : isConcluded ? (
            <div className="w-full py-3.5 rounded-2xl bg-[#e6f7ec] text-[#047857] font-bold text-xs flex items-center justify-center gap-2 uppercase tracking-wider border border-[#a7f3d0]">
              <CheckCircle2 size={18} /> Atendimento Concluído {apt.paymentStatus === 'pendente' ? '• Pagamento pendente' : '• Pago'}
            </div>
          ) : null}

          {!isConcluded && !isWaitingForClient && <button
            type="button"
            onClick={() => onOpenScreen('add_appointment', { mode: 'reschedule', ...apt })}
            className="w-full py-4 rounded-2xl bg-[#FAFAFA] border-2 border-gray-100 text-gray-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all uppercase tracking-wider cursor-pointer"
          >
            <CalendarDaysIcon size={18} /> Reagendar
          </button>}

          <button
            type="button"
            onClick={handleSendMessage}
            className="w-full py-4 rounded-2xl bg-[#e6f7ec] text-[#047857] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#d1fae5] active:scale-[0.98] transition-all uppercase tracking-wider cursor-pointer"
          >
            <MessageCircle size={18} /> Enviar Mensagem
          </button>

          {!isConcluded && apt.status !== 'cancelado' && (
            <button
              type="button"
              onClick={handleCancelAppointment}
              className="w-full py-4 rounded-2xl bg-white border border-red-100 text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 active:scale-[0.98] transition-all uppercase tracking-wider mt-4 cursor-pointer"
            >
              <X size={18} /> Cancelar Agendamento
            </button>
          )}
        </div>
      </main>
    </>
  );
};
