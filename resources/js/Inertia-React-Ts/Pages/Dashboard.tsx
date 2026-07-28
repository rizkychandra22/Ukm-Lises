import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '../Layouts/AppLayout';

interface User {
    id: number;
    name?: string;
    username?: string;
    roles?: string[];
}

interface SharedProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export default function Dashboard() {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;
    
    const hasRole = (roleNames: string | string[]) => {
        if (!user?.roles) return false;
        if (Array.isArray(roleNames)) {
            return roleNames.some(role => user.roles?.includes(role));
        }
        return user.roles.includes(roleNames);
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />
            
            <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">Dashboard</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {hasRole('Master') ? (
                                <>Halo <i><b>{user?.roles?.[0]}</b></i>, selamat datang kembali, silakan pantau data web dan server Anda.</>
                            ) : hasRole('Admin') ? (
                                <>Halo <i><b>{user?.name}</b></i>, selamat datang kembali di pusat management internal <b>Lises Asmarandana</b>.</>
                            ) : hasRole('User') ? (
                                <>Halo Angkatan <i><b>{user?.name}</b></i>, selamat datang kembali di <b>Lises Asmarandana</b>. Silahkan lihat daftar teman angkatan kalian yaa.</>
                            ) : null}
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}