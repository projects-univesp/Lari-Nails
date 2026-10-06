import React, { useState } from 'react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import type { Service } from '../../types';
import { useToast } from '../../context/ToastContext';

interface AddServiceScreenProps {
  onClose: () => void;
  onSave?: (service: Service) => void;
  service?: Service;
}

export const AddServiceScreen: React.FC<AddServiceScreenProps> = ({ onClose, onSave, service }) => {
  const { addService, updateService } = useData();
  const { showToast } = useToast();
  const [name, setName] = useState(service?.name || '');
  const [price, setPrice] = useState(service?.priceCents !== undefined ? String(service.priceCents / 100) : '');
  const [duration, setDuration] = useState(String(service?.durationMinutes ?? 60));
  const [category, setCategory] = useState(service?.category || 'Alongamento');
  const [description, setDescription] = useState(service?.description || '');
  const [active, setActive] = useState(service?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceCents = Math.round(Number(price.replace(',', '.')) * 100);
    if (!Number.isInteger(priceCents) || priceCents < 0) {
      showToast('Informe um preço válido.', 'warning');
      return;
    }
    const input = { name: name.trim(), category, description: description.trim() || null, priceCents, durationMinutes: Number(duration), active };
    setSaving(true);
    try {
      if (service?.id) await updateService(String(service.id), input);
      else await addService(input);
      onSave?.({ ...input, id: service?.id, price: `R$ ${(priceCents / 100).toFixed(2)}`, duration: `${duration} min` });
      showToast('Serviço salvo com sucesso.', 'success');
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao salvar serviço.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ScreenHeader title={service ? 'Editar Serviço' : 'Novo Serviço'} onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-5 pb-24">
        <form
          className="space-y-6 bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
              Nome do Serviço
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Banho de Gel"
              className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Valor (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Duração
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium appearance-none cursor-pointer"
                required
              >
                <option value="30">30 min</option>
                <option value="60">1 hora</option>
                <option value="90">1h 30min</option>
                <option value="120">2 horas</option>
                <option value="150">2h 30min</option>
                <option value="180">3 horas</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">Descrição</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={5000} className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium" />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Serviço ativo
          </label>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium appearance-none cursor-pointer"
            >
              <option value="Alongamento">Alongamento</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Esmaltação">Esmaltação</option>
              <option value="Remoção">Remoção</option>
              <option value="Spa">Spa</option>
            </select>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-[#FF85C2] text-white font-bold text-sm uppercase tracking-widest shadow-[0_4px_15px_rgba(255,133,194,0.3)] active:scale-[0.98] transition-transform cursor-pointer hover:bg-[#e86ba8]"
            >
              {saving ? 'Salvando...' : 'Salvar Serviço'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};
