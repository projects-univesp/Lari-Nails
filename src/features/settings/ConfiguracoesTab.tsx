import React from 'react';
import { MessageCircle, Scissors, ChevronRight } from 'lucide-react';
import { ToggleSwitch } from '../../components/common/ToggleSwitch';
import type { ScreenOpenHandler } from '../../types';

interface ConfiguracoesTabProps {
  onOpenScreen: ScreenOpenHandler;
}

export const ConfiguracoesTab: React.FC<ConfiguracoesTabProps> = ({ onOpenScreen }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Ajustes</h2>
        <p className="text-gray-400 text-sm mt-1">Gerencie seu negócio e o bot</p>
      </div>

      {/* Automações do Bot */}
      <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 bg-gray-50/50 flex items-center gap-3 border-b border-gray-100">
          <MessageCircle size={18} className="text-[#FF85C2]" />
          <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">
            Automações WhatsApp
          </h3>
        </div>

        {/* Atalho para Personalizar Mensagens */}
        <div
          onClick={() => onOpenScreen('bot_customization')}
          className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50"
        >
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Mensagens do Bot</h4>
            <p className="text-[11px] text-[#FF85C2] mt-0.5 uppercase tracking-wide font-bold">
              Editar Boas-vindas e Lembretes
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>

        <div className="p-5 flex justify-between items-center border-b border-gray-50">
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Aprovação Automática</h4>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">
              Agendar sem perguntar
            </p>
          </div>
          <ToggleSwitch initial={false} />
        </div>
        <div className="p-5 flex justify-between items-center border-b border-gray-50">
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Lembrete 24h</h4>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">
              Confirmação dia anterior
            </p>
          </div>
          <ToggleSwitch initial={true} />
        </div>
        <div className="p-5 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Reagendamento pelo Bot</h4>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide max-w-[200px]">
              Permitir cliente reagendar sozinha até 24h antes
            </p>
          </div>
          <ToggleSwitch initial={true} />
        </div>
      </div>

      {/* Negócio */}
      <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 bg-gray-50/50 flex items-center gap-3 border-b border-gray-100">
          <Scissors size={18} className="text-[#FF85C2]" />
          <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">
            Catálogo e Horários
          </h3>
        </div>
        <div
          onClick={() => onOpenScreen('service_catalog')}
          className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50"
        >
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Serviços e Durações</h4>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">
              Gerenciar Preços
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
        <div
          onClick={() => onOpenScreen('business_hours')}
          className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Horário de Funcionamento</h4>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">
              Seg a Sáb • 09:00 às 19:00
            </p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
        <div onClick={() => onOpenScreen('client_tags')} className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
          <div><h4 className="font-bold text-gray-800 text-sm">Tags de Clientes</h4><p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wide">Gerenciar classificações</p></div>
          <ChevronRight size={18} className="text-gray-300" />
        </div>
      </div>
    </div>
  );
};
