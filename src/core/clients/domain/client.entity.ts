import { ValidationError } from '../../shared/errors';

export type ClientStatus = 'ativo' | 'inativo';

export interface ClientProps {
  id?: string;
  nome: string;
  telefone: string;
  status?: ClientStatus;
  totalFaltas?: number;
  tags?: string[];
  bday?: string;
  lastVisit?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export class ClientEntity {
  private readonly _id?: string;
  private _nome: string;
  private _telefone: string;
  private _status: ClientStatus;
  private _totalFaltas: number;
  private _tags: string[];
  private _bday?: string;
  private _lastVisit?: string;
  private readonly _createdAt?: string;
  private _updatedAt?: string;
  private _deletedAt?: string | null;

  constructor(props: ClientProps) {
    this.validate(props.nome, props.telefone, props.totalFaltas ?? 0);
    this._id = props.id;
    this._nome = props.nome.trim();
    this._telefone = props.telefone.trim();
    this._status = props.status ?? 'ativo';
    this._totalFaltas = props.totalFaltas ?? 0;
    this._tags = props.tags ?? [];
    this._bday = props.bday;
    this._lastVisit = props.lastVisit ?? 'Recente';
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  private validate(nome: string, telefone: string, totalFaltas: number): void {
    if (!nome || nome.trim().length < 3) {
      throw new ValidationError('O nome deve ter no mínimo 3 caracteres');
    }
    const cleanPhone = telefone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new ValidationError('O telefone deve ter 10 ou 11 dígitos numéricos');
    }
    if (totalFaltas < 0) {
      throw new ValidationError('O total de faltas não pode ser negativo');
    }
  }

  get id(): string | undefined {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get telefone(): string {
    return this._telefone;
  }

  get cleanPhone(): string {
    return this._telefone.replace(/\D/g, '');
  }

  get status(): ClientStatus {
    return this._status;
  }

  get totalFaltas(): number {
    return this._totalFaltas;
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get bday(): string | undefined {
    return this._bday;
  }

  get lastVisit(): string | undefined {
    return this._lastVisit;
  }

  get createdAt(): string | undefined {
    return this._createdAt;
  }

  get updatedAt(): string | undefined {
    return this._updatedAt;
  }

  get isDeleted(): boolean {
    return this._deletedAt !== null && this._deletedAt !== undefined;
  }

  get initialLetter(): string {
    return this._nome.charAt(0).toUpperCase();
  }

  updateData(data: { nome?: string; telefone?: string; status?: ClientStatus; tags?: string[]; bday?: string }): void {
    const newName = data.nome ?? this._nome;
    const newPhone = data.telefone ?? this._telefone;
    this.validate(newName, newPhone, this._totalFaltas);

    this._nome = newName.trim();
    this._telefone = newPhone.trim();
    if (data.status) this._status = data.status;
    if (data.tags) this._tags = data.tags;
    if (data.bday !== undefined) this._bday = data.bday;
  }

  incrementFaltas(): void {
    this._totalFaltas += 1;
  }

  clearFaltas(): void {
    this._totalFaltas = 0;
  }

  inactivate(): void {
    this._status = 'inativo';
  }

  activate(): void {
    this._status = 'ativo';
  }
}
