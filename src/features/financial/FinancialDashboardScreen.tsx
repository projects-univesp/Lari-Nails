import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Download
} from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import type { ScreenOpenHandler } from '../../types';

interface Transaction {
  id: number;
  service: string;
  client: string;
  amount: string;
  method: string;
  status: 'recebido' | 'pendente';
  date: string;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: 1, service: 'Esmaltação em Gel', client: 'Amanda Silva', amount: 'R$ 60,00', method: 'Pix', status: 'recebido', date: 'Hoje, 11:30' },
  { id: 2, service: 'Manutenção Fibra', client: 'Bruna Costa', amount: 'R$ 120,00', method: 'Cartão', status: 'recebido', date: 'Hoje, 09:00' },
  { id: 3, service: 'Alongamento Acrílico', client: 'Camila Pires', amount: 'R$ 180,00', method: 'Pix', status: 'recebido', date: 'Ontem, 16:45' },
  { id: 4, service: 'Banho de Gel', client: 'Diana Rocha', amount: 'R$ 90,00', method: 'Cartão', status: 'recebido', date: 'Ontem, 14:00' },
  { id: 5, service: 'Remoção + Spa', client: 'Gabriela Lima', amount: 'R$ 75,00', method: 'Dinheiro', status: 'pendente', date: '03 Set, 10:15' },
  { id: 6, service: 'Manutenção Fibra', client: 'Helena Souza', amount: 'R$ 120,00', method: 'Pix', status: 'recebido', date: '02 Set, 15:30' },
];

interface FinancialDashboardScreenProps {
  onClose: () => void;
  onOpenScreen?: ScreenOpenHandler;
}

export const FinancialDashboardScreen: React.FC<FinancialDashboardScreenProps> = ({ onClose }) => {
  const [periodFilter, setPeriodFilter] = useState<'mes' | 'semana' | 'hoje'>('mes');

  return (
    <>
      <ScreenHeader
        title="Faturamento"
        onClose={onClose}
        rightAction={
          <button
            type="button"
            aria-label="Exportar relatório"
            className="p-2 rounded-full hover:bg-[var(--brand-pink-bg)] text-gray-500 hover:text-[#FF85C2] transition-colors cursor-pointer"
          >
            <Download size={20} />
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto p-5 pb-28 space-y-6">
        {/* Seletor de Período */}
        <div className="flex bg-white p-1 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] mx-0.5">
          <button
            type="button"
            onClick={() => setPeriodFilter('hoje')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              periodFilter === 'hoje'
                ? 'bg-[#FF85C2] text-white shadow-sm'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => setPeriodFilter('semana')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              periodFilter === 'semana'
                ? 'bg-[#FF85C2] text-white shadow-sm'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            Esta Semana
          </button>
          <button
            type="button"
            onClick={() => setPeriodFilter('mes')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
              periodFilter === 'mes'
                ? 'bg-[#FF85C2] text-white shadow-sm'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            Setembro
          </button>
        </div>

        {/* Card Principal de Faturamento em Gradiente Rosa */}
        <div
          className="rounded-3xl p-6 text-white shadow-[0_8px_25px_rgba(255,133,194,0.35)] relative overflow-hidden active:scale-[0.99] transition-transform"
          style={{ background: 'linear-gradient(135deg, var(--brand-pink) 0%, var(--brand-pink-dark) 100%)' }}
        >
          {/* Elementos decorativos de fundo */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute top-2 right-4 text-white/20">
            <Sparkles size={60} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-white/80 font-bold">
                {periodFilter === 'hoje'
                  ? 'Faturamento de Hoje'
                  : periodFilter === 'semana'
                  ? 'Faturamento da Semana'
                  : 'Faturamento do Mês'}
              </span>
              <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                Setembro 2026
              </span>
            </div>

            <div className="mt-3">
              <h2 className="text-4xl font-extrabold tracking-tight text-white">
                {periodFilter === 'hoje'
                  ? 'R$ 180,00'
                  : periodFilter === 'semana'
                  ? 'R$ 1.120,00'
                  : 'R$ 4.250,00'}
              </h2>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-100 bg-white/15 px-3 py-1 rounded-xl">
                <TrendingUp size={15} />
                <span>+12% vs. mês passado</span>
              </div>
              <span className="text-[11px] text-white/80 font-medium">Meta: R$ 5.000 (85%)</span>
            </div>
          </div>
        </div>

        {/* Duas Colunas de Métricas Rápidas */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Métricas 1: Serviços Realizados */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--brand-pink-bg)] text-[#FF85C2] flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +8 novos
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Serviços Realizados
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-0.5">48</h3>
              <p className="text-[11px] text-gray-400 mt-1">atendimentos concluídos</p>
            </div>
          </div>

          {/* Métricas 2: Ticket Médio */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF85C2] bg-[var(--brand-pink-bg)] px-2 py-0.5 rounded-full">
                +5,4%
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Ticket Médio
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-0.5">R$ 88,50</h3>
              <p className="text-[11px] text-gray-400 mt-1">por cliente atendida</p>
            </div>
          </div>
        </div>

        {/* Resumo por Forma de Pagamento */}
        <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-800 text-sm">Distribuição por Pagamento</h4>
            <span className="text-xs text-gray-400 font-medium">Pix lidera</span>
          </div>

          <div className="space-y-2 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Pix (65%)</span>
                <span>R$ 2.762,50</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF85C2] rounded-full w-[65%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Cartão Crédito / Débito (28%)</span>
                <span>R$ 1.190,00</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full w-[28%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Dinheiro (7%)</span>
                <span>R$ 297,50</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[7%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Últimas Transações */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-800 text-sm">Últimas Transações</h3>
            <span className="text-xs font-bold text-[#FF85C2] uppercase tracking-wider cursor-pointer">
              Ver Todas
            </span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-3xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-gray-50 flex items-center justify-between hover:shadow-[0_4px_16px_rgba(255,133,194,0.06)] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--brand-pink-bg)] text-[#FF85C2] font-semibold text-sm flex items-center justify-center border border-[var(--brand-pink-light)]">
                    {tx.client.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm leading-tight">{tx.service}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{tx.client}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {tx.date}
                      </span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md">
                        {tx.method}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="font-extrabold text-gray-800 text-sm">{tx.amount}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      tx.status === 'recebido'
                        ? 'bg-[#e6f7ec] text-[#047857]'
                        : 'bg-[#fffbeb] text-[#b45309]'
                    }`}
                  >
                    {tx.status === 'recebido' ? 'Recebido' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};
