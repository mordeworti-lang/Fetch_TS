import { ApiResponse, RequestConfig } from '@/types';
import { ResponseBuilder } from './utils';

const createAbortController = (timeout: number): AbortController => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller;
};

const mergeSignals = (
  signal1: AbortSignal | undefined, 
  signal2: AbortSignal
): AbortSignal => {
  if (!signal1) return signal2;
  
  const controller = new AbortController();
  
  const onAbort = (): void => controller.abort();
  signal1.addEventListener('abort', onAbort);
  signal2.addEventListener('abort', onAbort);
  
  return controller.signal;
};

export const withTimeout = async <T>(
  url: string,
  config: RequestConfig,
  executor: (url: string, config: RequestConfig) => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  if (!config.timeout) {
    return executor(url, config);
  }

  const controller = createAbortController(config.timeout);
  const mergedSignal = mergeSignals(config.signal, controller.signal);
  
  try {
    return await executor(url, { ...config, signal: mergedSignal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
    return ResponseBuilder.timeoutError(config.timeout);
    }
    throw error;
  }
};

