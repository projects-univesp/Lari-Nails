import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import type { Appointment } from '../../types';

interface AddAppointmentScreenProps {
  data?: {
    mode?: string;
    client?: string;
    service?: string;
    date?: string;
    time?: string;
    id?: number;
  };
  onClose: () => void;
  onSave?: (appointment: Appointment) => void;
}

export const AddAppointmentScreen: React.FC<AddAppointmentScreenProps> = ({
  data,
  onClose,
  onSave,
}) => {
  const { addAppointment, rescheduleAppointment } = useData();
  const { showToast } = useToast();

  const isReschedule = data?.mode === 'reschedule';

  const [clientName, setClientName] = useState(data?.client || '');
  const [service, setService] = useState(
    isReschedule ? '1' : ''
  );
  const [date, setDate] = useState(data?.date === 'Hoje' ? '' : data?.date || '');
  const [time, setTime] = useState(data?.time || '09:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let serviceName = service;
    if (service === '1') serviceName = 'Manutenção Fibra';
    else if (service === '2') serviceName = 'Esmaltação em Gel';

    const newAppointment: Appointment = {
      client: clientName,
      service: serviceName,
      date: date || 'Hoje',
      time: time || '09:00',
      status: 'confirmado',
      paymentStatus: 'pendente',
      price: 'R$ 120,00'
    };

    if (isReschedule && data?.id) rescheduleAppointment(data.id, newAppointment.date, newAppointment.time);
    else addAppointment(newAppointment);
    onSave?.(newAppointment);

    if (isReschedule) {
      showToast('🗓️ Agendamento reagendado com sucesso!', 'success');
    } else {
      showToast('✅ Novo agendamento registrado com sucesso!', 'success');
    }

    onClose();
  };

  const pageTitle = isReschedule
    ? 'Reagendar'
    : 'Novo Agendamento';

  return (
    <>
      <ScreenHeader title={pageTitle} onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-5 pb-24">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Campo de Cliente: Apenas visível se NÃO for modo bloqueio */}
          <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Cliente
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-4 text-gray-300" size={20} />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  readOnly={isReschedule}
                  placeholder="Buscar cliente..."
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#FF85C2] font-medium ${
                    isReschedule ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700'
                  }`}
                  required
                />
              </div>
          </div>

          {/* Campo de Serviço (para modo normal) */}
          <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Serviço
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className={`w-full px-4 py-4 rounded-2xl border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#FF85C2] appearance-none font-medium ${
                  isReschedule ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-700'
                }`}
                required
              >
                <option value="">Selecione um serviço...</option>
                <option value="1">Manutenção Fibra (2h)</option>
                <option value="2">Esmaltação em Gel (1h)</option>
                <option value="4">Pausa / Bloqueio</option>
              </select>
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                Horário
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white border-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#FF85C2] text-gray-700 font-medium"
                required
              />
            </div>
          </div>

          {/* Duração do Bloqueio (se modo bloqueio) */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#FF85C2] text-white font-bold text-sm uppercase tracking-widest shadow-[0_4px_15px_rgba(255,133,194,0.3)] active:scale-[0.98] transition-transform cursor-pointer flex items-center justify-center gap-2 hover:bg-[#e86ba8]"
            >
              Confirmar Horário
            </button>
          </div>
        </form>
      </main>
    </>
  );
};
