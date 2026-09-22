import { describe, it, expect, vi } from 'vitest';
import { LoginUseCase } from './login.usecase';
import type { IAuthRepository } from '../domain/auth.repository.interface';
import { AuthUser } from '../domain/auth-user.entity';
import { ValidationError } from '../../shared/errors';

describe('LoginUseCase', () => {
  const mockUser = new AuthUser({
    id: 'user-1',
    nome: 'Larissa Admin',
    email: 'admin@larinails.com',
    role: 'admin',
  });

  const mockRepo: IAuthRepository = {
    getSetupStatus: vi.fn(),
    setup: vi.fn(),
    login: vi.fn().mockResolvedValue({ message: 'Login realizado', user: mockUser }),
    logout: vi.fn(),
    getMe: vi.fn(),
  };

  it('deve executar o login com sucesso quando credenciais forem válidas', async () => {
    const useCase = new LoginUseCase(mockRepo);
    const result = await useCase.execute({
      email: 'admin@larinails.com',
      senha: 'password123',
    });

    expect(mockRepo.login).toHaveBeenCalledWith({
      email: 'admin@larinails.com',
      senha: 'password123',
    });
    expect(result.user.email).toBe('admin@larinails.com');
  });

  it('deve lançar erro se o email for inválido', async () => {
    const useCase = new LoginUseCase(mockRepo);
    await expect(
      useCase.execute({ email: 'invalido', senha: 'password123' })
    ).rejects.toThrow(ValidationError);
  });

  it('deve lançar erro se a senha tiver menos de 6 caracteres', async () => {
    const useCase = new LoginUseCase(mockRepo);
    await expect(
      useCase.execute({ email: 'admin@larinails.com', senha: '123' })
    ).rejects.toThrow(ValidationError);
  });
});
