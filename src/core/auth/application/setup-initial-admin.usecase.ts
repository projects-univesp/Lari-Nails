import type { IAuthRepository, SetupInput, AuthResponse } from '../domain/auth.repository.interface';
import { ValidationError } from '../../shared/errors';

export class SetupInitialAdminUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(input: SetupInput): Promise<AuthResponse> {
    if (!input.nome || input.nome.trim().length < 2) {
      throw new ValidationError('Nome deve ter pelo menos 2 caracteres');
    }
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new ValidationError('E-mail inválido');
    }
    if (!input.senha || input.senha.length < 6) {
      throw new ValidationError('Senha deve ter no mínimo 6 caracteres');
    }

    return this.authRepository.setup({
      nome: input.nome.trim(),
      email: input.email.trim(),
      senha: input.senha,
    });
  }
}
