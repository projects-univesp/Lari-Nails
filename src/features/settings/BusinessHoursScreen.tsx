import React, { useEffect, useState } from 'react';
import { Clock, Check, AlertCircle } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import type { ScreenOpenHandler } from '../../types';
import { operationsApi } from '../../infra/operations/operations-api';
import { useToast } from '../../context/ToastContext';

interface DaySchedule {
  dayOfWeek: number;
  id: string;
  day: string;
  short: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  lunchStart: string;
  lunchEnd: string;
}

const DAYS = [
  { id: 'sun', day: 'Domingo', short: 'Dom' },
  { id: 'mon', day: 'Segunda-feira', short: 'Seg' },
  { id: 'tue', day: 'Terça-feira', short: 'Ter' },
  { id: 'wed', day: 'Quarta-feira', short: 'Qua' },
  { id: 'thu', day: 'Quinta-feira', short: 'Qui' },
  { id: 'fri', day: 'Sexta-feira', short: 'Sex' },
  { id: 'sat', day: 'Sábado', short: 'Sáb' },
];

interface BusinessHoursScreenProps {
  onClose: () => void;
  onOpenScreen?: ScreenOpenHandler;
}

export const BusinessHoursScreen: React.FC<BusinessHoursScreenProps> = ({ onClose }) => {
  const { showToast } = useToast();
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    operationsApi.listBusinessHours().then((days) => {
      if (!alive) return;
      setSchedule(days.map((item) => ({
        dayOfWeek: item.dayOfWeek,
        ...DAYS[item.dayOfWeek],
        isOpen: item.isOpen,
        openTime: item.openTime ?? '', closeTime: item.closeTime ?? '',
        lunchStart: item.lunchStart ?? '', lunchEnd: item.lunchEnd ?? '',
      })));
    }).catch((cause: unknown) => {
      if (alive) setError(cause instanceof Error ? cause.message : 'Falha ao carregar horários.');
    }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const toggleDay = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => item.id === id ? {
        ...item, isOpen: !item.isOpen,
        openTime: item.openTime || '09:00', closeTime: item.closeTime || '18:00',
      } : item)
    );
  };

  const updateTime = (id: string, field: 'openTime' | 'closeTime', value: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const updateLunch = (id: string, field: 'lunchStart' | 'lunchEnd', value: string) => {
    setSchedule((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await operationsApi.saveBusinessHours(schedule.map((item) => ({
        dayOfWeek: item.dayOfWeek,
        isOpen: item.isOpen,
        openTime: item.openTime || null, closeTime: item.closeTime || null,
        lunchStart: item.lunchStart || null, lunchEnd: item.lunchEnd || null,
      })));
      setSavedSuccess(true);
      showToast('Horários salvos com sucesso.', 'success');
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao salvar horários.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ScreenHeader title="Horários" onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-5 pb-28 space-y-6">
        {loading && <p className="text-sm text-gray-500">Carregando horários...</p>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {/* Banner Informativo */}
        <div className="bg-gradient-to-r from-pink-50 to-white p-5 rounded-3xl border border-pink-100/70 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[var(--brand-pink-bg)] text-[#FF85C2] mt-0.5">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Disponibilidade do Bot</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              O assistente inteligente oferecerá apenas os horários compreendidos nos intervalos de atendimento definidos abaixo.
            </p>
          </div>
        </div>

        {/* Lista de Dias */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Expediente Semanal
            </span>
          </div>

          <div className="space-y-2.5">
            {schedule.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-3xl bg-white transition-all border ${
                  item.isOpen
                    ? 'border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]'
                    : 'border-transparent bg-gray-50/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs transition-colors ${
                        item.isOpen
                          ? 'bg-[var(--brand-pink-bg)] text-[#FF85C2]'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {item.short}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{item.day}</h4>
                      <p className="text-[11px] font-medium text-gray-400">
                        {item.isOpen ? 'Atendimento ativo' : 'Fechado / Sem expediente'}
                      </p>
                    </div>
                  </div>

                  {/* Toggle estilizado */}
                  <div
                    onClick={() => toggleDay(item.id)}
                    role="switch"
                    aria-checked={item.isOpen}
                    className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      item.isOpen ? 'bg-[#FF85C2]' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ${
                        item.isOpen ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Inputs de horário e almoço por dia */}
                {item.isOpen && (
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-3 animate-in fade-in duration-200">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Início
                      </label>
                      <input
                        type="time"
                        value={item.openTime}
                        onChange={(e) => updateTime(item.id, 'openTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100 font-semibold text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF85C2] transition-all"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Almoço</label>
                      <input type="time" value={item.lunchStart} onChange={(e) => updateLunch(item.id, 'lunchStart', e.target.value)} className="w-full px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100 font-semibold text-xs text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Até</label>
                      <input type="time" value={item.lunchEnd} onChange={(e) => updateLunch(item.id, 'lunchEnd', e.target.value)} className="w-full px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100 font-semibold text-xs text-gray-700" />
                    </div>

                    <span className="text-gray-300 text-xs font-bold pt-4">às</span>

                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Término
                      </label>
                      <input
                        type="time"
                        value={item.closeTime}
                        onChange={(e) => updateTime(item.id, 'closeTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-gray-50 border border-gray-100 font-semibold text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF85C2] transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dica de Segurança */}
        <div className="flex items-center gap-2 text-xs text-gray-400 px-2">
          <AlertCircle size={14} className="text-gray-400 shrink-0" />
          <span>Alterações entram em vigor imediatamente nas conversas do bot.</span>
        </div>

        {/* Botão Salvar Fixo no Final */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving || schedule.length !== 7}
            className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(255,133,194,0.3)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
              savedSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-[#FF85C2] text-white hover:bg-[#e86ba8]'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check size={18} /> Salvo com Sucesso!
              </>
            ) : (
              saving ? 'Salvando...' : 'Salvar Alterações'
            )}
          </button>
        </div>
      </main>
    </>
  );
};
