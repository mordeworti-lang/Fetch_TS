import { ApiResponse, RequestConfig } from '@/types';
import { fetchData, AdvancedHttpClient } from '@/core';

interface ApiServiceConfig {
  useAdvanced?: boolean;
  timeout?: number;
  retries?: number;
}

export class ApiService<T> {
  private httpClient?: AdvancedHttpClient;

  constructor(
    private readonly baseUrl: string,
    private config: ApiServiceConfig = {}
  ) {
    if (config.useAdvanced) {
      this.httpClient = new AdvancedHttpClient({
        timeout: config.timeout,
        retries: config.retries
      });
    }
  }

  async getAll(): Promise<ApiResponse<T[]>> {
    if (this.httpClient) {
      return this.httpClient.get<T[]>(this.baseUrl);
    }
    return fetchData<T[]>(this.baseUrl);
  }

  async getOne(id: number | string): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${id}`;
    if (this.httpClient) {
      return this.httpClient.get<T>(url);
    }
    return fetchData<T>(url);
  }

  async create(data: Omit<T, 'id'>): Promise<ApiResponse<T>> {
    if (!this.httpClient) {
      throw new Error('AdvancedHttpClient required for create operations');
    }
    return this.httpClient.post<T>(this.baseUrl, { body: data });
  }

  async update(id: number | string, data: Partial<T>): Promise<ApiResponse<T>> {
    if (!this.httpClient) {
      throw new Error('AdvancedHttpClient required for update operations');
    }
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.put<T>(url, { body: data });
  }

  async delete(id: number | string): Promise<ApiResponse<void>> {
    if (!this.httpClient) {
      throw new Error('AdvancedHttpClient required for delete operations');
    }
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.delete<void>(url);
  }

  getMetrics() {
    return this.httpClient?.getMetrics();
  }

  getCircuitBreakerState() {
    return this.httpClient?.getCircuitBreakerState();
  }
}

