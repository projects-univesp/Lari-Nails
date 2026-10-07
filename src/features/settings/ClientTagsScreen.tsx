import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const ClientTagsScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { clientTags, addClientTag, removeClientTag } = useData();
  const { showToast } = useToast();
  const [tag, setTag] = useState('');
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!tag.trim()) return;
    setSaving(true);
    try { await addClientTag(tag.trim()); setTag(''); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Não foi possível salvar a tag.', 'error'); }
    finally { setSaving(false); }
  };
  const handleRemove = async (value: string) => {
    try { await removeClientTag(value); }
    catch (error) { showToast(error instanceof Error ? error.message : 'Não foi possível remover a tag.', 'error'); }
  };
  return <><ScreenHeader title="Tags de Clientes" onClose={onClose} /><main className="flex-1 overflow-y-auto p-5 space-y-5">
    <form onSubmit={handleSubmit} className="flex gap-2"><input value={tag} onChange={(event) => setTag(event.target.value)} placeholder="Nova tag" className="flex-1 px-4 py-3 rounded-2xl bg-white border-none" /><button disabled={saving} type="submit" className="px-4 rounded-2xl bg-[#FF85C2] text-white font-bold disabled:opacity-60">{saving ? 'Salvando…' : 'Adicionar'}</button></form>
    <div className="space-y-2">{clientTags.map((item) => <div key={item} className="bg-white p-4 rounded-2xl flex justify-between items-center"><span className="font-bold text-gray-700">{item}</span><button type="button" aria-label={`Remover ${item}`} onClick={() => void handleRemove(item)} className="text-red-400"><Trash2 size={18} /></button></div>)}</div>
  </main></>;
};
