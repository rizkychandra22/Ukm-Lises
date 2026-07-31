import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './resources/js/FrontEnd-React-Ts/src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js/FrontEnd-React-Ts/src'),
      '@admin': path.resolve(__dirname, './resources/js/Inertia-React-Ts'),
    },
  },
});
