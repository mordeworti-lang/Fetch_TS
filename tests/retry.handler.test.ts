import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withRetry } from '../src/core/retry.handler';
import { ApiResponse } from '../src/types/index';

describe('withRetry', () => {
  const mockExecutor = vi.fn();

  beforeEach(() => {
    mockExecutor.mockClear();
  });

  it('should return success immediately', async () => {
    const successResponse: ApiResponse<string> = { data: 'success', error: null, status: 200 };
    mockExecutor.mockResolvedValueOnce(successResponse);

    const result = await withRetry('url', { retries: 3 }, mockExecutor);

    expect(result.data).toBe('success');
    expect(mockExecutor).toHaveBeenCalledTimes(1);
  });

  it('should retry on 500 error then succeed', async () => {
    const errorResponse: ApiResponse<string> = { data: null, error: 'Server Error', status: 500 };
    const successResponse: ApiResponse<string> = { data: 'success', error: null, status: 200 };
    
    mockExecutor
      .mockResolvedValueOnce(errorResponse)
      .mockResolvedValueOnce(successResponse);

    const result = await withRetry('url', { retries: 3, retryDelay: 10 }, mockExecutor);

    expect(result.data).toBe('success');
    expect(mockExecutor).toHaveBeenCalledTimes(2);
  });

  it('should not retry on 400 error', async () => {
    const errorResponse: ApiResponse<string> = { data: null, error: 'Bad Request', status: 400 };
    mockExecutor.mockResolvedValueOnce(errorResponse);

    const result = await withRetry('url', { retries: 3 }, mockExecutor);

    expect(result.error).toBe('Bad Request');
    expect(mockExecutor).toHaveBeenCalledTimes(1);
  });
});

