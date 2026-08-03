/// <reference types="vite/client" />
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from './FrontEnd-React-Ts/src/components/ui/sonner';
import { toast } from 'sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel Admin';

// Global flash handler — fires on every Inertia page visit
router.on('navigate', (event) => {
    const props = (event.detail?.page as any)?.props;
    const flash = props?.flash;
    
    if (flash?.success) {
        if (typeof flash.success === 'object' && flash.success !== null) {
            toast.success(flash.success.title || 'Berhasil', { description: flash.success.message });
        } else {
            toast.success('Berhasil', { description: String(flash.success) });
        }
    }
    
    if (flash?.error) {
        if (typeof flash.error === 'object' && flash.error !== null) {
            toast.error(flash.error.title || 'Perhatian', { description: flash.error.message });
        } else {
            toast.error('Perhatian', { description: String(flash.error) });
        }
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Inertia-React-Ts/Pages/${name}.tsx`, import.meta.glob('./Inertia-React-Ts/Pages/**/*.tsx')) as any,
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster />
            </>
        );
    },
    progress: {
        color: '#1582ffff',
    },
});