import type { ApiAppointmentStatus, ApiAppointmentStatusUpdate } from './contracts';

export type AppointmentActor = ApiAppointmentStatusUpdate['actor'];

const ALLOWED_TRANSITIONS: Record<ApiAppointmentStatus, ApiAppointmentStatus[]> = {
  AGUARDANDO: ['CONFIRMADO', 'REAGENDAMENTO_SUGERIDO', 'CANCELADO'],
  REAGENDAMENTO_SUGERIDO: ['CONFIRMADO', 'CANCELADO', 'AGUARDANDO'],
  CONFIRMADO: ['REALIZADO', 'CANCELADO', 'REAGENDAMENTO_SUGERIDO'],
  REALIZADO: [],
  CANCELADO: [],
};

export const canTransitionAppointment = (
  from: ApiAppointmentStatus,
  to: ApiAppointmentStatus,
): boolean => ALLOWED_TRANSITIONS[from].includes(to);

export const createStatusUpdate = (input: Omit<ApiAppointmentStatusUpdate, 'occurredAt'>): ApiAppointmentStatusUpdate => ({
  ...input,
  occurredAt: new Date().toISOString(),
});

export const statusMessageKind = (status: ApiAppointmentStatus) => {
  switch (status) {
    case 'CONFIRMADO': return 'appointment_confirmed' as const;
    case 'REAGENDAMENTO_SUGERIDO': return 'reschedule_suggested' as const;
    case 'CANCELADO': return 'appointment_denied' as const;
    case 'REALIZADO': return 'appointment_completed' as const;
    default: return 'appointment_received' as const;
  }
};
