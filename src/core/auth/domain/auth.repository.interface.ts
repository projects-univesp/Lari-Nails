import { AuthUser } from './auth-user.entity';

export interface LoginInput {
  email: string;
  senha: string;
}

export interface SetupInput {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}

export interface SetupStatusResponse {
  isSetupCompleted: boolean;
}

export interface IAuthRepository {
  getSetupStatus(): Promise<SetupStatusResponse>;
  setup(input: SetupInput): Promise<AuthResponse>;
  login(input: LoginInput): Promise<AuthResponse>;
  logout(): Promise<void>;
  getMe(): Promise<AuthUser | null>;
}
