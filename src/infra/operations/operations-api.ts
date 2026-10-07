import { httpClient } from '../http/http-client';

export interface ApiService {
  id: string;
  name: string;
  category: string;
  description: string | null;
  priceCents: number;
  durationMinutes: number;
  active: boolean;
}

export interface ApiBusinessHours {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  lunchStart: string | null;
  lunchEnd: string | null;
}

export interface ApiAgendaBlock {
  id: string;
  reason: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ApiAppointment {
  id: string;
  clientId: string;
  serviceId: string;
  requestedDate: string;
  requestedTime: string;
  endTime: string;
  durationMinutes: number;
  priceCents: number;
  source: 'MANUAL' | 'WHATSAPP_BOT';
  status: 'AGUARDANDO' | 'CONFIRMADO' | 'REAGENDAMENTO_SUGERIDO' | 'CANCELADO' | 'CONCLUIDO';
  denialReason: string | null;
  proposedDate: string | null;
  proposedTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiClient {
  id: string;
  nome: string;
  telefone: string;
  tags: string[];
  bday: string | null;
  totalFaltas: number;
  status: 'ativo' | 'inativo';
}

export interface ApiTransaction {
  id: string;
  appointmentId: string;
  clientId: string;
  clientName: string;
  serviceName: string;
  amountCents: number;
  status: 'PENDENTE' | 'RECEBIDO';
  method: 'PIX' | 'CARTAO' | 'DINHEIRO' | null;
  appointmentDate: string;
  appointmentTime: string;
  date: string;
  paidAt: string | null;
}

export interface ApiClientHistory {
  id: string;
  date: string;
  time: string;
  status: 'CONCLUIDO';
  service: string;
  amountCents: number;
  paymentStatus: 'PENDENTE' | 'RECEBIDO';
  paymentMethod: 'PIX' | 'CARTAO' | 'DINHEIRO' | null;
  paymentId: string;
}

export interface ApiSlot {
  date: string;
  startTime: string;
  endTime: string;
}

const rangeQuery = (from: string, to: string) => `from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

export const operationsApi = {
  listServices: () => httpClient.get<ApiService[]>('/services'),
  createService: (input: Omit<ApiService, 'id'>) => httpClient.post<ApiService>('/services', input),
  updateService: (id: string, input: Partial<Omit<ApiService, 'id'>>) => httpClient.patch<ApiService>(`/services/${id}`, input),
  listBusinessHours: () => httpClient.get<ApiBusinessHours[]>('/business-hours'),
  saveBusinessHours: (days: ApiBusinessHours[]) => httpClient.put<ApiBusinessHours[]>('/business-hours', { days }),
  listBlocks: (from: string, to: string) => httpClient.get<ApiAgendaBlock[]>(`/agenda-blocks?${rangeQuery(from, to)}`),
  createBlock: (input: Omit<ApiAgendaBlock, 'id'>) => httpClient.post<ApiAgendaBlock>('/agenda-blocks', input),
  updateBlock: (id: string, input: Omit<ApiAgendaBlock, 'id'>) => httpClient.patch<ApiAgendaBlock>(`/agenda-blocks/${id}`, input),
  deleteBlock: (id: string) => httpClient.delete<void>(`/agenda-blocks/${id}`),
  listAppointments: (from: string, to: string) => httpClient.get<ApiAppointment[]>(`/appointments?${rangeQuery(from, to)}`),
  listPending: () => httpClient.get<ApiAppointment[]>('/appointments/pending'),
  createAppointment: (input: { clientId: string; serviceId: string; requestedDate: string; requestedTime: string; source: 'MANUAL' }) => httpClient.post<ApiAppointment>('/appointments', input),
  decideAppointment: (id: string, input: { status: 'CONFIRMADO' | 'CANCELADO' | 'REAGENDAMENTO_SUGERIDO'; reason?: string; proposedDate?: string; proposedTime?: string }) => httpClient.post<ApiAppointment>(`/appointments/${id}/status`, input),
  listClients: () => httpClient.get<ApiClient[]>('/clients'),
  availability: (serviceId: string, from: string, to: string, excludeAppointmentId?: string) => httpClient.get<ApiSlot[]>(`/availability?serviceId=${encodeURIComponent(serviceId)}&${rangeQuery(from, to)}${excludeAppointmentId ? `&excludeAppointmentId=${encodeURIComponent(excludeAppointmentId)}` : ''}`),
  rescheduleAppointment: (id: string, requestedDate: string, requestedTime: string) => httpClient.patch<ApiAppointment>(`/appointments/${id}/reschedule`, { requestedDate, requestedTime }),
  checkout: (appointmentId: string, input: { amountCents: number; status: 'PENDENTE' | 'RECEBIDO'; method?: 'PIX' | 'CARTAO' | 'DINHEIRO' }) => httpClient.post<ApiTransaction>(`/finance/appointments/${appointmentId}/checkout`, input),
  listTransactions: (from: string, to: string) => httpClient.get<ApiTransaction[]>(`/finance/transactions?${rangeQuery(from, to)}`),
  receiveTransaction: (id: string, method: 'PIX' | 'CARTAO' | 'DINHEIRO') => httpClient.patch<ApiTransaction>(`/finance/transactions/${id}/receive`, { method }),
  clientHistory: (id: string) => httpClient.get<ApiClientHistory[]>(`/clients/${id}/history`),
  listClientTags: () => httpClient.get<string[]>('/client-tags'),
  createClientTag: (name: string) => httpClient.post<string>('/client-tags', { name }),
  deleteClientTag: (name: string) => httpClient.delete<void>(`/client-tags/${encodeURIComponent(name)}`),
};
