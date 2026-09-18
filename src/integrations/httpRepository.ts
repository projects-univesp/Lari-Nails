import type {
  AgendaRepository,
  ApiAgendaBlockRecord,
  ApiAppointmentRecord,
  ApiAppointmentRequest,
  ApiAppointmentStatusUpdate,
  ApiError,
  ApiResult,
  ApiPaymentRecord,
  WhatsAppMessageRequest,
  WhatsAppMessageResult,
} from './contracts';

export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | undefined;
}

export class HttpAgendaRepository implements AgendaRepository {
  private readonly options: ApiClientOptions;

  constructor(options: ApiClientOptions) {
    this.options = options;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    try {
      const token = this.options.getAccessToken?.();
      const response = await fetch(`${this.options.baseUrl}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...init?.headers,
        },
      });
      const body = await response.json() as T | { error?: ApiError; requestId?: string };
      if (!response.ok) {
        const errorBody = body as { error?: ApiError; requestId?: string };
        return { error: errorBody.error || { code: 'HTTP_ERROR', message: response.statusText }, requestId: errorBody.requestId };
      }
      return { data: body as T };
    } catch (error) {
      return { error: { code: 'NETWORK_ERROR', message: error instanceof Error ? error.message : 'Falha de rede' } };
    }
  }

  listAppointments(range: { from: string; to: string }) {
    return this.request<ApiAppointmentRecord[]>(`/v1/appointments?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`);
  }

  createAppointment(input: Omit<ApiAppointmentRequest, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request<ApiAppointmentRecord>('/v1/appointments', { method: 'POST', body: JSON.stringify(input) });
  }

  updateAppointmentStatus(input: ApiAppointmentStatusUpdate) {
    return this.request<ApiAppointmentRecord>(`/v1/appointments/${input.appointmentId}/status`, { method: 'POST', body: JSON.stringify(input) });
  }

  listAgendaBlocks(range: { from: string; to: string }) {
    return this.request<ApiAgendaBlockRecord[]>(`/v1/agenda-blocks?from=${encodeURIComponent(range.from)}&to=${encodeURIComponent(range.to)}`);
  }

  saveAgendaBlock(input: Omit<ApiAgendaBlockRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request<ApiAgendaBlockRecord>('/v1/agenda-blocks', { method: 'POST', body: JSON.stringify(input) });
  }

  updatePayment(input: Pick<ApiPaymentRecord, 'id' | 'status' | 'method'>) {
    return this.request<ApiPaymentRecord>(`/v1/payments/${input.id}`, { method: 'PATCH', body: JSON.stringify(input) });
  }

  sendWhatsAppMessage(input: WhatsAppMessageRequest) {
    return this.request<WhatsAppMessageResult>('/v1/whatsapp/messages', { method: 'POST', body: JSON.stringify(input) });
  }
}
