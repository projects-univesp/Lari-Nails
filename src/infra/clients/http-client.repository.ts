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
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface ApiUpdateResponse {
  message: string;
  client: ApiClientDto;
}

const LOCAL_STORAGE_TAGS_KEY = 'lari_nails_client_metadata';

function getLocalMetadata(): Record<string, { tags?: string[]; bday?: string }> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TAGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalMetadata(idOrPhone: string, meta: { tags?: string[]; bday?: string }): void {
  try {
    const current = getLocalMetadata();
    current[idOrPhone] = { ...current[idOrPhone], ...meta };
    localStorage.setItem(LOCAL_STORAGE_TAGS_KEY, JSON.stringify(current));
  } catch {
    // Silencioso se localStorage não estiver disponível
  }
}

export class HttpClientRepository implements IClientRepository {
  private readonly client: HttpClient;

  constructor(client: HttpClient = httpClient) {
    this.client = client;
  }

  private mapDtoToEntity(dto: ApiClientDto): ClientEntity {
    const metadata = getLocalMetadata()[dto.id] || getLocalMetadata()[dto.telefone.replace(/\D/g, '')] || {};

    return new ClientEntity({
      id: dto.id,
      nome: dto.nome,
      telefone: dto.telefone,
      status: dto.status,
      totalFaltas: dto.totalFaltas,
      tags: metadata.tags || ['Nova'],
      bday: metadata.bday,
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
    if (!dto) return null;
    return this.mapDtoToEntity(dto);
  }

  async create(input: CreateClientInput): Promise<ClientEntity> {
    await this.client.post<{ message: string }>('/clients', {
      nome: input.nome,
      telefone: input.telefone,
      status: input.status ?? 'ativo',
      totalFaltas: input.totalFaltas ?? 0,
    });

    if (input.tags || input.bday) {
      saveLocalMetadata(input.telefone.replace(/\D/g, ''), {
        tags: input.tags,
        bday: input.bday,
      });
    }

    const all = await this.findAll();
    const created = all.find((c) => c.cleanPhone === input.telefone.replace(/\D/g, ''));
    if (created && (input.tags || input.bday)) {
      saveLocalMetadata(created.id!, { tags: input.tags, bday: input.bday });
    }

    return (
      created ||
      new ClientEntity({
        nome: input.nome,
        telefone: input.telefone,
        status: input.status,
        totalFaltas: input.totalFaltas,
        tags: input.tags,
        bday: input.bday,
      })
    );
  }

  async update(input: UpdateClientInput): Promise<ClientEntity> {
    const response = await this.client.patch<ApiUpdateResponse>(`/clients/${input.id}`, {
      ...(input.nome && { nome: input.nome }),
      ...(input.telefone && { telefone: input.telefone }),
      ...(input.status && { status: input.status }),
      ...(input.totalFaltas !== undefined && { totalFaltas: input.totalFaltas }),
    });

    if (input.tags || input.bday) {
      saveLocalMetadata(input.id, { tags: input.tags, bday: input.bday });
    }

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
