import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext, type AuthContextType } from './auth.context';
import { LoginUseCase } from '../../core/auth/application/login.usecase';
import { GetSetupStatusUseCase } from '../../core/auth/application/get-setup-status.usecase';
import { SetupInitialAdminUseCase } from '../../core/auth/application/setup-initial-admin.usecase';
import { GetCurrentUserUseCase } from '../../core/auth/application/get-current-user.usecase';
import { LogoutUseCase } from '../../core/auth/application/logout.usecase';
import { httpAuthRepository } from '../../infra/auth/http-auth.repository';

const loginUseCase = new LoginUseCase(httpAuthRepository);
const getSetupStatusUseCase = new GetSetupStatusUseCase(httpAuthRepository);
const setupUseCase = new SetupInitialAdminUseCase(httpAuthRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(httpAuthRepository);
const logoutUseCase = new LogoutUseCase(httpAuthRepository);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: setupStatus, isLoading: isSetupLoading } = useQuery({
    queryKey: ['auth', 'setup-status'],
    queryFn: () => getSetupStatusUseCase.execute(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: currentUser = null, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => getCurrentUserUseCase.execute(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; senha: string }) =>
      loginUseCase.execute(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const setupMutation = useMutation({
    mutationFn: (data: { nome: string; email: string; senha: string }) =>
      setupUseCase.execute(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'setup-status'], { isSetupCompleted: true });
      queryClient.setQueryData(['auth', 'me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutUseCase.execute(),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const value: AuthContextType = {
    currentUser,
    isSetupCompleted: setupStatus?.isSetupCompleted,
    isLoading: isSetupLoading || isUserLoading,
    login: async (credentials) => {
      await loginMutation.mutateAsync(credentials);
    },
    setup: async (data) => {
      await setupMutation.mutateAsync(data);
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
