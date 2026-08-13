import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import IndexEvent from '../Pages/IndexEvent';

describe('IndexEvent Component', () => {
    it('renders the IndexEvent component without crashing', () => {
        const mockProps = {
            events: [], orders: [], accounts: [], sessions: [], members: []
        };
        const { container } = render(<IndexEvent {...mockProps as any} />);
        expect(container).toBeInTheDocument();
    });
});
