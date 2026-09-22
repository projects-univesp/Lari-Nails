import type { IClientRepository } from '../domain/client.repository.interface';
import type { ClientEntity } from '../domain/client.entity';
import { ValidationError } from '../../shared/errors';

export class RestoreClientUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<ClientEntity> {
    if (!id) {
      throw new ValidationError('ID do cliente é obrigatório');
    }
    return this.clientRepository.restore(id);
  }
}
