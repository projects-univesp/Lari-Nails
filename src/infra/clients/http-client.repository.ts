import type {
  IClientRepository,
  CreateClientInput,
  UpdateClientInput,
} from '../../core/clients/domain/client.repository.interface';
import { ClientEntity } from '../../core/clients/domain/client.entity';
import { HttpClient, httpClient } from '../http/http-client';
import { INITIAL_CLIENTS } from '../../data/mockData';

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
const LOCAL_STORAGE_MOCK_CLIENTS = 'lari_nails_mock_clients_list';

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

function getLocalMockClients(): ClientEntity[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MOCK_CLIENTS);
    if (raw) {
      const parsed = JSON.parse(raw) as Array<{
        id: string;
        nome: string;
        telefone: string;
        status?: 'ativo' | 'inativo';
        totalFaltas?: number;
        tags?: string[];
        bday?: string;
        lastVisit?: string;
      }>;
      return parsed.map((item) => new ClientEntity(item));
    }
  } catch {
    // Silencioso
  }

  // Inicializa com os dados mock se ainda não houver
  const initial = INITIAL_CLIENTS.map(
    (c, idx) =>
      new ClientEntity({
        id: `mock-client-${idx + 1}`,
        nome: c.name,
        telefone: c.phone,
        status: 'ativo',
        totalFaltas: 0,
        tags: c.tags,
        bday: c.bday,
        lastVisit: c.lastVisit,
      })
  );
  saveLocalMockClients(initial);
  return initial;
}

function saveLocalMockClients(clients: ClientEntity[]): void {
  try {
    const data = clients.map((c) => ({
      id: c.id,
      nome: c.nome,
      telefone: c.telefone,
      status: c.status,
      totalFaltas: c.totalFaltas,
      tags: c.tags,
      bday: c.bday,
      lastVisit: c.lastVisit,
    }));
    localStorage.setItem(LOCAL_STORAGE_MOCK_CLIENTS, JSON.stringify(data));
  } catch {
    // Silencioso
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
    try {
      const dtos = await this.client.get<ApiClientDto[]>('/clients');
      return dtos.map((dto) => this.mapDtoToEntity(dto));
    } catch {
      // Fallback em caso de API offline para facilitar validação no front
      return getLocalMockClients();
    }
  }

  async findById(id: string): Promise<ClientEntity | null> {
    try {
      const dto = await this.client.get<ApiClientDto | null>(`/clients/${id}`);
      if (!dto) return null;
      return this.mapDtoToEntity(dto);
    } catch {
      const mocks = getLocalMockClients();
      return mocks.find((c) => c.id === id) || null;
    }
  }

  async create(input: CreateClientInput): Promise<ClientEntity> {
    try {
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
    } catch {
      // Criação mock local
      const newEntity = new ClientEntity({
        id: `mock-client-${Date.now()}`,
        nome: input.nome,
        telefone: input.telefone,
        status: input.status ?? 'ativo',
        totalFaltas: input.totalFaltas ?? 0,
        tags: input.tags || ['Nova'],
        bday: input.bday,
        lastVisit: 'Hoje',
      });
      const current = getLocalMockClients();
      saveLocalMockClients([newEntity, ...current]);
      return newEntity;
    }
  }

  async update(input: UpdateClientInput): Promise<ClientEntity> {
    try {
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
    } catch {
      // Atualização mock local
      const current = getLocalMockClients();
      const client = current.find((c) => c.id === input.id);
      if (client) {
        client.updateData({
          nome: input.nome,
          telefone: input.telefone,
          status: input.status,
          tags: input.tags,
          bday: input.bday,
        });
        saveLocalMockClients(current);
        return client;
      }
      throw new Error('Cliente não encontrado');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete<void>(`/clients/${id}`);
    } catch {
      const current = getLocalMockClients();
      const filtered = current.filter((c) => c.id !== id);
      saveLocalMockClients(filtered);
    }
  }

  async restore(id: string): Promise<ClientEntity> {
    try {
      const response = await this.client.patch<ApiUpdateResponse>(`/clients/${id}/restore`);
      return this.mapDtoToEntity(response.client);
    } catch {
      const current = getLocalMockClients();
      const client = current.find((c) => c.id === id);
      if (client) {
        client.activate();
        saveLocalMockClients(current);
        return client;
      }
      throw new Error('Cliente não encontrado');
    }
  }
}

export const httpClientRepository = new HttpClientRepository();
