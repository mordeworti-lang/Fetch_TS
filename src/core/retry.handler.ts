import { ApiResponse, RequestConfig } from '@/types';
import { calculateBackoff, sleep, ResponseBuilder } from './utils';

const isRetryableError = (status: number): boolean => 
  status >= 500 || status === 408 || status === 429;

export const withRetry = async <T>(
  url: string,
  config: RequestConfig,
  executor: (url: string, config: RequestConfig) => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> => {
  const maxRetries = config.retries ?? 0;
  const baseDelay = config.retryDelay ?? 1000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await executor(url, config);

    if (!result.error || !isRetryableError(result.status) || attempt === maxRetries) {
      return result;
    }

    const delay = calculateBackoff(attempt, baseDelay);
    await sleep(delay);
  }

  return ResponseBuilder.maxRetriesExceeded<T>();
};

