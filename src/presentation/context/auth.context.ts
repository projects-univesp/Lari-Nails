import { createContext } from 'react';
import type { AuthUser } from '../../core/auth/domain/auth-user.entity';

export interface AuthContextType {
  currentUser: AuthUser | null;
  isSetupCompleted: boolean | undefined;
  isLoading: boolean;
  login: (credentials: { email: string; senha: string }) => Promise<void>;
  setup: (data: { nome: string; email: string; senha: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
