import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import IndexNews from '../Pages/IndexNews';

describe('IndexNews Component', () => {
    it('renders the IndexNews component without crashing', () => {
        const mockProps = {
            news: { data: [], links: [] }
        };
        const { container } = render(<IndexNews {...mockProps as any} />);
        expect(container).toBeTruthy();
    });
});
