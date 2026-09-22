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

export class HttpAuthRepository implements IAuthRepository {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  async getSetupStatus(): Promise<SetupStatusResponse> {
    return this.client.get<SetupStatusResponse>('/auth/setup-status');
  }

  async setup(input: SetupInput): Promise<AuthResponse> {
    const response = await this.client.post<ApiAuthResponse>('/auth/setup', input);
    return {
      message: response.message,
      user: new AuthUser(response.user),
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await this.client.post<ApiAuthResponse>('/auth/login', input);
    return {
      message: response.message,
      user: new AuthUser(response.user),
    };
  }

  async logout(): Promise<void> {
    await this.client.post<void>('/auth/logout');
  }

  async getMe(): Promise<AuthUser | null> {
    try {
      const response = await this.client.get<ApiMeResponse>('/auth/me');
      if (!response?.user) return null;
      return new AuthUser(response.user);
    } catch {
      return null;
    }
  }
}

export const httpAuthRepository = new HttpAuthRepository();
