import React, { useState } from 'react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { AgendaBlock } from '../../types';

interface AgendaBlockScreenProps {
  block?: AgendaBlock;
  onClose: () => void;
}

export const AgendaBlockScreen: React.FC<AgendaBlockScreenProps> = ({ block, onClose }) => {
  const { addAgendaBlock, updateAgendaBlock, deleteAgendaBlock } = useData();
  const { showToast } = useToast();
  const [reason, setReason] = useState(block?.reason || 'Pausa para almoço');
  const [date, setDate] = useState(block?.date === 'Hoje' ? '' : block?.date || '');
  const [startTime, setStartTime] = useState(block?.startTime || '12:00');
  const [endTime, setEndTime] = useState(block?.endTime || '13:00');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = { reason, date: date || 'Hoje', startTime, endTime };
    if (block) {
      updateAgendaBlock({ ...value, id: block.id });
      showToast('Bloqueio atualizado na agenda.', 'success');
    } else {
      addAgendaBlock(value);
      showToast('Bloqueio criado na agenda.', 'success');
    }
    onClose();
  };

  const handleDelete = () => {
    if (!block) return;
    deleteAgendaBlock(block.id);
    showToast('Bloqueio removido da agenda.', 'info');
    onClose();
  };

  return (
    <>
      <ScreenHeader title={block ? 'Editar Bloqueio' : 'Novo Bloqueio'} onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-5 pb-24">
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-5 rounded-3xl">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Motivo</label>
            <input value={reason} onChange={(event) => setReason(event.target.value)} required className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Data</label>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Início<input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required className="mt-2 w-full px-3 py-3 rounded-2xl bg-gray-50 border-none" /></label>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Fim<input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} required className="mt-2 w-full px-3 py-3 rounded-2xl bg-gray-50 border-none" /></label>
          </div>
          <button type="submit" className="w-full py-4 rounded-2xl bg-amber-500 text-white font-bold uppercase tracking-widest">{block ? 'Salvar Bloqueio' : 'Criar Bloqueio'}</button>
          {block && <button type="button" onClick={handleDelete} className="w-full py-3 rounded-2xl border border-red-100 text-red-500 font-bold">Remover Bloqueio</button>}
        </form>
      </main>
    </>
  );
};
