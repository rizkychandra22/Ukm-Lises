import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import IndexGallery from '../Pages/IndexGallery';

describe('IndexGallery Component', () => {
    it('renders the IndexGallery component without crashing', () => {
        const mockProps = {
            galleries: { data: [], links: [] }
        };
        const { container } = render(<IndexGallery {...mockProps as any} />);
        expect(container).toBeTruthy();
    });
});
