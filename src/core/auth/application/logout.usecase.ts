import type { IAuthRepository } from '../domain/auth.repository.interface';

export class LogoutUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
