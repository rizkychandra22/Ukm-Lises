import { Link, usePage, router } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter
} from '@/components/ui/sidebar';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Box,
    Wallet,
    FileText,
    Settings,
    LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import LogoDark from '@/assets/logo-bg-dark.png';
import LogoLight from '@/assets/logo-bg-light.png';
import { useTheme } from '@admin/Components/ThemeProvider';

export function AppSidebar() {
    const { url } = usePage();
    const { theme } = useTheme();

    const isActive = (href: string) => url === href || url.startsWith(href + '/');

    return (
        <Sidebar className="border-r border-border">
            <SidebarHeader className="border-b border-border/40 px-4 py-4">
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <img src={theme === 'dark' ? LogoDark : LogoLight} alt="logo" className='w-8 h-8 rounded-full' />
                    <div className="flex flex-col">
                        <span className="text-[13px] font-bold tracking-tight font-display">UKM Lises</span>
                        <span className="text-[10px] text-muted-foreground uppercase">Asmarandana</span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-2 py-2 no-scrollbar">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Beranda
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive('/dashboard')}
                                    className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                                >
                                    <Link href="/dashboard">
                                        <LayoutDashboard className="w-[18px] h-[18px]" />
                                        <span className="text-[13px]">Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mt-2">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/admin/anggota')} className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium">
                                    <Link href="/anggota">
                                        <Users className="w-[18px] h-[18px]" />
                                        <span className="text-[13px]">Data Anggota</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/admin/jadwal')} className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium">
                                    <Link href="/jadwal">
                                        <Calendar className="w-[18px] h-[18px]" />
                                        <span className="text-[13px]">Jadwal Latihan</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/admin/inventaris')} className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium">
                                    <Link href="/inventaris">
                                        <Box className="w-[18px] h-[18px]" />
                                        <span className="text-[13px]">Inventaris</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/admin/keuangan')} className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium">
                                    <Link href="/keuangan">
                                        <Wallet className="w-[18px] h-[18px]" />
                                        <span className="text-[13px]">Kas & Keuangan</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive('/admin/surat')} className="rounded-xl transition-all data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium">
                                    <Link href="/surat">
                                        <FileText className="w-[18px] h-[18px]" />
                                        <span className="text-[13px]">Surat & Proposal</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border/40 p-3">
                <div className="w-full flex items-center gap-2.5 p-1.5 h-auto">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">CA</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 text-left overflow-hidden">
                        <span className="text-[13px] font-medium truncate">Core Admin</span>
                        <span className="text-[10px] text-muted-foreground truncate">@username</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <Link href="/settings" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Pengaturan" title="Pengaturan">
                            <Settings className="w-[18px] h-[18px]" />
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" aria-label="Keluar" title="Keluar">
                                    <LogOut className="w-[18px] h-[18px]" />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[90%] max-w-[360px] rounded-2xl p-6">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center text-lg font-semibold">Keluar</AlertDialogTitle>
                                    <AlertDialogDescription className="text-center text-[15px] mt-2 mb-4 text-foreground/80">
                                        Apakah Anda yakin ingin keluar?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex flex-row justify-center gap-3 mt-2">
                                    <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-10 text-sm font-medium">
                                        Batal
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => router.post('/dashboard/auth/logout')}
                                        className="w-24 h-10 text-sm font-medium rounded-lg"
                                    >
                                        Ya, Keluar
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
