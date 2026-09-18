import React from 'react';
import { AlertCircle, ChevronRight, TrendingUp } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useData } from '../../context/DataContext';
import type { ScreenOpenHandler } from '../../types';

interface DashboardTabProps {
  onOpenScreen: ScreenOpenHandler;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onOpenScreen }) => {
  const { appointments, pendingApprovals, transactions } = useData();

  // Faturamento recebido dinâmico
  const totalReceived = transactions
    .filter((t) => t.status === 'recebido')
    .reduce((acc, curr) => acc + (curr.numericAmount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cards de Acesso Rápido (Pendentes & Faturamento) */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onOpenScreen('pending_approvals')}
          className="rounded-3xl p-4 text-white shadow-[0_4px_18px_rgba(255,133,194,0.25)] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, var(--brand-pink) 0%, var(--brand-pink-dark) 100%)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-sm">
              <AlertCircle size={20} />
            </div>
            <ChevronRight size={18} className="text-white/80" />
          </div>
          <div>
            <h3 className="font-bold text-base">
              {pendingApprovals.length} {pendingApprovals.length === 1 ? 'Pendente' : 'Pendentes'}
            </h3>
            <p className="text-[10px] text-white/90 uppercase tracking-wider mt-0.5 font-medium">
              {pendingApprovals.length > 0 ? 'Aguardando' : 'Tudo em dia'}
            </p>
          </div>
        </div>

        <div
          onClick={() => onOpenScreen('faturamento')}
          className="rounded-3xl p-4 bg-white border border-gray-100 shadow-[0_4px_18px_rgba(0,0,0,0.02)] flex flex-col justify-between cursor-pointer active:scale-[0.98] transition-all hover:border-pink-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-2xl">
              <TrendingUp size={20} />
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-gray-800">
              R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h3>
            <p className="text-[10px] text-[#FF85C2] uppercase tracking-wider mt-0.5 font-bold">
              Faturamento
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <h2 className="text-lg font-bold text-gray-800 mb-5 px-2">Sua agenda de hoje</h2>
        <div className="space-y-4">
          {appointments.map((apt, idx) => (
            <div
              key={apt.id || idx}
              className="flex gap-4 items-stretch group cursor-pointer"
              onClick={() => apt.status !== 'bloqueado' && onOpenScreen('appointment_details', apt)}
            >
              <div className="w-12 text-right flex flex-col items-end shrink-0">
                <span className="text-sm font-bold text-gray-400 mt-4">{apt.time}</span>
              </div>

              <div className="relative flex-1">
                {idx !== appointments.length - 1 && (
                  <div className="absolute left-[-17px] top-10 bottom-[-24px] w-0.5 bg-gray-100" />
                )}
                <div
                  className={`absolute left-[-21px] top-5 w-2.5 h-2.5 rounded-full border-2 border-[#FAFAFA] z-10 ${
                    apt.status === 'concluido'
                      ? 'bg-emerald-500'
                      : apt.status === 'pendente'
                      ? 'bg-amber-400'
                      : apt.status === 'confirmado'
                      ? 'bg-[#FF85C2]'
                      : 'bg-gray-300'
                  }`}
                />

                <div
                  className={`p-4 rounded-3xl bg-white shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 group-hover:shadow-[0_4px_20px_rgba(255,133,194,0.08)] transition-all ${
                    apt.status === 'concluido'
                      ? 'border-l-4 border-l-emerald-500'
                      : apt.status === 'pendente'
                      ? 'border-l-4 border-l-amber-400'
                      : apt.status === 'confirmado'
                      ? 'border-l-4 border-l-[#FF85C2]'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{apt.client}</h4>
                    <StatusBadge status={apt.status} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{apt.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
