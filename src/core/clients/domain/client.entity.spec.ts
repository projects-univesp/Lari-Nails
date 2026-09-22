import { describe, it, expect } from 'vitest';
import { ClientEntity } from './client.entity';
import { ValidationError } from '../../shared/errors';

describe('ClientEntity', () => {
  it('deve instanciar um cliente válido', () => {
    const client = new ClientEntity({
      id: 'uuid-1',
      nome: 'Maria da Silva',
      telefone: '(11) 98765-4321',
      status: 'ativo',
      totalFaltas: 1,
      tags: ['VIP'],
    });

    expect(client.id).toBe('uuid-1');
    expect(client.nome).toBe('Maria da Silva');
    expect(client.telefone).toBe('(11) 98765-4321');
    expect(client.cleanPhone).toBe('11987654321');
    expect(client.status).toBe('ativo');
    expect(client.totalFaltas).toBe(1);
    expect(client.tags).toEqual(['VIP']);
    expect(client.initialLetter).toBe('M');
  });

  it('deve lançar erro se o nome tiver menos de 3 caracteres', () => {
    expect(() => {
      new ClientEntity({
        nome: 'An',
        telefone: '11987654321',
      });
    }).toThrow(ValidationError);
  });

  it('deve lançar erro se o telefone não tiver dígitos suficientes', () => {
    expect(() => {
      new ClientEntity({
        nome: 'Maria Silva',
        telefone: '12345',
      });
    }).toThrow(ValidationError);
  });

  it('deve incrementar e zerar faltas', () => {
    const client = new ClientEntity({
      nome: 'Maria Silva',
      telefone: '11987654321',
      totalFaltas: 0,
    });

    client.incrementFaltas();
    expect(client.totalFaltas).toBe(1);
    client.clearFaltas();
    expect(client.totalFaltas).toBe(0);
  });

  it('deve alternar status entre ativo e inativo', () => {
    const client = new ClientEntity({
      nome: 'Maria Silva',
      telefone: '11987654321',
    });

    client.inactivate();
    expect(client.status).toBe('inativo');
    client.activate();
    expect(client.status).toBe('ativo');
  });
});
