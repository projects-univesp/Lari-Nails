import type { IClientRepository } from '../domain/client.repository.interface';
import { ValidationError } from '../../shared/errors';

export class DeleteClientUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError('ID do cliente é obrigatório');
    }
    return this.clientRepository.delete(id);
  }
}
