import { DomainError, NotFoundError, UnauthorizedError, ValidationError } from '../../core/shared/errors';

export interface HttpClientOptions {
  baseUrl?: string;
}

export class HttpClient {
  private readonly baseUrl: string;

  constructor(options?: HttpClientOptions) {
    this.baseUrl =
      options?.baseUrl ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
      'http://localhost:4000';
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Correlation-Id': `web-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...(init?.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...init,
        credentials: 'include', // Necessário para cookies HTTP-only de sessão (access_token)
        headers,
      });

      if (response.status === 204) {
        return undefined as unknown as T;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || response.statusText || 'Erro na requisição';
        const formattedMsg = Array.isArray(message) ? message.join(', ') : message;

        if (response.status === 401) {
          throw new UnauthorizedError(formattedMsg);
        }
        if (response.status === 404) {
          throw new NotFoundError(formattedMsg);
        }
        if (response.status === 400) {
          throw new ValidationError(formattedMsg);
        }
        throw new DomainError(formattedMsg);
      }

      return data as T;
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw new DomainError(
        error instanceof Error ? error.message : 'Falha na comunicação com a API'
      );
    }
  }

  get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { method: 'GET', headers });
  }

  post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  patch<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  delete<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { method: 'DELETE', headers });
  }
}

export const httpClient = new HttpClient();
