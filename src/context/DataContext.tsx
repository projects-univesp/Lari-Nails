/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { INITIAL_CLIENTS, INITIAL_TRANSACTIONS, CLIENT_SAMPLE_HISTORY, AVAILABLE_CLIENT_TAGS } from '../data/mockData';
import type { Appointment, PendingAppointment, Client, Transaction, AppointmentStatus, PaymentStatus, ClientHistoryItem, AgendaBlock, Service } from '../types';
import { operationsApi, type ApiAppointment, type ApiClient, type ApiService } from '../infra/operations/operations-api';
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
  clients: Client[];
  bookingClients: ApiClient[];
  services: Service[];
  clientTags: string[];
  pendingApprovals: PendingAppointment[];
  clientHistory: ClientHistoryItem[];
  agendaBlocks: AgendaBlock[];
  operationsError: string | null;
  setAgendaRange: (from: string, to: string) => void;
  updateAppointmentStatus: (id: string | number | undefined, status: AppointmentStatus, paymentInfo?: { amount: string; paymentStatus: PaymentStatus; paymentMethod?: string }) => void;
  addAppointment: (input: ManualBookingInput) => Promise<ApiAppointment>;
  rescheduleAppointment: (id: string | number | undefined, date: string, time: string) => void;
  cancelAppointment: (id: string | number | undefined) => void;
  approvePending: (id: string) => Promise<void>;
  rejectPending: (id: string) => Promise<void>;
  reschedulePending: (id: string, date: string, time: string) => Promise<void>;
  denyPending: (id: string, reason: string) => Promise<void>;
  addAgendaBlock: (block: Omit<AgendaBlock, 'id'>) => Promise<void>;
  updateAgendaBlock: (block: AgendaBlock) => Promise<void>;
  deleteAgendaBlock: (id: string | number) => Promise<void>;
  addService: (service: ServiceInput) => Promise<void>;
  updateService: (id: string, service: ServiceInput) => Promise<void>;
  updateClient: (client: Client) => void;
  addClientTag: (tag: string) => void;
  removeClientTag: (tag: string) => void;
  updateClientHistoryPayment: (id: number, amount: string, paymentMethod: string) => void;
  updateTransactionPayment: (id: number, paymentStatus: PaymentStatus, paymentMethod?: string) => void;
  completeAppointmentCheckout: (appointment: Appointment, amount: string, paymentStatus: PaymentStatus, paymentMethod?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const formatDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const currentMonth = () => {
  const now = new Date();
  return { from: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)), to: formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
};
const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
const duration = (minutes: number) => minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}min` : ''}`;
const statusMap: Record<ApiAppointment['status'], AppointmentStatus> = {
  AGUARDANDO: 'aguardando', CONFIRMADO: 'confirmado', REAGENDAMENTO_SUGERIDO: 'pendente', CANCELADO: 'bloqueado',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [range, setRange] = useState(currentMonth);
  const setAgendaRange = useCallback((from: string, to: string) => {
    setRange((current) => current.from === from && current.to === to ? current : { from, to });
  }, []);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [clientTags, setClientTags] = useState<string[]>(AVAILABLE_CLIENT_TAGS);
  const [clientHistory, setClientHistory] = useState<ClientHistoryItem[]>(CLIENT_SAMPLE_HISTORY);
  const enabled = Boolean(currentUser);

  const servicesQuery = useQuery({ queryKey: ['operations', 'services'], queryFn: operationsApi.listServices, enabled });
  const clientsQuery = useQuery({ queryKey: ['operations', 'clients'], queryFn: operationsApi.listClients, enabled });
  const appointmentsQuery = useQuery({ queryKey: ['operations', 'appointments', range.from, range.to], queryFn: () => operationsApi.listAppointments(range.from, range.to), enabled });
  const pendingQuery = useQuery({ queryKey: ['operations', 'pending'], queryFn: operationsApi.listPending, enabled });
  const blocksQuery = useQuery({ queryKey: ['operations', 'blocks', range.from, range.to], queryFn: () => operationsApi.listBlocks(range.from, range.to), enabled });

  const serviceRecords = servicesQuery.data ?? [];
  const clientRecords = clientsQuery.data ?? [];
  const services: Service[] = serviceRecords.map((item: ApiService) => ({
    id: item.id, name: item.name, category: item.category, price: money(item.priceCents), duration: duration(item.durationMinutes),
    priceCents: item.priceCents, durationMinutes: item.durationMinutes, active: item.active, description: item.description,
  }));
  const convertAppointment = (item: ApiAppointment): Appointment => ({
    id: item.id,
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
  const firstError = [servicesQuery.error, clientsQuery.error, appointmentsQuery.error, pendingQuery.error, blocksQuery.error].find(Boolean);
  const operationsError = firstError instanceof Error ? firstError.message : null;

  const refreshAppointments = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['operations', 'appointments'] }),
      queryClient.invalidateQueries({ queryKey: ['operations', 'pending'] }),
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

  const unsupported = () => { throw new Error('Esta ação ainda não está disponível para agendamentos da API'); };
  const updateAppointmentStatus = (..._args: Parameters<DataContextType['updateAppointmentStatus']>) => { void _args; unsupported(); };
  const rescheduleAppointment = (..._args: Parameters<DataContextType['rescheduleAppointment']>) => { void _args; unsupported(); };
  const cancelAppointment = (..._args: Parameters<DataContextType['cancelAppointment']>) => { void _args; unsupported(); };
  const updateClient = (client: Client) => setClients((prev) => prev.map((item) => item.phone === client.phone ? client : item));
  const addClientTag = (tag: string) => setClientTags((prev) => prev.includes(tag) ? prev : [...prev, tag]);
  const removeClientTag = (tag: string) => setClientTags((prev) => prev.filter((item) => item !== tag));
  const updateClientHistoryPayment = (id: number, amount: string, paymentMethod: string) => setClientHistory((prev) => prev.map((item) => item.id === id ? { ...item, amount, paymentStatus: 'recebido', paymentMethod } : item));
  const updateTransactionPayment = (id: number, paymentStatus: PaymentStatus, paymentMethod?: string) => {
    setTransactions((prev) => prev.map((tx) => tx.id === id ? { ...tx, status: paymentStatus, method: paymentMethod || tx.method } : tx));
  };
  const completeAppointmentCheckout = (..._args: Parameters<DataContextType['completeAppointmentCheckout']>) => { void _args; unsupported(); };

  return <DataContext.Provider value={{
    appointments, transactions, clients, bookingClients: clientRecords, services, clientTags, pendingApprovals, clientHistory, agendaBlocks,
    operationsError, setAgendaRange,
    updateAppointmentStatus, addAppointment, rescheduleAppointment, cancelAppointment,
    approvePending, rejectPending, reschedulePending, denyPending,
    addAgendaBlock, updateAgendaBlock, deleteAgendaBlock, addService, updateService,
    updateClient, addClientTag, removeClientTag, updateClientHistoryPayment, updateTransactionPayment, completeAppointmentCheckout,
  }}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve ser utilizado dentro de um DataProvider');
  return context;
};
