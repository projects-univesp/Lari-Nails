import type { IAuthRepository, SetupStatusResponse } from '../domain/auth.repository.interface';

export class GetSetupStatusUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<SetupStatusResponse> {
    return this.authRepository.getSetupStatus();
  }
}
