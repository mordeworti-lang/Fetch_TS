import {
  ApiResponse,
  RequestConfig,
  CircuitBreakerConfig,
  MiddlewareContext
} from '@/types';
import { MiddlewareChain } from './middleware.chain';
import { CircuitBreaker } from './circuit.breaker';
import { MetricsCollector } from './metrics';
import { executeRequest } from './request.executor';
import { withRetry } from './retry.handler';
import { withTimeout } from './timeout.handler';
import { ResponseBuilder } from './utils';

interface HttpClientConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  circuitBreaker?: CircuitBreakerConfig;
}

const DEFAULT_CONFIG: Required<HttpClientConfig> = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  circuitBreaker: { failureThreshold: 5, resetTimeout: 30000 }
};

const mergeConfig = (
  base: Required<HttpClientConfig>, 
  override?: HttpClientConfig
): Required<HttpClientConfig> => ({
  timeout: override?.timeout ?? base.timeout,
  retries: override?.retries ?? base.retries,
  retryDelay: override?.retryDelay ?? base.retryDelay,
  circuitBreaker: override?.circuitBreaker ?? base.circuitBreaker
});

export class AdvancedHttpClient {
  private middleware: MiddlewareChain = new MiddlewareChain();
  private circuitBreaker: CircuitBreaker;
  private metrics: MetricsCollector = new MetricsCollector();
  private config: Required<HttpClientConfig>;

  constructor(config?: HttpClientConfig) {
    this.config = mergeConfig(DEFAULT_CONFIG, config);
    this.circuitBreaker = new CircuitBreaker(this.config.circuitBreaker);
  }

  use(middleware: (context: MiddlewareContext, next: () => Promise<void>) => Promise<void>): void {
    this.middleware.use(middleware);
  }

  async request<T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    if (!this.circuitBreaker.canExecute()) {
      return ResponseBuilder.error('Circuit breaker is OPEN', 503);
    }

    const context: MiddlewareContext = {
      url,
      config: { ...this.config, ...config },
      startTime: Date.now()
    };

    await this.middleware.execute(context);

    const startTime = Date.now();
    
    try {
      const result = await withRetry<T>(
        url,
        context.config,
        async (u: string, c: RequestConfig) => await withTimeout<T>(u, c, executeRequest)
      );

      const latency = Date.now() - startTime;
      this.metrics.recordRequest(latency, !!result.error);

      if (result.error) {
        this.circuitBreaker.recordFailure();
      } else {
        this.circuitBreaker.recordSuccess();
      }

      return result;
    } catch (error) {
      const latency = Date.now() - startTime;
      this.metrics.recordRequest(latency, true);
      this.circuitBreaker.recordFailure();

      return ResponseBuilder.error(error instanceof Error ? error.message : 'Unknown error', 500);
    }
  }

  get<T>(url: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  post<T>(url: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST' });
  }

  put<T>(url: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT' });
  }

  delete<T>(url: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  getMetrics() {
    return this.metrics.getMetrics();
  }

  getCircuitBreakerState() {
    return this.circuitBreaker.getState();
  }
}

