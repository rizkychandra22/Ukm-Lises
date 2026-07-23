import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
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
                '!FrontEnd-React-Ts/src/main.tsx',
                '!FrontEnd-React-Ts/src/assets/logo-bg-light.png',
            ],
            refresh: true,
        }),
        react(), // Hubungkan ke Vite plugin React
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './!FrontEnd-React-Ts/src'),
        },
    },
    server: {
        // ===== DEFAULTS LARAVEL (DISABLED) =====
        // watch: {
        //     ignored: ['**/storage/framework/views/**'],
        // },

        // ===== CONFIG FRONTEND REACT TS =====
        origin: 'http://localhost:5173',
    },
});