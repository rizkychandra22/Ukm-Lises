import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemberPage } from '../pages/MemberPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'id' },
  }),
}));

vi.mock('@/hooks/useMember', () => ({
  useMembers: () => ({ isLoading: false, members: [] }),
  useBatches: () => ({ isLoading: false, batches: [] }),
}));

describe('MemberPage', () => {
  it('should render the member page successfully', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MemberPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
    expect(document.body).toBeInTheDocument();
  });
});
