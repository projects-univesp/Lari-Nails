import { describe, it, expect, vi } from 'vitest';
import { ListClientsUseCase } from './list-clients.usecase';
import type { IClientRepository } from '../domain/client.repository.interface';
import { ClientEntity } from '../domain/client.entity';

describe('ListClientsUseCase', () => {
  const client1 = new ClientEntity({
    id: '1',
    nome: 'Maria Silva',
    telefone: '11987654321',
    tags: ['VIP'],
  });
  const client2 = new ClientEntity({
    id: '2',
    nome: 'Beatriz Santos',
    telefone: '11912345678',
    tags: ['Devedora'],
  });

  const mockRepo: IClientRepository = {
    findAll: vi.fn().mockResolvedValue([client1, client2]),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    restore: vi.fn(),
  };

  it('deve listar todos os clientes quando nenhum filtro for informado', async () => {
    const useCase = new ListClientsUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].nome).toBe('Maria Silva');
  });

  it('deve filtrar clientes por termo de busca', async () => {
    const useCase = new ListClientsUseCase(mockRepo);
    const result = await useCase.execute({ search: 'Beatriz' });

    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe('Beatriz Santos');
  });

  it('deve filtrar clientes por tag', async () => {
    const useCase = new ListClientsUseCase(mockRepo);
    const result = await useCase.execute({ tag: 'VIP' });

    expect(result).toHaveLength(1);
    expect(result[0].nome).toBe('Maria Silva');
  });
});
