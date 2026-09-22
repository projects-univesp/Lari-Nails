import type { IClientRepository, UpdateClientInput } from '../domain/client.repository.interface';
import type { ClientEntity } from '../domain/client.entity';
import { ValidationError } from '../../shared/errors';

export class UpdateClientUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(input: UpdateClientInput): Promise<ClientEntity> {
    if (!input.id) {
      throw new ValidationError('ID do cliente é obrigatório');
    }
    return this.clientRepository.update(input);
  }
}
