import React, { useState } from 'react';
import { Tag, Trash2 } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useClients } from '../../presentation/hooks/useClients';
import { useToast } from '../../context/ToastContext';
import type { ClientEntity } from '../../core/clients/domain/client.entity';
import { useData } from '../../context/DataContext';

interface ClientLikeData {
  id?: string;
  name?: string;
  nome?: string;
  phone?: string;
  telefone?: string;
  tags?: string[];
  lastVisit?: string;
  bday?: string;
}

interface EditClientScreenProps {
  client?: ClientEntity | ClientLikeData;
  onClose: () => void;
  onSave?: (updatedClient: ClientLikeData | ClientEntity) => void;
}

export const EditClientScreen: React.FC<EditClientScreenProps> = ({
  client,
  onClose,
  onSave,
}) => {
  const { updateClient, deleteClient, isUpdating } = useClients();
  const { showToast } = useToast();
  const { clientTags } = useData();

  const c = client as (ClientEntity & ClientLikeData) | undefined;
  const id = c?.id;
  const initialName = c?.nome || c?.name || '';
  const initialPhone = c?.telefone || c?.phone || '';
  const initialBday = c?.bday || '';
  const initialTags = c?.tags || ['VIP'];

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [bday, setBday] = useState(initialBday);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      showToast('Cliente não possui ID válido para edição na API', 'warning');
      onClose();
      return;
    }

    try {
      const updated = await updateClient({
        id,
        nome: name,
        telefone: phone,
        tags: selectedTags,
        bday: bday || undefined,
      });

      showToast('Dados da cliente atualizados com sucesso!', 'success');
      onSave?.(updated);
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao atualizar dados', 'error');
    }
  };

  const handleDelete = async () => {
    if (!id) {
      onClose();
      return;
    }
    if (window.confirm(`Deseja desativar ${name}?`)) {
      try {
        await deleteClient(id);
        showToast('Cliente desativada!', 'success');
        onClose();
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro ao desativar', 'error');
      }
    }
  };

  return (
    <>
      <ScreenHeader title="Editar Cliente" onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-5 pb-24">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium"
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                WhatsApp / Telefone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Aniversário
              </label>
              <input
                type="text"
                value={bday}
                onChange={(e) => setBday(e.target.value)}
                placeholder="DD/MM"
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium"
              />
            </div>
          </div>

          <div className="space-y-3 bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-[#FF85C2]" />
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Classificação (Tags)
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {clientTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                const isWarning = tag === 'Devedora' || tag === 'Problemática';
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      isSelected
                        ? isWarning
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-[#FF85C2] text-white border-[#FF85C2]'
                        : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Excluir ou cancelar"
              className="p-4 rounded-2xl bg-white border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={24} />
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 py-4 rounded-2xl bg-[#FF85C2] text-white font-bold text-sm uppercase tracking-widest shadow-[0_4px_15px_rgba(255,133,194,0.3)] active:scale-[0.98] transition-transform disabled:opacity-70"
            >
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};
