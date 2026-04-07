import { ApiResponse, RequestConfig, HttpMethod } from '@/types';
import { ResponseBuilder } from './utils';

const buildRequestInit = (config: RequestConfig): RequestInit => ({
  method: config.method ?? 'GET',
  headers: config.headers,
  body: config.body ? JSON.stringify(config.body) : undefined,
  signal: config.signal
});

const buildUrlWithParams = (
  url: string, 
  params?: Record<string, string>
): string => {
  if (!params) return url;
  const searchParams = new URLSearchParams(params);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${searchParams.toString()}`;
};

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    return ResponseBuilder.httpError<T>(response.status, response.statusText);
  }

  try {
    const data = await response.json();
    return ResponseBuilder.success<T>(data as T, response.status);
  } catch {
    return ResponseBuilder.parseError<T>(response.status);
  }
};

export const executeRequest = async <T>(
  url: string,
  config: RequestConfig
): Promise<ApiResponse<T>> => {
  const finalUrl = buildUrlWithParams(url, config.headers?.['X-Params'] as unknown as Record<string, string>);
  const init = buildRequestInit(config);
  
  const response = await fetch(finalUrl, init);
  return parseResponse<T>(response);
};

