import type { AppointmentStatus, PaymentMethod, PaymentStatus } from '../types';

export type ApiAppointmentStatus = 'AGUARDANDO' | 'CONFIRMADO' | 'REAGENDAMENTO_SUGERIDO' | 'REALIZADO' | 'CANCELADO';
export type ApiPaymentStatus = 'PENDENTE' | 'RECEBIDO';
export type ApiMessageKind = 'appointment_received' | 'appointment_confirmed' | 'reschedule_suggested' | 'appointment_denied' | 'appointment_reminder' | 'appointment_completed' | 'payment_pending';

export interface ApiAppointmentRequest {
  id: string;
  clientId: string;
  serviceId: string;
  requestedDate: string;
  requestedTime: string;
  source: 'WHATSAPP_BOT' | 'MANUAL';
  status: ApiAppointmentStatus;
  denialReason?: string;
  proposedDate?: string;
  proposedTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAppointmentStatusUpdate {
  appointmentId: string;
  status: ApiAppointmentStatus;
  actor: 'CLIENT' | 'BOT' | 'MANICURE' | 'SYSTEM';
  reason?: string;
  date?: string;
  time?: string;
  occurredAt: string;
}

export interface ApiAppointmentRecord extends ApiAppointmentRequest {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  durationMinutes: number;
  priceCents: number;
  paymentStatus: ApiPaymentStatus;
  paymentMethod?: PaymentMethod;
}

export interface ApiAgendaBlockRecord {
  id: string;
  reason: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPaymentRecord {
  id: string;
  appointmentId: string;
  amountCents: number;
  status: ApiPaymentStatus;
  method?: PaymentMethod;
  receivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppMessageRequest {
  appointmentId: string;
  recipientPhone: string;
  kind: ApiMessageKind;
  variables: Record<string, string>;
}

export interface WhatsAppMessageResult {
  messageId: string;
  provider: 'WHATSAPP_CLOUD_API';
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  sentAt?: string;
  errorCode?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface ApiResult<T> {
  data?: T;
  error?: ApiError;
  requestId?: string;
}

export interface AgendaRepository {
  listAppointments(range: { from: string; to: string }): Promise<ApiResult<ApiAppointmentRecord[]>>;
  createAppointment(input: Omit<ApiAppointmentRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<ApiAppointmentRecord>>;
  updateAppointmentStatus(input: ApiAppointmentStatusUpdate): Promise<ApiResult<ApiAppointmentRecord>>;
  listAgendaBlocks(range: { from: string; to: string }): Promise<ApiResult<ApiAgendaBlockRecord[]>>;
  saveAgendaBlock(input: Omit<ApiAgendaBlockRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResult<ApiAgendaBlockRecord>>;
  updatePayment(input: Pick<ApiPaymentRecord, 'id' | 'status' | 'method'>): Promise<ApiResult<ApiPaymentRecord>>;
  sendWhatsAppMessage(input: WhatsAppMessageRequest): Promise<ApiResult<WhatsAppMessageResult>>;
}

export interface DomainAppointmentStatusMap {
  api: ApiAppointmentStatus;
  app: AppointmentStatus;
}

export const APPOINTMENT_STATUS_MAP: DomainAppointmentStatusMap[] = [
  { api: 'AGUARDANDO', app: 'aguardando' },
  { api: 'CONFIRMADO', app: 'confirmado' },
  { api: 'REAGENDAMENTO_SUGERIDO', app: 'pendente' },
  { api: 'REALIZADO', app: 'concluido' },
  { api: 'CANCELADO', app: 'bloqueado' },
];

export const PAYMENT_STATUS_MAP: Record<ApiPaymentStatus, PaymentStatus> = {
  PENDENTE: 'pendente',
  RECEBIDO: 'recebido',
};
