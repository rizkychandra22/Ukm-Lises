import { describe, it, expect, vi } from 'vitest';
import { getEvents } from '../lib/api/event';
import apiClient from '../lib/api-client';

vi.mock('../lib/api-client');

describe('Event API', () => {
  it('should fetch events', async () => {
    const mockData = [{ id: 1, title_id: 'Test Event' }];
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await getEvents();
    expect(apiClient.get).toHaveBeenCalledWith('/events');
    expect(result).toEqual(mockData);
  });
});
