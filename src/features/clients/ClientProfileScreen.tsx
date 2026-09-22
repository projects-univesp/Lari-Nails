import React from 'react';
import { Edit3, MessageCircle, CalendarDays as CalendarDaysIcon, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useClients } from '../../presentation/hooks/useClients';
import type { ClientEntity } from '../../core/clients/domain/client.entity';
import type { ScreenOpenHandler } from '../../types';

interface ClientLikeData {
  id?: string;
  name?: string;
  nome?: string;
  phone?: string;
  telefone?: string;
  tags?: string[];
  lastVisit?: string;
  bday?: string;
  totalFaltas?: number;
}

interface ClientProfileScreenProps {
  client?: ClientEntity | ClientLikeData;
  onClose: () => void;
  onOpenScreen: ScreenOpenHandler;
}

export const ClientProfileScreen: React.FC<ClientProfileScreenProps> = ({
  client,
  onClose,
  onOpenScreen,
}) => {
  const { clientHistory } = useData();
  const { showToast } = useToast();
  const { deleteClient } = useClients();

  const c = client as (ClientEntity & ClientLikeData) | undefined;
  const id = c?.id;
  const name = c?.nome || c?.name || 'Cliente';
  const phone = c?.telefone || c?.phone || '(11) 99999-9999';
  const tags: string[] = c?.tags || ['VIP'];
  const totalFaltas: number = c?.totalFaltas || 0;

  const handleWhatsApp = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
    showToast('💬 Abrindo conversa no WhatsApp...', 'info');
  };

  const handleDelete = async () => {
    if (!id) {
      showToast('Cliente sem ID para exclusão', 'error');
      return;
    }
    if (window.confirm(`Deseja realmente inativar a cliente ${name}?`)) {
      try {
        await deleteClient(id);
        showToast('Cliente desativada com sucesso!', 'success');
        onClose();
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro ao desativar cliente', 'error');
      }
    }
  };

  return (
    <>
      <ScreenHeader
        title="Perfil"
        onClose={onClose}
        rightAction={
          <div className="flex items-center gap-1">
            {id && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 cursor-pointer"
                aria-label="Excluir cliente"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenScreen('edit_client', client)}
              className="text-gray-400 hover:text-[#FF85C2] transition-colors p-2 cursor-pointer"
              aria-label="Editar cliente"
            >
              <Edit3 size={20} />
            </button>
          </div>
        }
      />
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="bg-white px-6 pt-6 pb-8 rounded-b-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-center relative">
          <div className="w-24 h-24 rounded-full bg-[var(--brand-pink-bg)] text-[#FF85C2] font-light flex items-center justify-center text-4xl mb-4 border-2 border-[var(--brand-pink-light)]">
            {name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-400 font-medium mt-1">{phone}</p>

          <div className="flex gap-1.5 mt-3 flex-wrap justify-center">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  tag === 'Devedora' || tag === 'Problemática'
                    ? 'bg-red-50 text-red-600'
                    : tag === 'VIP'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                {tag}
              </span>
            ))}
            {totalFaltas > 0 && (
              <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-amber-50 text-amber-600">
                {totalFaltas} {totalFaltas === 1 ? 'Falta' : 'Faltas'}
              </span>
            )}
          </div>

          <div className="flex gap-4 mt-8 w-full">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex-1 bg-[#e6f7ec] text-[#047857] py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-wider shadow-sm cursor-pointer hover:bg-[#d1fae5]"
            >
              <MessageCircle size={18} /> WhatsApp
            </button>
            <button
              type="button"
              onClick={() => onOpenScreen('add_appointment', { client: name })}
              className="flex-1 bg-[#FAFAFA] border border-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-gray-100 uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <CalendarDaysIcon size={18} /> Agendar
            </button>
          </div>
        </div>

        {/* Histórico com Status Financeiro */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-widest">
              Histórico de Atendimentos
            </h3>
            <span className="text-[10px] text-gray-400 font-medium">Status</span>
          </div>

          <div className="space-y-3">
            {clientHistory.map((item, idx) => {
              const isReceived = item.paymentStatus === 'recebido';

              return (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() =>
                    item.paymentStatus === 'pendente' &&
                    onOpenScreen('checkout', {
                      client: name,
                      service: item.service,
                      date: item.date,
                      time: '12:00',
                      status: 'concluido',
                      price: item.amount,
                      historyId: item.id,
                    })
                  }
                  className="bg-white p-4 rounded-3xl flex justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-transparent hover:border-gray-50 w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                        isReceived
                          ? 'bg-[#e6f7ec] text-[#047857]'
                          : 'bg-[#fffbeb] text-[#b45309]'
                      }`}
                    >
                      {isReceived ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.service}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                          {item.date}
                        </span>
                        {item.paymentMethod && (
                          <>
                            <span className="text-[10px] text-gray-300">•</span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              {item.paymentMethod}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-extrabold text-gray-700">
                      {item.amount || 'R$ 120,00'}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isReceived
                          ? 'bg-[#e6f7ec] text-[#047857]'
                          : 'bg-[#fffbeb] text-[#b45309] border border-amber-200'
                      }`}
                    >
                      {isReceived ? 'Recebido' : 'Pendente'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};
