import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Clock, CreditCard, Banknote, QrCode } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { Appointment, PaymentStatus, PaymentMethod } from '../../types';

interface CheckoutOverlayProps {
  appointment?: Appointment;
  onClose: () => void;
}

export const CheckoutOverlay: React.FC<CheckoutOverlayProps> = ({ appointment, onClose }) => {
  const { completeAppointmentCheckout, updateTransactionPayment } = useData();
  const { showToast } = useToast();

  const currentApt: Appointment = appointment || {
    client: 'Cliente',
    service: 'Manutenção Fibra',
    time: '09:00',
    date: 'Hoje',
    status: 'confirmado',
    price: 'R$ 120,00'
  };

  // Extrai valor numérico padrão
  const defaultRawPrice = currentApt.price
    ? currentApt.price.replace(/[^\d,]/g, '')
    : '120,00';

  const [priceInput, setPriceInput] = useState(defaultRawPrice);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('recebido');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [saving, setSaving] = useState(false);
  const existingPaymentId = appointment?.paymentId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingPaymentId && !currentApt.id) return;
    if (existingPaymentId) {
      setSaving(true);
      try {
        await updateTransactionPayment(existingPaymentId, paymentMethod);
        showToast(`Pagamento recebido via ${paymentMethod}.`, 'success');
        onClose();
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Falha ao registrar recebimento.', 'warning');
      } finally {
        setSaving(false);
      }
      return;
    }
    const amountCents = Math.round(Number(priceInput.replace(',', '.')) * 100);
    if (!Number.isInteger(amountCents) || amountCents < 0) {
      showToast('Informe um valor válido.', 'warning');
      return;
    }
    setSaving(true);
    try {
      await completeAppointmentCheckout(String(currentApt.id), { amountCents, paymentStatus, paymentMethod: paymentStatus === 'recebido' ? paymentMethod : undefined });
      const formattedAmount = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amountCents / 100);
      showToast(paymentStatus === 'recebido' ? `Atendimento concluído: ${formattedAmount} recebido via ${paymentMethod}.` : `Atendimento concluído: ${formattedAmount} pendente.`, 'success');
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao concluir atendimento.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ScreenHeader title="Lançamento Financeiro" onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-5 pb-28 space-y-6">
        {/* Resumo do Atendimento */}
        <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--brand-pink-bg)] text-[#FF85C2] flex items-center justify-center font-bold text-xl border border-[var(--brand-pink-light)]">
            {currentApt.client.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF85C2]">
              Concluir Atendimento
            </span>
            <h3 className="font-bold text-gray-800 text-base">{currentApt.client}</h3>
            <p className="text-xs text-gray-500 font-medium">
              {currentApt.service} • {currentApt.time}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Valor do serviço */}
          <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block px-1">
              {existingPaymentId ? 'Valor pendente (R$)' : 'Valor Final Cobrado (R$)'}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-gray-400 font-bold text-sm">
                <DollarSign size={18} />
              </div>
              <input
                type="text"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                readOnly={Boolean(existingPaymentId)}
                placeholder="120,00"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-lg text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF85C2] transition-all"
                required
              />
            </div>
            <p className="text-[10px] text-gray-400 px-1">
              {!existingPaymentId && 'Você pode alterar o valor caso tenha aplicado descontos ou adicionais.'}
            </p>
          </div>

          {/* Status do pagamento */}
          {!existingPaymentId && <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block px-1">
              Status do Pagamento
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentStatus('recebido')}
                className={`py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  paymentStatus === 'recebido'
                    ? 'bg-[#e6f7ec] text-[#047857] border-[#a7f3d0] shadow-sm scale-[1.02]'
                    : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                }`}
              >
                <CheckCircle2 size={16} /> Recebido
              </button>

              <button
                type="button"
                onClick={() => setPaymentStatus('pendente')}
                className={`py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  paymentStatus === 'pendente'
                    ? 'bg-[#fffbeb] text-[#b45309] border-[#fde68a] shadow-sm scale-[1.02]'
                    : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                }`}
              >
                <Clock size={16} /> Pendente
              </button>
            </div>
          </div>}

          {/* 3. Forma de Pagamento (se 'recebido') */}
          {(existingPaymentId || paymentStatus === 'recebido') && (
            <div className="bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-50 space-y-3 animate-in fade-in duration-200">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block px-1">
                Forma de Pagamento
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Pix */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Pix')}
                  className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    paymentMethod === 'Pix'
                      ? 'bg-[var(--brand-pink-bg)] text-[#FF85C2] border-[#FF85C2] font-bold shadow-sm'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 font-medium'
                  }`}
                >
                  <QrCode size={20} />
                  <span className="text-xs">Pix</span>
                </button>

                {/* Cartão */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cartão')}
                  className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    paymentMethod === 'Cartão'
                      ? 'bg-[var(--brand-pink-bg)] text-[#FF85C2] border-[#FF85C2] font-bold shadow-sm'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 font-medium'
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="text-xs">Cartão</span>
                </button>

                {/* Dinheiro */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Dinheiro')}
                  className={`py-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    paymentMethod === 'Dinheiro'
                      ? 'bg-[var(--brand-pink-bg)] text-[#FF85C2] border-[#FF85C2] font-bold shadow-sm'
                      : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 font-medium'
                  }`}
                >
                  <Banknote size={20} />
                  <span className="text-xs">Dinheiro</span>
                </button>
              </div>
            </div>
          )}

          {/* Botão de Finalização */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving || !currentApt.id}
              className="w-full py-4 rounded-2xl bg-[#FF85C2] text-white font-bold text-sm uppercase tracking-widest shadow-[0_4px_15px_rgba(255,133,194,0.3)] active:scale-[0.98] transition-transform cursor-pointer hover:bg-[#e86ba8] flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> {saving ? 'Salvando...' : existingPaymentId ? 'Registrar Recebimento' : 'Confirmar & Concluir'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};
