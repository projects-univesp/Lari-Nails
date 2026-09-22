import type { IClientRepository } from '../domain/client.repository.interface';
import type { ClientEntity } from '../domain/client.entity';

export class ListClientsUseCase {
  private readonly clientRepository: IClientRepository;

  constructor(clientRepository: IClientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(filter?: { search?: string; tag?: string }): Promise<ClientEntity[]> {
    const clients = await this.clientRepository.findAll();

    if (!filter) return clients;

    return clients.filter((c) => {
      let matchSearch = true;
      if (filter.search && filter.search.trim().length > 0) {
        const term = filter.search.trim().toLowerCase();
        const matchName = c.nome.toLowerCase().includes(term);
        const searchDigits = term.replace(/\D/g, '');
        const matchPhone = searchDigits.length > 0 && c.cleanPhone.includes(searchDigits);
        matchSearch = matchName || matchPhone;
      }

      const matchTag = filter.tag ? c.tags.includes(filter.tag) : true;

      return matchSearch && matchTag;
    });
  }
}
