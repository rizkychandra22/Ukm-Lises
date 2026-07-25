import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
// import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            // ===== DEFAULTS LARAVEL (DISABLED) =====
            // input: ['resources/css/app.css', 'resources/js/app.js'],
            // fonts: [
            //     bunny('Instrument Sans', {
            //         weights: [400, 500, 600],
            //     }),
            // ],

            // ===== CONFIG FRONTEND REACT TS =====
            input: [
                'resources/js/FrontEnd-React-Ts/src/main.tsx',
                'resources/js/FrontEnd-React-Ts/src/assets/logo-bg-light.png',
                'resources/js/app.tsx',
            ],
            refresh: true,
        }),
        react(), // Hubungkan ke Vite plugin React
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js/FrontEnd-React-Ts/src'),
            '@admin': path.resolve(__dirname, './resources/js/Inertia-React-Ts'),
        },
        dedupe: ['react', 'react-dom'],
    },
    server: {
        // ===== DEFAULTS LARAVEL (DISABLED) =====
        // watch: {
        //     ignored: ['**/storage/framework/views/**'],
        // },

        // ===== CONFIG FRONTEND REACT TS =====
        origin: 'http://localhost:5173',
        cors: true,
        host: true,
    },
});