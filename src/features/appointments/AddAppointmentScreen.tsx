import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { operationsApi } from '../../infra/operations/operations-api';
import type { Appointment } from '../../types';

interface AddAppointmentScreenProps {
  data?: { mode?: string; client?: string; service?: string; date?: string; time?: string; id?: string | number };
  onClose: () => void;
  onSave?: (appointment: Appointment) => void;
}

export const AddAppointmentScreen: React.FC<AddAppointmentScreenProps> = ({ data, onClose, onSave }) => {
  const { addAppointment, bookingClients, services } = useData();
  const { showToast } = useToast();
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState(data?.date && data.date !== 'Hoje' ? data.date : '');
  const [time, setTime] = useState('');
  const [saving, setSaving] = useState(false);
  const activeServices = services.filter((service) => service.active);
  const selectedService = activeServices.find((service) => service.id === serviceId);
  const slotsQuery = useQuery({
    queryKey: ['operations', 'availability', serviceId, date],
    queryFn: () => operationsApi.availability(serviceId, date, date),
    enabled: Boolean(serviceId && date),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!clientId || !serviceId || !date || !time) return;
    setSaving(true);
    try {
      const result = await addAppointment({ clientId, serviceId, requestedDate: date, requestedTime: time });
      onSave?.({ id: result.id, client: bookingClients.find((client) => client.id === clientId)?.nome ?? 'Cliente', service: selectedService?.name ?? 'Serviço', date, time, status: 'aguardando' });
      showToast('Pedido de agendamento enviado para aprovação.', 'success');
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Falha ao criar agendamento.', 'warning');
      await slotsQuery.refetch();
    } finally {
      setSaving(false);
    }
  };

  return <>
    <ScreenHeader title="Novo Agendamento" onClose={onClose} />
    <main className="flex-1 overflow-y-auto p-5 pb-24">
      {data?.mode === 'reschedule' ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">Reagendamento de pedidos confirmados ainda não está disponível.</p>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Cliente
            <select value={clientId} onChange={(event) => setClientId(event.target.value)} required className="mt-2 w-full px-4 py-4 rounded-2xl bg-white text-gray-700">
              <option value="">Selecione um cliente...</option>
              {bookingClients.map((client) => <option key={client.id} value={client.id}>{client.nome} · {client.telefone}</option>)}
            </select>
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Serviço
            <select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setTime(''); }} required className="mt-2 w-full px-4 py-4 rounded-2xl bg-white text-gray-700">
              <option value="">Selecione um serviço...</option>
              {activeServices.map((service) => <option key={service.id} value={service.id}>{service.name} · {service.duration} · {service.price}</option>)}
            </select>
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Data
            <input type="date" value={date} onChange={(event) => { setDate(event.target.value); setTime(''); }} required className="mt-2 w-full px-4 py-4 rounded-2xl bg-white text-gray-700" />
          </label>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Horário disponível
            <select value={time} onChange={(event) => setTime(event.target.value)} required disabled={!serviceId || !date || slotsQuery.isLoading} className="mt-2 w-full px-4 py-4 rounded-2xl bg-white text-gray-700">
              <option value="">Selecione um horário...</option>
              {(slotsQuery.data ?? []).map((slot) => <option key={slot.startTime} value={slot.startTime}>{slot.startTime} às {slot.endTime}</option>)}
            </select>
          </label>
          {slotsQuery.error && <p role="alert" className="text-sm text-red-600">{slotsQuery.error.message}</p>}
          {serviceId && date && !slotsQuery.isLoading && !slotsQuery.error && slotsQuery.data?.length === 0 && <p className="text-sm text-amber-700">Nenhum horário disponível para esta data.</p>}
          <button type="submit" disabled={saving || !time} className="w-full py-4 rounded-2xl bg-[#FF85C2] text-white font-bold uppercase tracking-widest disabled:opacity-50">{saving ? 'Enviando...' : 'Solicitar Agendamento'}</button>
        </form>
      )}
    </main>
  </>;
};
