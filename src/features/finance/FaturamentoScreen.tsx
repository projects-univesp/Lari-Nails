import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Download,
  Clock,
  Banknote,
  QrCode,
  X,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { ScreenOpenHandler, Transaction, PaymentMethod } from '../../types';

interface FaturamentoScreenProps {
  onClose: () => void;
  onOpenScreen?: ScreenOpenHandler;
}

const parseAmount = (amount: string) => Number(amount.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0;

export const FaturamentoScreen: React.FC<FaturamentoScreenProps> = ({ onClose }) => {
  const { transactions, updateTransactionPayment } = useData();
  const { showToast } = useToast();

  const [periodFilter, setPeriodFilter] = useState<'mes' | 'semana' | 'hoje'>('mes');
  const [selectedPendingTx, setSelectedPendingTx] = useState<Transaction | null>(null);
  const [modalMethod, setModalMethod] = useState<PaymentMethod>('Pix');
  const [selectedMonth, setSelectedMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [exportOpen, setExportOpen] = useState(false);
  const [exportStart, setExportStart] = useState('');
  const [exportEnd, setExportEnd] = useState('');

  const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const todayKey = dateKey(new Date());
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const monthLabel = selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const filterStart = periodFilter === 'hoje' ? todayKey : periodFilter === 'semana' ? dateKey(weekStart) : dateKey(selectedMonth);
  const filterEnd = periodFilter === 'hoje' ? todayKey : periodFilter === 'semana' ? dateKey(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6)) : dateKey(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0));
  const transactionDate = (transaction: Transaction) => {
    if (transaction.dateKey) return transaction.dateKey;
    if (transaction.date.startsWith('Hoje')) return todayKey;
    if (transaction.date.startsWith('Ontem')) return dateKey(new Date(Date.now() - 86400000));
    return '';
  };
  const filteredTransactions = transactions.filter((transaction) => {
    const date = transactionDate(transaction);
    return date >= filterStart && date <= filterEnd;
  });
  const receivedTransactions = filteredTransactions.filter((t) => t.status === 'recebido');
  const dueTodayTransactions = transactions.filter((t) => t.status === 'pendente' && t.agreedPaymentDate === todayKey);

  const totalReceived = receivedTransactions.reduce((acc, curr) => {
    const numeric = curr.numericAmount ?? parseAmount(curr.amount);
    return acc + numeric;
  }, 0);

  const pixTotal = receivedTransactions
    .filter((t) => t.method?.toLowerCase().includes('pix'))
    .reduce((acc, curr) => acc + (curr.numericAmount ?? parseAmount(curr.amount)), 0);

  const cardTotal = receivedTransactions
    .filter((t) => t.method?.toLowerCase().includes('cart'))
    .reduce((acc, curr) => acc + (curr.numericAmount ?? parseAmount(curr.amount)), 0);

  const cashTotal = receivedTransactions
    .filter((t) => t.method?.toLowerCase().includes('dinheiro'))
    .reduce((acc, curr) => acc + (curr.numericAmount ?? parseAmount(curr.amount)), 0);

  const totalCount = filteredTransactions.length;
  const ticketMedio = receivedTransactions.length > 0 ? totalReceived / receivedTransactions.length : 0;

  const pixPercent = totalReceived > 0 ? Math.round((pixTotal / totalReceived) * 100) : 0;
  const cardPercent = totalReceived > 0 ? Math.round((cardTotal / totalReceived) * 100) : 0;
  const cashPercent = totalReceived > 0 ? Math.round((cashTotal / totalReceived) * 100) : 0;

  const openExportDialog = () => {
    setExportStart(filterStart);
    setExportEnd(filterEnd);
    setExportOpen(true);
  };

  const downloadReport = () => {
    if (!exportStart || !exportEnd || exportStart > exportEnd) {
      showToast('Selecione um intervalo de datas válido.', 'warning');
      return;
    }
    const rows = transactions.filter((transaction) => {
      const date = transactionDate(transaction);
      return date && date >= exportStart && date <= exportEnd;
    });
    const csv = [
      ['Data', 'Cliente', 'Serviço', 'Valor', 'Pagamento', 'Status', 'Data combinada'].join(';'),
      ...rows.map((transaction) => [transactionDate(transaction), transaction.client, transaction.service, transaction.amount, transaction.method, transaction.status, transaction.agreedPaymentDate || ''].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';')),
    ].join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `faturamento-${exportStart}-${exportEnd}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    setExportOpen(false);
    showToast('Relatório baixado.', 'success');
  };

  const handleConfirmPaymentUpdate = () => {
    if (selectedPendingTx) {
      updateTransactionPayment(selectedPendingTx.id, 'recebido', modalMethod);
      showToast(
        `✅ Pagamento de ${selectedPendingTx.client} (${selectedPendingTx.amount}) recebido via ${modalMethod}!`,
        'success'
      );
      setSelectedPendingTx(null);
    }
  };

  return (
    <>
      <ScreenHeader
        title="Faturamento"
        onClose={onClose}
        rightAction={
          <button
            type="button"
            onClick={openExportDialog}
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
            Mês
          </button>
        </div>

        {/* Card Principal em Gradiente Rosa */}
        <div
          className="rounded-3xl p-6 text-white shadow-[0_8px_25px_rgba(255,133,194,0.35)] relative overflow-hidden active:scale-[0.99] transition-transform"
          style={{ background: 'linear-gradient(135deg, var(--brand-pink) 0%, var(--brand-pink-dark) 100%)' }}
        >
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute top-2 right-4 text-white/20">
            <Sparkles size={60} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-white/80 font-bold">
                {periodFilter === 'hoje'
                  ? 'Recebido Hoje'
                  : periodFilter === 'semana'
                  ? 'Recebido na Semana'
                  : 'Faturamento do Mês'}
              </span>
                {periodFilter === 'mes' ? (
                  <div className="flex items-center gap-1 rounded-full bg-white/20 px-1 py-0.5">
                    <button type="button" aria-label="Mês anterior" onClick={() => setSelectedMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-1 rounded-full hover:bg-white/20"><ChevronLeft size={15} /></button>
                    <span className="min-w-28 text-center text-[11px] font-semibold capitalize">{monthLabel}</span>
                    <button type="button" aria-label="Próximo mês" onClick={() => setSelectedMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-1 rounded-full hover:bg-white/20"><ChevronRight size={15} /></button>
                  </div>
                ) : <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">{periodFilter === 'hoje' ? new Date().toLocaleDateString('pt-BR') : 'Segunda a domingo'}</span>}
            </div>

            <div className="mt-3">
              <h2 className="text-4xl font-extrabold tracking-tight text-white">
                R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-100 bg-white/15 px-3 py-1 rounded-xl">
                <TrendingUp size={15} />
                <span>+12% vs. mês passado</span>
              </div>
              <span className="text-[11px] text-white/80 font-medium">
                {receivedTransactions.length} recebidos de {totalCount} lançamentos
              </span>
            </div>
          </div>
        </div>

        {/* Duas Colunas com Métricas Rápidas */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--brand-pink-bg)] text-[#FF85C2] flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Ativos
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Serviços Realizados
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{totalCount}</h3>
              <p className="text-[11px] text-gray-400 mt-1">lançamentos totais</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF85C2] bg-[var(--brand-pink-bg)] px-2 py-0.5 rounded-full">
                Média
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Ticket Médio
              </p>
              <h3 className="text-2xl font-bold text-gray-800 mt-0.5">
                R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">por atendimento</p>
            </div>
          </div>
        </div>

        {/* Distribuição por Forma de Pagamento */}
        <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-800 text-sm">Distribuição por Pagamento</h4>
            <span className="text-xs text-gray-400 font-medium">{monthLabel}</span>
          </div>

          <div className="space-y-2 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Pix ({pixPercent}%)</span>
                <span>R$ {pixTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF85C2] rounded-full transition-all duration-500" style={{ width: `${pixPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Cartão ({cardPercent}%)</span>
                <span>R$ {cardTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full transition-all duration-500" style={{ width: `${cardPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Dinheiro ({cashPercent}%)</span>
                <span>R$ {cashTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${cashPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Últimas Transações */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-800 text-sm">Últimas Transações</h3>
            <span className="text-[11px] text-gray-400 font-medium">Pendências incluídas no período</span>
          </div>

          <div className="space-y-2.5">
            {filteredTransactions.map((tx) => {
              const isPendente = tx.status === 'pendente';

              return (
                <div
                  key={tx.id}
                  onClick={() => isPendente && setSelectedPendingTx(tx)}
                  className={`p-4 rounded-3xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] border transition-all flex items-center justify-between ${
                    isPendente
                      ? 'border-amber-200/80 hover:border-amber-400 cursor-pointer active:scale-[0.98]'
                      : 'border-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl font-semibold text-sm flex items-center justify-center border ${
                        isPendente
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : 'bg-[var(--brand-pink-bg)] text-[#FF85C2] border-[var(--brand-pink-light)]'
                      }`}
                    >
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
                    <button
                      type="button"
                      className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider transition-transform ${
                        isPendente
                          ? 'bg-[#fffbeb] text-[#b45309] border border-amber-300 hover:scale-105 cursor-pointer'
                          : 'bg-[#e6f7ec] text-[#047857]'
                      }`}
                    >
                      {isPendente ? 'Pendente ✎' : 'Recebido'}
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredTransactions.length === 0 && <p className="rounded-2xl bg-white p-5 text-center text-sm text-gray-500">Nenhum lançamento neste período.</p>}
          </div>
        </div>

        {dueTodayTransactions.length > 0 && (
          <section className="space-y-2" aria-label="Pagamentos combinados para hoje">
            <h3 className="px-1 text-sm font-bold text-amber-800">Lembretes de pagamento para hoje</h3>
            {dueTodayTransactions.map((transaction) => (
              <button key={`due-${transaction.id}`} type="button" onClick={() => setSelectedPendingTx(transaction)} className="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
                <span className="min-w-0"><span className="block truncate text-sm font-bold text-gray-800">{transaction.client}</span><span className="block truncate text-xs text-gray-600">{transaction.service} · vencimento combinado hoje</span></span>
                <span className="shrink-0 text-sm font-extrabold text-amber-800">{transaction.amount}</span>
              </button>
            ))}
          </section>
        )}
      </main>

      {/* Modal Rápido de Quitação de Transação Pendente */}
      {selectedPendingTx && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-amber-50 text-amber-600">
                  <Clock size={18} />
                </div>
                <h3 className="font-bold text-gray-800 text-base">Receber Pagamento</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPendingTx(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-xs text-gray-500 font-medium">Cliente</p>
              <h4 className="font-bold text-gray-800 text-base">{selectedPendingTx.client}</h4>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200/60 text-xs">
                <span className="text-gray-500">{selectedPendingTx.service}</span>
                <span className="font-extrabold text-[#FF85C2] text-sm">{selectedPendingTx.amount}</span>
              </div>
            </div>

            {/* Seleção da Forma de Pagamento */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block">
                Forma de Quitação
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setModalMethod('Pix')}
                  className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    modalMethod === 'Pix'
                      ? 'bg-[var(--brand-pink-bg)] text-[#FF85C2] border-[#FF85C2]'
                      : 'bg-white border-gray-100 text-gray-500'
                  }`}
                >
                  <QrCode size={16} />
                  <span>Pix</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalMethod('Cartão')}
                  className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    modalMethod === 'Cartão'
                      ? 'bg-[var(--brand-pink-bg)] text-[#FF85C2] border-[#FF85C2]'
                      : 'bg-white border-gray-100 text-gray-500'
                  }`}
                >
                  <CreditCard size={16} />
                  <span>Cartão</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalMethod('Dinheiro')}
                  className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    modalMethod === 'Dinheiro'
                      ? 'bg-[var(--brand-pink-bg)] text-[#FF85C2] border-[#FF85C2]'
                      : 'bg-white border-gray-100 text-gray-500'
                  }`}
                >
                  <Banknote size={16} />
                  <span>Dinheiro</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedPendingTx(null)}
                className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmPaymentUpdate}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Check size={16} /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {exportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="export-title" className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 id="export-title" className="font-bold text-gray-800">Baixar faturamento</h2>
              <button type="button" onClick={() => setExportOpen(false)} aria-label="Fechar" className="rounded-full p-2 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-600">Escolha o período da planilha.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="min-w-0 text-xs font-semibold text-gray-600">De<input type="date" value={exportStart} onChange={(event) => setExportStart(event.target.value)} className="mt-1 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm" /></label>
              <label className="min-w-0 text-xs font-semibold text-gray-600">Até<input type="date" value={exportEnd} onChange={(event) => setExportEnd(event.target.value)} className="mt-1 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm" /></label>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setExportOpen(false)} className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700">Cancelar</button>
              <button type="button" onClick={downloadReport} className="flex-1 rounded-xl bg-[#FF85C2] px-4 py-3 text-sm font-bold text-white">Baixar CSV</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

