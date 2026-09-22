import { ValidationError } from '../../shared/errors';

export type UserRole = 'admin' | 'user';

export interface AuthUserProps {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export class AuthUser {
  private readonly _id: string;
  private readonly _nome: string;
  private readonly _email: string;
  private readonly _role: UserRole;
  private readonly _createdAt?: string;

  constructor(props: AuthUserProps) {
    this.validate(props);
    this._id = props.id;
    this._nome = props.nome.trim();
    this._email = props.email.toLowerCase().trim();
    this._role = props.role;
    this._createdAt = props.createdAt;
  }

  private validate(props: AuthUserProps): void {
    if (!props.id) {
      throw new ValidationError('ID do usuário é obrigatório');
    }
    if (!props.nome || props.nome.trim().length < 2) {
      throw new ValidationError('Nome do usuário deve ter pelo menos 2 caracteres');
    }
    if (!props.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
      throw new ValidationError('E-mail informado é inválido');
    }
    if (props.role !== 'admin' && props.role !== 'user') {
      throw new ValidationError('Papel de usuário inválido');
    }
  }

  get id(): string {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get email(): string {
    return this._email;
  }

  get role(): UserRole {
    return this._role;
  }

  get createdAt(): string | undefined {
    return this._createdAt;
  }

  get isAdmin(): boolean {
    return this._role === 'admin';
  }

  get firstName(): string {
    return this._nome.split(' ')[0] || this._nome;
  }
}
