import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-8">
            <Head title="Admin Dashboard" />
            
            <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Welcome to Admin Dashboard!</h1>
                <p className="text-slate-600 dark:text-slate-300">
                    This is a completely separate Inertia.js React application powered by Laravel and Vite.
                    It uses the app.blade.php layout.
                </p>
            </div>
        </div>
    );
}
