import { ApiResponse } from '@/types';

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const calculateBackoff = (
  attempt: number,
  baseDelay: number
): number =>
  Math.min(baseDelay * Math.pow(2, attempt), 30000);

export class ResponseBuilder<T> {
  static success<T>(data: T, status: number): ApiResponse<T> {
    return { data, error: null, status };
  }

  static error<T>(error: string, status: number): ApiResponse<T> {
    return { data: null, error, status };
  }

  static networkError<T>(): ApiResponse<T> {
    return ResponseBuilder.error('Network error: Failed to connect to the server', 0);
  }

  static timeoutError<T>(timeoutMs: number): ApiResponse<T> {
    return ResponseBuilder.error(`Request timeout after ${timeoutMs}ms`, 408);
  }

  static httpError<T>(status: number, statusText: string): ApiResponse<T> {
    return ResponseBuilder.error(`HTTP ${status}: ${statusText}`, status);
  }

  static maxRetriesExceeded<T>(): ApiResponse<T> {
    return ResponseBuilder.error('Max retries exceeded', 500);
  }

  static parseError<T>(status: number): ApiResponse<T> {
    return ResponseBuilder.error('Failed to parse JSON response', status);
  }

  static emptyBody<T>(status: number): ApiResponse<T> {
    return ResponseBuilder.error('Invalid response: Empty body', status);
  }
}

export type Executor<T> = (url: string, config: unknown) => Promise<ApiResponse<T>>;
