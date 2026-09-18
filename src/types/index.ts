export type AppointmentStatus = 'aguardando' | 'confirmado' | 'pendente' | 'concluido' | 'bloqueado';

export type PaymentStatus = 'recebido' | 'pendente';

export type PaymentMethod = 'Pix' | 'Cartão' | 'Dinheiro';
export type AppointmentSource = 'MANUAL' | 'WHATSAPP_BOT';

export interface Appointment {
  id?: number;
  time: string;
  client: string;
  service: string;
  status: AppointmentStatus;
  date: string;
  price?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod | string;
  externalId?: string;
  source?: AppointmentSource;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgendaBlock {
  id: number;
  reason: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface PendingAppointment {
  id: number;
  name: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  status?: 'aguardando' | 'reagendamento_sugerido' | 'negado';
  requestedAt?: string;
  proposedDate?: string;
  proposedTime?: string;
  denialReason?: string;
}

export interface Client {
  name: string;
  phone: string;
  tags: string[];
  lastVisit: string;
  bday: string;
}

export interface Service {
  id?: number;
  name: string;
  duration: string;
  price: string;
  category: string;
}

export interface ClientHistoryItem {
  id?: number;
  date: string;
  service: string;
  status: AppointmentStatus;
  amount?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod | string;
  externalId?: string;
}

export interface Transaction {
  id: number;
  appointmentId?: number;
  service: string;
  client: string;
  amount: string;
  numericAmount?: number;
  method: string;
  status: PaymentStatus;
  date: string;
}

export type ScreenName =
  | 'pending_approvals'
  | 'add_appointment'
  | 'agenda_block'
  | 'appointment_details'
  | 'client_profile'
  | 'edit_client'
  | 'service_catalog'
  | 'add_service'
  | 'business_hours'
  | 'client_tags'
  | 'financial_dashboard'
  | 'faturamento'
  | 'checkout'
  | 'bot_customization'
  | 'forgot_password';

export interface ScreenStackItem {
  name: ScreenName;
  data?: unknown;
}

export type TabType = 'dashboard' | 'agenda' | 'clientes' | 'config';

export type AgendaViewMode = 'dia' | 'semana' | 'mes';

export type ScreenOpenHandler = (screenName: ScreenName, data?: unknown) => void;

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type?: ToastType;
}
