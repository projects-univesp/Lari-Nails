import type { IAuthRepository, LoginInput, AuthResponse } from '../domain/auth.repository.interface';
import { ValidationError } from '../../shared/errors';

export class LoginUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(input: LoginInput): Promise<AuthResponse> {
    if (!input.email || !input.email.includes('@')) {
      throw new ValidationError('E-mail inválido');
    }
    if (!input.senha || input.senha.length < 6) {
      throw new ValidationError('A senha deve ter no mínimo 6 caracteres');
    }

    return this.authRepository.login({
      email: input.email.trim(),
      senha: input.senha,
    });
  }
}
