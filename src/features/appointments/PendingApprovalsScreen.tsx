import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface PendingApprovalsScreenProps {
  onClose: () => void;
}

export const PendingApprovalsScreen: React.FC<PendingApprovalsScreenProps> = ({ onClose }) => {
  const { pendingApprovals, approvePending, reschedulePending, denyPending } = useData();
  const { showToast } = useToast();
  const [reschedulingId, setReschedulingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [denyingId, setDenyingId] = useState<number | null>(null);
  const [denyReason, setDenyReason] = useState('');
  const visibleApprovals = pendingApprovals.filter((appointment) => appointment.status !== 'negado');

  const handleApprove = (id: number, name: string) => {
    approvePending(id);
    showToast(`✅ Agendamento de ${name} aprovado com sucesso!`, 'success');
  };

  const handleReject = (id: number, name: string) => {
    if (!denyReason.trim()) return;
    denyPending(id, denyReason.trim());
    setDenyingId(null);
    setDenyReason('');
    showToast(`Agendamento de ${name} negado e motivo enviado à cliente.`, 'warning');
  };

  const handleReschedule = (id: number, name: string) => {
    if (!newDate) return;
    reschedulePending(id, newDate, newTime);
    setReschedulingId(null);
    showToast(`Novo horário sugerido para ${name}.`, 'info');
  };

  return (
    <>
      <ScreenHeader title="Aprovações Pendentes" onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest px-1 mb-4 text-center">
          O bot reservou. Confirme abaixo.
        </p>

        {visibleApprovals.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm font-medium">
            Nenhuma aprovação pendente no momento! 🎉
          </div>
        ) : (
          visibleApprovals.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-50"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{apt.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{apt.service}</p>
                </div>
                <div className="bg-[var(--brand-pink-bg)] text-[#FF85C2] px-3 py-2 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{apt.date}</span>
                  <span className="text-lg font-bold">{apt.time}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDenyingId(denyingId === apt.id ? null : apt.id)}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-50 text-gray-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X size={18} /> Negar
                </button>
                <button type="button" onClick={() => setReschedulingId(reschedulingId === apt.id ? null : apt.id)} className="flex-1 py-3.5 rounded-2xl bg-gray-50 text-gray-500 font-bold text-sm">Sugerir horário</button>
                <button
                  type="button"
                  onClick={() => handleApprove(apt.id, apt.name)}
                  className="flex-1 py-3.5 rounded-2xl bg-[#FF85C2] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,133,194,0.3)] active:scale-95 transition-all hover:bg-[#e86ba8] cursor-pointer"
                >
                  <Check size={18} /> Aprovar
                </button>
              </div>
              {reschedulingId === apt.id && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} className="px-3 py-3 rounded-xl bg-gray-50" />
                  <input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} className="px-3 py-3 rounded-xl bg-gray-50" />
                  <button type="button" onClick={() => handleReschedule(apt.id, apt.name)} className="col-span-2 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold">Enviar sugestão</button>
                </div>
              )}
              {denyingId === apt.id && (
                <div className="mt-3 space-y-2">
                  <input value={denyReason} onChange={(event) => setDenyReason(event.target.value)} placeholder="Motivo da negativa" required className="w-full px-3 py-3 rounded-xl bg-gray-50" />
                  <button type="button" onClick={() => handleReject(apt.id, apt.name)} className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold">Confirmar negativa</button>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </>
  );
};
