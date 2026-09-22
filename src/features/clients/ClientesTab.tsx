import React, { useState } from 'react';
import { Search, Phone, UserPlus } from 'lucide-react';
import { useClients } from '../../presentation/hooks/useClients';
import type { ScreenOpenHandler } from '../../types';

interface ClientesTabProps {
  onOpenScreen: ScreenOpenHandler;
}

export const ClientesTab: React.FC<ClientesTabProps> = ({ onOpenScreen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { clients, isLoading, error } = useClients({ search: searchTerm });

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
        <button
          type="button"
          onClick={() => onOpenScreen('add_client')}
          aria-label="Cadastrar nova cliente"
          className="w-14 h-14 bg-[#FF85C2] text-white rounded-3xl flex items-center justify-center shadow-[0_2px_15px_rgba(255,133,194,0.3)] hover:bg-[#e86ba8] active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <UserPlus size={22} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 text-gray-400">
          <div className="w-8 h-8 border-3 border-[#FF85C2] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest font-bold">Carregando clientes...</p>
        </div>
      ) : error ? (
        <div className="p-5 bg-red-50 text-red-600 rounded-3xl text-sm font-medium text-center">
          Erro ao sincronizar clientes com a API.
        </div>
      ) : clients.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <p className="text-sm font-medium">Nenhuma cliente encontrada.</p>
          <button
            type="button"
            onClick={() => onOpenScreen('add_client')}
            className="mt-3 text-xs text-[#FF85C2] font-bold uppercase tracking-wider hover:underline"
          >
            Cadastrar primeira cliente
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.id || client.telefone}
              onClick={() => onOpenScreen('client_profile', client)}
              className="bg-white p-4 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between active:scale-[0.98] cursor-pointer hover:shadow-[0_4px_15px_rgba(255,133,194,0.08)] transition-all border border-transparent hover:border-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--brand-pink-bg)] text-[#FF85C2] font-light flex items-center justify-center text-xl border border-[var(--brand-pink-light)]">
                  {client.initialLetter}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{client.nome}</h4>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {client.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                    {client.totalFaltas > 0 && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-50 text-amber-600">
                        {client.totalFaltas} {client.totalFaltas === 1 ? 'Falta' : 'Faltas'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{client.lastVisit}</p>
                <button
                  type="button"
                  aria-label={`Ligar para ${client.nome}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${client.cleanPhone}`, '_self');
                  }}
                  className="w-8 h-8 rounded-full bg-[#e6f7ec] text-[#047857] flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Phone size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
