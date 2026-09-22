import type { IClientRepository, CreateClientInput } from '../domain/client.repository.interface';
import { ClientEntity } from '../domain/client.entity';

export class CreateClientUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(input: CreateClientInput): Promise<ClientEntity> {
    // A validação de regras de negócio é acionada na entidade
    new ClientEntity({
      nome: input.nome,
      telefone: input.telefone,
      status: input.status,
      totalFaltas: input.totalFaltas,
      tags: input.tags,
      bday: input.bday,
    });

    return this.clientRepository.create(input);
  }
}
