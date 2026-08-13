import { describe, it, expect, vi } from 'vitest';
import { getStats } from '../lib/api/stats';
import apiClient from '../lib/api-client';

vi.mock('../lib/api-client');

describe('Stats API', () => {
  it('should fetch stats', async () => {
    const mockData = { total_members: 10, total_batches: 2, total_events: 5 };
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await getStats();
    expect(apiClient.get).toHaveBeenCalledWith('/stats');
    expect(result).toEqual(mockData);
  });
});
