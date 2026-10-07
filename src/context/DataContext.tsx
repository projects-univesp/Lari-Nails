/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Appointment, PendingAppointment, Transaction, PaymentStatus, AgendaBlock, Service } from '../types';
import { operationsApi, type ApiAppointment, type ApiClient, type ApiService, type ApiTransaction } from '../infra/operations/operations-api';
import { useAuth } from '../presentation/hooks/useAuth';

export interface ServiceInput {
  name: string;
  category: string;
  description: string | null;
  priceCents: number;
  durationMinutes: number;
  active: boolean;
}

export interface ManualBookingInput {
  clientId: string;
  serviceId: string;
  requestedDate: string;
  requestedTime: string;
}

interface DataContextType {
  appointments: Appointment[];
  transactions: Transaction[];
  bookingClients: ApiClient[];
  services: Service[];
  clientTags: string[];
  pendingApprovals: PendingAppointment[];
  agendaBlocks: AgendaBlock[];
  operationsError: string | null;
  setAgendaRange: (from: string, to: string) => void;
  setFinanceRange: (from: string, to: string) => void;
  addAppointment: (input: ManualBookingInput) => Promise<ApiAppointment>;
  rescheduleAppointment: (id: string | number, date: string, time: string) => Promise<void>;
  cancelAppointment: (id: string | number, reason: string) => Promise<void>;
  approvePending: (id: string) => Promise<void>;
  rejectPending: (id: string) => Promise<void>;
  reschedulePending: (id: string, date: string, time: string) => Promise<void>;
  denyPending: (id: string, reason: string) => Promise<void>;
  addAgendaBlock: (block: Omit<AgendaBlock, 'id'>) => Promise<void>;
  updateAgendaBlock: (block: AgendaBlock) => Promise<void>;
  deleteAgendaBlock: (id: string | number) => Promise<void>;
  addService: (service: ServiceInput) => Promise<void>;
  updateService: (id: string, service: ServiceInput) => Promise<void>;
  addClientTag: (tag: string) => Promise<void>;
  removeClientTag: (tag: string) => Promise<void>;
  updateTransactionPayment: (id: string, paymentMethod: string) => Promise<void>;
  completeAppointmentCheckout: (appointmentId: string, input: { amountCents: number; paymentStatus: PaymentStatus; paymentMethod?: string }) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const formatDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const currentMonth = () => {
  const now = new Date();
  return { from: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)), to: formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
};
const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
const duration = (minutes: number) => minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}min` : ''}`;
const statusMap: Record<ApiAppointment['status'], Appointment['status']> = {
  AGUARDANDO: 'aguardando', CONFIRMADO: 'confirmado', REAGENDAMENTO_SUGERIDO: 'pendente', CANCELADO: 'cancelado', CONCLUIDO: 'concluido',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [range, setRange] = useState(currentMonth);
  const [financeRange, setFinanceRangeState] = useState(currentMonth);
  const setAgendaRange = useCallback((from: string, to: string) => {
    setRange((current) => current.from === from && current.to === to ? current : { from, to });
  }, []);
  const setFinanceRange = useCallback((from: string, to: string) => {
    setFinanceRangeState((current) => current.from === from && current.to === to ? current : { from, to });
  }, []);
  const enabled = Boolean(currentUser);

  const servicesQuery = useQuery({ queryKey: ['operations', 'services'], queryFn: operationsApi.listServices, enabled });
  const clientsQuery = useQuery({ queryKey: ['operations', 'clients'], queryFn: operationsApi.listClients, enabled });
  const clientTagsQuery = useQuery({ queryKey: ['operations', 'client-tags'], queryFn: operationsApi.listClientTags, enabled });
  const appointmentsQuery = useQuery({ queryKey: ['operations', 'appointments', range.from, range.to], queryFn: () => operationsApi.listAppointments(range.from, range.to), enabled });
  const pendingQuery = useQuery({ queryKey: ['operations', 'pending'], queryFn: operationsApi.listPending, enabled });
  const blocksQuery = useQuery({ queryKey: ['operations', 'blocks', range.from, range.to], queryFn: () => operationsApi.listBlocks(range.from, range.to), enabled });
  const transactionsQuery = useQuery({ queryKey: ['operations', 'transactions', financeRange.from, financeRange.to], queryFn: () => operationsApi.listTransactions(financeRange.from, financeRange.to), enabled });

  const serviceRecords = servicesQuery.data ?? [];
  const clientRecords = clientsQuery.data ?? [];
  const clientTags = clientTagsQuery.data ?? [];
  const services: Service[] = serviceRecords.map((item: ApiService) => ({
    id: item.id, name: item.name, category: item.category, price: money(item.priceCents), duration: duration(item.durationMinutes),
    priceCents: item.priceCents, durationMinutes: item.durationMinutes, active: item.active, description: item.description,
  }));
  const convertAppointment = (item: ApiAppointment): Appointment => ({
    id: item.id,
    clientId: item.clientId,
    serviceId: item.serviceId,
    client: clientRecords.find((client) => client.id === item.clientId)?.nome ?? 'Cliente',
    service: serviceRecords.find((service) => service.id === item.serviceId)?.name ?? 'Serviço',
    date: item.requestedDate,
    time: item.requestedTime,
    status: statusMap[item.status],
    price: money(item.priceCents),
    paymentStatus: 'pendente',
    source: item.source,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });
  const appointments = (appointmentsQuery.data ?? []).map(convertAppointment);
  const pendingApprovals: PendingAppointment[] = (pendingQuery.data ?? []).map((item) => ({
    id: item.id,
    name: clientRecords.find((client) => client.id === item.clientId)?.nome ?? 'Cliente',
    phone: clientRecords.find((client) => client.id === item.clientId)?.telefone ?? '',
    service: serviceRecords.find((service) => service.id === item.serviceId)?.name ?? 'Serviço',
    date: item.requestedDate,
    time: item.requestedTime,
    status: 'aguardando',
    requestedAt: item.createdAt,
  }));
  const agendaBlocks: AgendaBlock[] = blocksQuery.data ?? [];
  const transactions: Transaction[] = (transactionsQuery.data ?? []).map((item: ApiTransaction) => ({
    id: item.id, appointmentId: item.appointmentId, client: item.clientName, service: item.serviceName,
    amount: money(item.amountCents), numericAmount: item.amountCents / 100,
    method: item.method === 'PIX' ? 'Pix' : item.method === 'CARTAO' ? 'Cartão' : item.method === 'DINHEIRO' ? 'Dinheiro' : 'A Receber',
    status: item.status === 'RECEBIDO' ? 'recebido' : 'pendente', date: new Date(item.date).toLocaleString('pt-BR'),
  }));
  const firstError = [servicesQuery.error, clientsQuery.error, clientTagsQuery.error, appointmentsQuery.error, pendingQuery.error, blocksQuery.error, transactionsQuery.error].find(Boolean);
  const operationsError = firstError instanceof Error ? firstError.message : null;

  const refreshAppointments = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['operations', 'appointments'] }),
      queryClient.invalidateQueries({ queryKey: ['operations', 'pending'] }),
      queryClient.invalidateQueries({ queryKey: ['operations', 'transactions'] }),
    ]);
  };

  const addAppointment = async (input: ManualBookingInput) => {
    const created = await operationsApi.createAppointment({ ...input, source: 'MANUAL' });
    await refreshAppointments();
    return created;
  };
  const decide = async (id: string, input: Parameters<typeof operationsApi.decideAppointment>[1]) => {
    await operationsApi.decideAppointment(id, input);
    await refreshAppointments();
  };
  const approvePending = (id: string) => decide(id, { status: 'CONFIRMADO' });
  const denyPending = (id: string, reason: string) => decide(id, { status: 'CANCELADO', reason });
  const reschedulePending = (id: string, date: string, time: string) => decide(id, { status: 'REAGENDAMENTO_SUGERIDO', proposedDate: date, proposedTime: time });
  const rejectPending = (id: string) => denyPending(id, 'Pedido recusado');

  const addAgendaBlock = async (block: Omit<AgendaBlock, 'id'>) => {
    await operationsApi.createBlock(block);
    await queryClient.invalidateQueries({ queryKey: ['operations', 'blocks'] });
  };
  const updateAgendaBlock = async (block: AgendaBlock) => {
    await operationsApi.updateBlock(String(block.id), block);
    await queryClient.invalidateQueries({ queryKey: ['operations', 'blocks'] });
  };
  const deleteAgendaBlock = async (id: string | number) => {
    await operationsApi.deleteBlock(String(id));
    await queryClient.invalidateQueries({ queryKey: ['operations', 'blocks'] });
  };
  const addService = async (service: ServiceInput) => {
    await operationsApi.createService(service);
    await queryClient.invalidateQueries({ queryKey: ['operations', 'services'] });
  };
  const updateService = async (id: string, service: ServiceInput) => {
    await operationsApi.updateService(id, service);
    await queryClient.invalidateQueries({ queryKey: ['operations', 'services'] });
  };

  const rescheduleAppointment = async (id: string | number, date: string, time: string) => {
    await operationsApi.rescheduleAppointment(String(id), date, time);
    await refreshAppointments();
  };
  const cancelAppointment = async (id: string | number, reason: string) => {
    await operationsApi.decideAppointment(String(id), { status: 'CANCELADO', reason });
    await refreshAppointments();
  };
  const addClientTag = async (tag: string) => {
    await operationsApi.createClientTag(tag);
    await queryClient.invalidateQueries({ queryKey: ['operations', 'client-tags'] });
  };
  const removeClientTag = async (tag: string) => {
    await operationsApi.deleteClientTag(tag);
    await queryClient.invalidateQueries({ queryKey: ['operations', 'client-tags'] });
  };
  const updateTransactionPayment = async (id: string, paymentMethod: string) => {
    const method = paymentMethod === 'Cartão' ? 'CARTAO' : paymentMethod === 'Dinheiro' ? 'DINHEIRO' : 'PIX';
    await operationsApi.receiveTransaction(String(id), method);
    await queryClient.invalidateQueries({ queryKey: ['operations', 'transactions'] });
  };
  const completeAppointmentCheckout = async (appointmentId: string, input: { amountCents: number; paymentStatus: PaymentStatus; paymentMethod?: string }) => {
    const method = input.paymentMethod === 'Cartão' ? 'CARTAO' : input.paymentMethod === 'Dinheiro' ? 'DINHEIRO' : input.paymentMethod === 'Pix' ? 'PIX' : undefined;
    await operationsApi.checkout(appointmentId, { amountCents: input.amountCents, status: input.paymentStatus === 'recebido' ? 'RECEBIDO' : 'PENDENTE', ...(method ? { method } : {}) });
    await refreshAppointments();
  };

  return <DataContext.Provider value={{
    appointments, transactions, bookingClients: clientRecords, services, clientTags, pendingApprovals, agendaBlocks,
    operationsError, setAgendaRange, setFinanceRange,
    addAppointment, rescheduleAppointment, cancelAppointment,
    approvePending, rejectPending, reschedulePending, denyPending,
    addAgendaBlock, updateAgendaBlock, deleteAgendaBlock, addService, updateService,
    addClientTag, removeClientTag, updateTransactionPayment, completeAppointmentCheckout,
  }}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve ser utilizado dentro de um DataProvider');
  return context;
};
