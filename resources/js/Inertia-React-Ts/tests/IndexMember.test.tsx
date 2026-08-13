import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import IndexMember from '../Pages/IndexMember';

describe('IndexMember Component', () => {
    it('renders the IndexMember component without crashing', () => {
        const mockProps = {
            batches: [], members: []
        };
        const { container } = render(<IndexMember {...mockProps as any} />);
        expect(container).toBeInTheDocument();
    });
});
