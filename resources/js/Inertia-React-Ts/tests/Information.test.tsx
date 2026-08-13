import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Information from '../Pages/Information';

describe('Information Component', () => {
    it('renders the Information component without crashing', () => {
        const mockProps = {
            dbInfo: { connection: 'pgsql', database: 'test', host: 'localhost', port: '5432' },
            envInfo: { php_version: '8.3', laravel_version: '11', node_version: '20', os: 'linux', server: 'nginx', timezone: 'UTC' },
            releases: []
        };
        const { container } = render(<Information {...mockProps as any} />);
        expect(container).toBeInTheDocument();
    });
});
