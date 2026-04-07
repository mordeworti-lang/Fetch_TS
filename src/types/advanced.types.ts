export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}


export interface MiddlewareContext {
  url: string;
  config: RequestConfig;
  startTime: number;
}

export type Middleware = (
  context: MiddlewareContext,
  next: () => Promise<void>
) => Promise<void>;

export interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number | null;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
}

export interface Metrics {
  requestCount: number;
  errorCount: number;
  totalLatency: number;
  averageLatency: number;
}
