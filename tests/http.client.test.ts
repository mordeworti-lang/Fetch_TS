import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchData } from '../src/core/http.client';
import { ApiResponse } from '../src/types/index';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchData', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should return data on successful response', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData)
    });

    const result: ApiResponse<typeof mockData> = await fetchData('https://api.example.com/test');

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
    expect(result.status).toBe(200);
  });

  it('should handle HTTP error responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    const result = await fetchData('https://api.example.com/test');

    expect(result.data).toBeNull();
    expect(result.status).toBe(404);
    expect(result.error).toContain('Not Found');
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchData('https://api.example.com/test');

    expect(result.data).toBeNull();
    expect(result.error).toContain('Network');
    expect(result.status).toBe(0);
  });

  it('should handle empty JSON responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(null)
    });

    const result = await fetchData('https://api.example.com/test');

    expect(result.data).toBeNull();
    expect(result.error).toContain('Empty');
  });
});

