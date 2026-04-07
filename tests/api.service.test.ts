import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from '../src/services/api.service';
import { ApiResponse } from '../src/types/index';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should get all items', async () => {
    const mockData = [{ id: 1, name: 'Item 1' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData)
    });

    const service = new ApiService<{ id: number; name: string }>('https://api.example.com/items');
    const result = await service.getAll();

    expect(result.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/items');
  });

  it('should get one item', async () => {
    const mockData = { id: 1, name: 'Item 1' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData)
    });

    const service = new ApiService<{ id: number; name: string }>('https://api.example.com/items');
    const result = await service.getOne(1);

    expect(result.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/items/1');
  });

  it('should create item with advanced client', async () => {
    const mockData = { id: 1, name: 'New Item' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve(mockData)
    });

    const service = new ApiService<{ id: number; name: string }>(
      'https://api.example.com/items',
      { useAdvanced: true }
    );
    
    const result = await service.create({ name: 'New Item' });

    expect(result.data).toEqual(mockData);
  });
});

