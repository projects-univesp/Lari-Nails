import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface PendingApprovalsScreenProps {
  onClose: () => void;
}

export const PendingApprovalsScreen: React.FC<PendingApprovalsScreenProps> = ({ onClose }) => {
  const { pendingApprovals, approvePending, reschedulePending, denyPending, operationsError } = useData();
  const { showToast } = useToast();
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [denyingId, setDenyingId] = useState<string | null>(null);
  const [denyReason, setDenyReason] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const visibleApprovals = pendingApprovals.filter((appointment) => appointment.status !== 'negado');

  const handleApprove = async (id: string, name: string) => {
    setSavingId(id);
    try {
      await approvePending(id);
      showToast(`✅ Agendamento de ${name} aprovado com sucesso!`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao aprovar agendamento.', 'warning');
    } finally {
      setSavingId(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    if (!denyReason.trim()) return;
    setSavingId(id);
    try {
      await denyPending(id, denyReason.trim());
      setDenyingId(null);
      setDenyReason('');
      showToast(`Agendamento de ${name} negado.`, 'warning');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao negar agendamento.', 'warning');
    } finally {
      setSavingId(null);
    }
  };

  const handleReschedule = async (id: string, name: string) => {
    if (!newDate) return;
    setSavingId(id);
    try {
      await reschedulePending(id, newDate, newTime);
      setReschedulingId(null);
      showToast(`Novo horário sugerido para ${name}.`, 'info');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao sugerir horário.', 'warning');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <ScreenHeader title="Aprovações Pendentes" onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest px-1 mb-4 text-center">
          Confirme ou responda aos pedidos de horário.
        </p>

        {operationsError && <p role="alert" className="text-sm text-red-600">{operationsError}</p>}
        {visibleApprovals.length === 0 && !operationsError ? (
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
                  disabled={savingId === apt.id}
                  className="flex-1 py-3.5 rounded-2xl bg-gray-50 text-gray-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X size={18} /> Negar
                </button>
                <button type="button" disabled={savingId === apt.id} onClick={() => setReschedulingId(reschedulingId === apt.id ? null : apt.id)} className="flex-1 py-3.5 rounded-2xl bg-gray-50 text-gray-500 font-bold text-sm">Sugerir horário</button>
                <button
                  type="button"
                  onClick={() => handleApprove(apt.id, apt.name)}
                  disabled={savingId === apt.id}
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
