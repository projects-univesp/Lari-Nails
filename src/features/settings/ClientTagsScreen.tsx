import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';

export const ClientTagsScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { clientTags, addClientTag, removeClientTag } = useData();
  const [tag, setTag] = useState('');
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!tag.trim()) return;
    addClientTag(tag.trim());
    setTag('');
  };
  return <><ScreenHeader title="Tags de Clientes" onClose={onClose} /><main className="flex-1 overflow-y-auto p-5 space-y-5">
    <form onSubmit={handleSubmit} className="flex gap-2"><input value={tag} onChange={(event) => setTag(event.target.value)} placeholder="Nova tag" className="flex-1 px-4 py-3 rounded-2xl bg-white border-none" /><button type="submit" className="px-4 rounded-2xl bg-[#FF85C2] text-white font-bold">Adicionar</button></form>
    <div className="space-y-2">{clientTags.map((item) => <div key={item} className="bg-white p-4 rounded-2xl flex justify-between items-center"><span className="font-bold text-gray-700">{item}</span><button type="button" aria-label={`Remover ${item}`} onClick={() => removeClientTag(item)} className="text-red-400"><Trash2 size={18} /></button></div>)}</div>
  </main></>;
};
