import type {
  IAuthRepository,
  LoginInput,
  SetupInput,
  AuthResponse,
  SetupStatusResponse,
} from '../../core/auth/domain/auth.repository.interface';
import { AuthUser } from '../../core/auth/domain/auth-user.entity';
import { HttpClient, httpClient } from '../http/http-client';

interface ApiUserDto {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

interface ApiAuthResponse {
  message: string;
  user: ApiUserDto;
}

interface ApiMeResponse {
  user: ApiUserDto | null;
}

const MOCK_STORAGE_KEY = 'lari_nails_mock_session';

export const MOCK_ADMIN_USER = new AuthUser({
  id: 'mock-admin-uuid-1',
  nome: 'Larissa Machado',
  email: 'admin@larinails.com',
  role: 'admin',
});

export class HttpAuthRepository implements IAuthRepository {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  async getSetupStatus(): Promise<SetupStatusResponse> {
    try {
      return await this.client.get<SetupStatusResponse>('/auth/setup-status');
    } catch {
      // Se a API estiver offline, assume setup já realizado para permitir o login mockado
      return { isSetupCompleted: true };
    }
  }

  async setup(input: SetupInput): Promise<AuthResponse> {
    try {
      const response = await this.client.post<ApiAuthResponse>('/auth/setup', input);
      return {
        message: response.message,
        user: new AuthUser(response.user),
      };
    } catch {
      // Fallback para modo mock
      const mockUser = new AuthUser({
        id: `mock-${Date.now()}`,
        nome: input.nome,
        email: input.email,
        role: 'admin',
      });
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify({
        id: mockUser.id,
        nome: mockUser.nome,
        email: mockUser.email,
        role: mockUser.role,
      }));
      return {
        message: 'Setup concluído com sucesso (Modo Mock)',
        user: mockUser,
      };
    }
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      const response = await this.client.post<ApiAuthResponse>('/auth/login', input);
      localStorage.removeItem(MOCK_STORAGE_KEY);
      return {
        message: response.message,
        user: new AuthUser(response.user),
      };
    } catch (error) {
      // Se as credenciais forem o mock padrão ou a API estiver indisponível
      const isDefaultMock =
        input.email.toLowerCase() === 'admin@larinails.com' &&
        (input.senha === 'admin123' || input.senha === '123456');

      if (isDefaultMock || (error instanceof Error && error.message.includes('comunicação com a API'))) {
        localStorage.setItem(
          MOCK_STORAGE_KEY,
          JSON.stringify({
            id: MOCK_ADMIN_USER.id,
            nome: MOCK_ADMIN_USER.nome,
            email: input.email,
            role: MOCK_ADMIN_USER.role,
          })
        );

        return {
          message: 'Login realizado com sucesso (Modo Mock)',
          user: MOCK_ADMIN_USER,
        };
      }

      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post<void>('/auth/logout');
    } catch {
      // Silencioso em caso de API offline
    } finally {
      localStorage.removeItem(MOCK_STORAGE_KEY);
    }
  }

  async getMe(): Promise<AuthUser | null> {
    try {
      const response = await this.client.get<ApiMeResponse>('/auth/me');
      if (response?.user) return new AuthUser(response.user);
    } catch {
      // Tenta recuperar sessão mockada do localStorage
    }

    try {
      const raw = localStorage.getItem(MOCK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return new AuthUser(parsed);
      }
    } catch {
      // Ignora erro de JSON
    }

    return null;
  }
}

export const httpAuthRepository = new HttpAuthRepository();
