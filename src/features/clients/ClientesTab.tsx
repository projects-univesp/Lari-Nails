import React, { useState } from 'react';
import { Search, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { ScreenOpenHandler } from '../../types';

interface ClientesTabProps {
  onOpenScreen: ScreenOpenHandler;
}

export const ClientesTab: React.FC<ClientesTabProps> = ({
  onOpenScreen,
}) => {
  const { clients } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-4 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full pl-14 pr-5 py-4 rounded-3xl bg-white border-none shadow-[0_2px_15px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium text-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredClients.map((client, idx) => (
          <div
            key={client.phone || idx}
            onClick={() => onOpenScreen('client_profile', client)}
            className="bg-white p-4 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between active:scale-[0.98] cursor-pointer hover:shadow-[0_4px_15px_rgba(255,133,194,0.08)] transition-all border border-transparent hover:border-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-pink-bg)] text-[#FF85C2] font-light flex items-center justify-center text-xl border border-[var(--brand-pink-light)]">
                {client.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{client.name}</h4>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {client.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        tag === 'Devedora'
                          ? 'bg-red-50 text-red-600'
                          : tag === 'VIP'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{client.lastVisit}</p>
              <button
                type="button"
                aria-label={`Ligar para ${client.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${client.phone.replace(/\D/g, '')}`, '_self');
                }}
                className="w-8 h-8 rounded-full bg-[#e6f7ec] text-[#047857] flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Phone size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

