export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Não autorizado') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}
