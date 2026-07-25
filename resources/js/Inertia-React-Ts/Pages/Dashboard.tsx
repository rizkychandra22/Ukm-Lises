import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AppLayout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />
            
            <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">Dashboard</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Selamat datang kembali, System Admin. Anda masuk sebagai Administrator.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
