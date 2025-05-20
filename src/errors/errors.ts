export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  OK: 200,
} as const;

export interface AppError {
  status: number;
  message: string;
  name: string;
}

export interface AppValidationError extends AppError {
  field: unknown;
}

export class AppError extends Error implements AppError {
  status: number;
  name: string = 'AppError';

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

export class DBError extends AppError {
  constructor(message: string) {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
    this.name = 'DBError';
  }
}

export class ValidationError extends AppError implements AppValidationError {
  field: unknown;
  constructor(message: string, field: unknown) {
    super(HTTP_STATUS.BAD_REQUEST, message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(HTTP_STATUS.UNAUTHORIZED, message);
    this.name = 'UnauthorizedError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(HTTP_STATUS.UNAUTHORIZED, message);
    this.name = 'AuthError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(HTTP_STATUS.CONFLICT, message);
    this.name = 'ConflictError';
  }
}

export class ErrorHandler {
  static handleError(error: unknown): Response {
    if (error instanceof ValidationError) {
      return new Response(
        JSON.stringify({
          data: null,
          error: {
            message: error.message,
            field: error.field,
          },
        }),
        {
          status: error.status,
        }
      );
    }
    if (error instanceof AppError) {
      return new Response(
        JSON.stringify({
          data: null,
          error: {
            message: error.message,
          },
        }),
        {
          status: error.status,
        }
      );
    }

    return new Response(
      JSON.stringify({
        data: null,
        error: {
          message: 'Internal Server Error',
          name: 'InternalServerError',
        },
      }),
      {
        status: 500,
      }
    );
  }
}
