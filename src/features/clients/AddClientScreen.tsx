import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useClients } from '../../presentation/hooks/useClients';
import { useToast } from '../../context/ToastContext';

interface AddClientScreenProps {
  onClose: () => void;
}

const DEFAULT_TAGS = ['VIP', 'Frequente', 'Nova', 'Devedora', 'Problemática'];

export const AddClientScreen: React.FC<AddClientScreenProps> = ({ onClose }) => {
  const { createClient, isCreating } = useClients();
  const { showToast } = useToast();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bday, setBday] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Nova']);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient({
        nome,
        telefone,
        status: 'ativo',
        totalFaltas: 0,
        tags: selectedTags,
        bday: bday || undefined,
      });
      showToast('🎉 Cliente cadastrada com sucesso!', 'success');
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao cadastrar cliente', 'error');
    }
  };

  return (
    <>
      <ScreenHeader title="Nova Cliente" onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-5 pb-24">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Nome Completo
              </label>
              <input
                type="text"
                placeholder="Ex: Amanda Ferreira"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
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
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Aniversário (Opcional)
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
              {DEFAULT_TAGS.map((tag) => {
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
              onClick={onClose}
              className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 py-4 rounded-2xl bg-[#FF85C2] text-white font-bold text-sm uppercase tracking-widest shadow-[0_4px_15px_rgba(255,133,194,0.3)] active:scale-[0.98] transition-transform disabled:opacity-70"
            >
              {isCreating ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};
