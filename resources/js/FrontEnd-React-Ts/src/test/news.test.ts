import { describe, it, expect, vi } from 'vitest';
import { getNews, getNewsDetail } from '../lib/api/news';
import apiClient from '../lib/api-client';

vi.mock('../lib/api-client');

describe('News API', () => {
  it('should fetch news list', async () => {
    const mockData = [{ id: 1, title_id: 'Test News' }];
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await getNews();
    expect(apiClient.get).toHaveBeenCalledWith('/news');
    expect(result).toEqual(mockData);
  });

  it('should fetch news detail', async () => {
    const mockData = { id: 1, title_id: 'Test News' };
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await getNewsDetail('test-slug');
    expect(apiClient.get).toHaveBeenCalledWith('/news/test-slug');
    expect(result).toEqual(mockData);
  });
});
