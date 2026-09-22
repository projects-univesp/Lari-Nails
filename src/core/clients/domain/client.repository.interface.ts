import { ClientEntity, type ClientStatus } from './client.entity';

export interface CreateClientInput {
  nome: string;
  telefone: string;
  status?: ClientStatus;
  totalFaltas?: number;
  tags?: string[];
  bday?: string;
}

export interface UpdateClientInput {
  id: string;
  nome?: string;
  telefone?: string;
  status?: ClientStatus;
  totalFaltas?: number;
  tags?: string[];
  bday?: string;
}

export interface IClientRepository {
  findAll(): Promise<ClientEntity[]>;
  findById(id: string): Promise<ClientEntity | null>;
  create(input: CreateClientInput): Promise<ClientEntity>;
  update(input: UpdateClientInput): Promise<ClientEntity>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<ClientEntity>;
}
