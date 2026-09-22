import type { IClientRepository } from '../domain/client.repository.interface';
import type { ClientEntity } from '../domain/client.entity';
import { ValidationError } from '../../shared/errors';

export class GetClientUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id: string): Promise<ClientEntity | null> {
    if (!id) {
      throw new ValidationError('ID do cliente é obrigatório');
    }
    return this.clientRepository.findById(id);
  }
}
