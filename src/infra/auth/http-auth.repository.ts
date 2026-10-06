import type { IAuthRepository, LoginInput, SetupInput, AuthResponse, SetupStatusResponse } from '../../core/auth/domain/auth.repository.interface';
import { AuthUser } from '../../core/auth/domain/auth-user.entity';
import { HttpClient, httpClient } from '../http/http-client';

interface ApiUserDto { id?: string; sub?: string; nome?: string; email: string; role: 'admin' | 'colaborador' }
interface ApiAuthResponse { message: string; user: ApiUserDto }
const toUser = (user: ApiUserDto) => new AuthUser({ id: user.id ?? user.sub ?? '', nome: user.nome ?? user.email, email: user.email, role: user.role === 'admin' ? 'admin' : 'user' });

export class HttpAuthRepository implements IAuthRepository {
  private readonly client: HttpClient;
  constructor(client: HttpClient = httpClient) { this.client = client; }

  async getSetupStatus(): Promise<SetupStatusResponse> {
    const response = await this.client.get<{ needsSetup: boolean }>('/auth/setup-status');
    return { isSetupCompleted: !response.needsSetup };
  }

  async setup(input: SetupInput): Promise<AuthResponse> {
    const response = await this.client.post<ApiAuthResponse>('/auth/setup', input);
    return { message: response.message, user: toUser(response.user) };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await this.client.post<ApiAuthResponse>('/auth/login', input);
    return { message: response.message, user: toUser(response.user) };
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  async getMe(): Promise<AuthUser | null> {
    try {
      const response = await this.client.get<{ user: ApiUserDto | null }>('/auth/me');
      return response.user ? toUser(response.user) : null;
    } catch {
      return null;
    }
  }
}

export const httpAuthRepository = new HttpAuthRepository();
