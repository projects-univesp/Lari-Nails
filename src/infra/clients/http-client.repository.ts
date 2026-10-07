import type {
  IClientRepository,
  CreateClientInput,
  UpdateClientInput,
} from '../../core/clients/domain/client.repository.interface';
import { ClientEntity } from '../../core/clients/domain/client.entity';
import { HttpClient, httpClient } from '../http/http-client';

interface ApiClientDto {
  id: string;
  nome: string;
  telefone: string;
  status: 'ativo' | 'inativo';
  totalFaltas: number;
  tags: string[];
  bday: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface ApiUpdateResponse {
  message: string;
  client: ApiClientDto;
}

export class HttpClientRepository implements IClientRepository {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  private mapDtoToEntity(dto: ApiClientDto): ClientEntity {
    return new ClientEntity({
      id: dto.id,
      nome: dto.nome,
      telefone: dto.telefone,
      status: dto.status,
      totalFaltas: dto.totalFaltas,
      tags: dto.tags ?? [],
      bday: dto.bday ?? undefined,
      lastVisit: 'Recente',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    });
  }

  async findAll(): Promise<ClientEntity[]> {
    const dtos = await this.client.get<ApiClientDto[]>('/clients');
    return dtos.map((dto) => this.mapDtoToEntity(dto));
  }

  async findById(id: string): Promise<ClientEntity | null> {
    const dto = await this.client.get<ApiClientDto | null>(`/clients/${id}`);
    return dto ? this.mapDtoToEntity(dto) : null;
  }

  async create(input: CreateClientInput): Promise<ClientEntity> {
    await this.client.post<{ message: string }>('/clients', {
      nome: input.nome,
      telefone: input.telefone,
      status: input.status ?? 'ativo',
      totalFaltas: input.totalFaltas ?? 0,
      tags: input.tags ?? [],
      birthday: input.bday ?? null,
    });
    const all = await this.findAll();
    const created = all.find((client) => client.cleanPhone === input.telefone.replace(/\D/g, ''));
    if (!created) throw new Error('Cliente foi criado, mas não apareceu na listagem da API');
    return created;
  }

  async update(input: UpdateClientInput): Promise<ClientEntity> {
    const response = await this.client.patch<ApiUpdateResponse>(`/clients/${input.id}`, {
      ...(input.nome !== undefined && { nome: input.nome }),
      ...(input.telefone !== undefined && { telefone: input.telefone }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.totalFaltas !== undefined && { totalFaltas: input.totalFaltas }),
      ...(input.tags !== undefined && { tags: input.tags }),
      ...(input.bday !== undefined && { birthday: input.bday }),
    });
    return this.mapDtoToEntity(response.client);
  }

  async delete(id: string): Promise<void> {
    await this.client.delete<void>(`/clients/${id}`);
  }

  async restore(id: string): Promise<ClientEntity> {
    const response = await this.client.patch<ApiUpdateResponse>(`/clients/${id}/restore`);
    return this.mapDtoToEntity(response.client);
  }
}

export const httpClientRepository = new HttpClientRepository();
