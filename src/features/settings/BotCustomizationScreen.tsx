import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  HelpCircle,
  RotateCcw,
  Send
} from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import type { ScreenOpenHandler } from '../../types';

const DEFAULT_WELCOME =
  'Olá, [NOME_CLIENTE]! Tudo bem? 💅✨\nSou a assistente virtual da Larissa Machado Nail Designer.\nComo posso te ajudar hoje?\n1 - Agendar Horário\n2 - Consultar Tabela de Preços\n3 - Falar com a Larissa';

const DEFAULT_REMINDER =
  'Oi, [NOME_CLIENTE]! Passando para lembrar do seu horário amanhã às [HORARIO] para [SERVICO]. 💖\n\nPodemos confirmar sua presença? Responda com SIM para confirmar ou NÃO para reagendar.';

const DEFAULT_THANKYOU =
  'Obrigada pela confiança, [NOME_CLIENTE]! Adorei cuidar das suas unhas hoje. Se puder, tire uma fotinho e me marque no Instagram @larissamachado.nails! 🥰💅';

const AVAILABLE_TAGS = [
  { tag: '[NOME_CLIENTE]', label: 'Nome da Cliente' },
  { tag: '[HORARIO]', label: 'Horário do Atendimento' },
  { tag: '[DATA]', label: 'Data do Agendamento' },
  { tag: '[SERVICO]', label: 'Nome do Serviço' },
  { tag: '[VALOR]', label: 'Preço do Serviço' },
];

interface BotCustomizationScreenProps {
  onClose: () => void;
  onOpenScreen?: ScreenOpenHandler;
}

export const BotCustomizationScreen: React.FC<BotCustomizationScreenProps> = ({ onClose }) => {
  const [welcomeMsg, setWelcomeMsg] = useState(DEFAULT_WELCOME);
  const [reminderMsg, setReminderMsg] = useState(DEFAULT_REMINDER);
  const [thankyouMsg, setThankyouMsg] = useState(DEFAULT_THANKYOU);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    setWelcomeMsg(DEFAULT_WELCOME);
    setReminderMsg(DEFAULT_REMINDER);
    setThankyouMsg(DEFAULT_THANKYOU);
  };

  return (
    <>
      <ScreenHeader
        title="Mensagens do Bot"
        onClose={onClose}
        rightAction={
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Restaurar mensagens padrão"
            className="p-2 rounded-full hover:bg-[var(--brand-pink-bg)] text-gray-500 hover:text-[#FF85C2] transition-colors cursor-pointer"
          >
            <RotateCcw size={18} />
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto p-5 pb-28 space-y-6">
        {/* Banner Informativo */}
        <div className="bg-gradient-to-r from-pink-50 to-white p-5 rounded-3xl border border-pink-100/70 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[var(--brand-pink-bg)] text-[#FF85C2] mt-0.5">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Personalização Inteligente</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              O bot substitui as tags entre colchetes automaticamente pelos dados de cada cliente no momento do disparo.
            </p>
          </div>
        </div>

        {/* Guia de Variáveis Dinâmicas */}
        <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle size={16} className="text-[#FF85C2]" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Variáveis Disponíveis
              </h4>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Toque para copiar</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((item) => {
              const isCopied = copiedTag === item.tag;
              return (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => handleCopyTag(item.tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isCopied
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 scale-95'
                      : 'bg-[var(--brand-pink-bg)] text-[#FF85C2] border-pink-100/80 hover:bg-pink-100/60'
                  }`}
                >
                  {isCopied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{item.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulário de Modelos */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Template 1: Boas-vindas */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#FF85C2]" />
                <label className="text-xs font-bold uppercase tracking-widest text-gray-700">
                  Mensagem de Boas-vindas
                </label>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-purple-50 text-purple-600">
                Primeiro Contato
              </span>
            </div>

            <textarea
              rows={5}
              value={welcomeMsg}
              onChange={(e) => setWelcomeMsg(e.target.value)}
              placeholder="Digite a mensagem de boas-vindas..."
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent font-medium text-xs text-gray-700 focus:bg-white focus:border-pink-200 focus:ring-2 focus:ring-[#FF85C2] transition-all resize-none leading-relaxed outline-none"
              required
            />
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium px-1">
              <span>Disparada quando um número novo chama no WhatsApp</span>
              <span>{welcomeMsg.length} caracteres</span>
            </div>
          </div>

          {/* Template 2: Lembrete de Agendamento */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-[#FF85C2]" />
                <label className="text-xs font-bold uppercase tracking-widest text-gray-700">
                  Lembrete de Agendamento
                </label>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-50 text-amber-600">
                24h Antes
              </span>
            </div>

            <textarea
              rows={4}
              value={reminderMsg}
              onChange={(e) => setReminderMsg(e.target.value)}
              placeholder="Digite a mensagem de lembrete..."
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent font-medium text-xs text-gray-700 focus:bg-white focus:border-pink-200 focus:ring-2 focus:ring-[#FF85C2] transition-all resize-none leading-relaxed outline-none"
              required
            />
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium px-1">
              <span>Solicita confirmação com SIM / NÃO</span>
              <span>{reminderMsg.length} caracteres</span>
            </div>
          </div>

          {/* Template 3: Agradecimento Pós-Atendimento */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF85C2]" />
                <label className="text-xs font-bold uppercase tracking-widest text-gray-700">
                  Agradecimento & Fidelização
                </label>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-600">
                Após Atendimento
              </span>
            </div>

            <textarea
              rows={3}
              value={thankyouMsg}
              onChange={(e) => setThankyouMsg(e.target.value)}
              placeholder="Digite a mensagem pós-atendimento..."
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent font-medium text-xs text-gray-700 focus:bg-white focus:border-pink-200 focus:ring-2 focus:ring-[#FF85C2] transition-all resize-none leading-relaxed outline-none"
            />
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium px-1">
              <span>Enviada automaticamente ao concluir o status</span>
              <span>{thankyouMsg.length} caracteres</span>
            </div>
          </div>

          {/* Botão Salvar Alterações */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(255,133,194,0.3)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                saveSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#FF85C2] text-white hover:bg-[#e86ba8]'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check size={18} /> Modelos Salvos!
                </>
              ) : (
                'Salvar Modelos'
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

