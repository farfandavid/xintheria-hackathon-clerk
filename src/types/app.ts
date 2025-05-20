import type { AppError } from '@/errors/errors';

export type AppRes<T> = {
  data?: T | null;
  error: AppError | null;
};
