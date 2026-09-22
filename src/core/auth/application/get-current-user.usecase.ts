import type { IAuthRepository } from '../domain/auth.repository.interface';
import type { AuthUser } from '../domain/auth-user.entity';

export class GetCurrentUserUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<AuthUser | null> {
    return this.authRepository.getMe();
  }
}
