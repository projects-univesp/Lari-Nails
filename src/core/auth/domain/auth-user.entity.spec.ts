import { describe, it, expect } from 'vitest';
import { AuthUser } from './auth-user.entity';
import { ValidationError } from '../../shared/errors';

describe('AuthUser Entity', () => {
  it('deve criar uma instância válida de AuthUser', () => {
    const user = new AuthUser({
      id: 'uuid-123',
      nome: 'Larissa Machado',
      email: 'larissa@larinails.com',
      role: 'admin',
    });

    expect(user.id).toBe('uuid-123');
    expect(user.nome).toBe('Larissa Machado');
    expect(user.email).toBe('larissa@larinails.com');
    expect(user.role).toBe('admin');
    expect(user.isAdmin).toBe(true);
    expect(user.firstName).toBe('Larissa');
  });

  it('deve lançar erro se o ID não for fornecido', () => {
    expect(() => {
      new AuthUser({
        id: '',
        nome: 'Larissa',
        email: 'larissa@larinails.com',
        role: 'admin',
      });
    }).toThrow(ValidationError);
  });

  it('deve lançar erro se o nome for curto demais', () => {
    expect(() => {
      new AuthUser({
        id: 'uuid-123',
        nome: 'A',
        email: 'larissa@larinails.com',
        role: 'admin',
      });
    }).toThrow(ValidationError);
  });

  it('deve lançar erro se o email for inválido', () => {
    expect(() => {
      new AuthUser({
        id: 'uuid-123',
        nome: 'Larissa',
        email: 'email-invalido',
        role: 'admin',
      });
    }).toThrow(ValidationError);
  });
});
