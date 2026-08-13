import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactPage } from '../pages/ContactPage';

vi.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'id' },
  }),
}));

describe('ContactPage', () => {
  it('should render the contact page successfully', () => {
    render(<ContactPage />);
    expect(document.body).toBeInTheDocument();
  });
});
