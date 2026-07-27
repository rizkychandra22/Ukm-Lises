import { Link, usePage } from '@inertiajs/react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '@admin/Components/ThemeProvider';


export function Header() {
    const { url } = usePage();
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    const isHome = url === '/dashboard';

    // Simple breadcrumb logic
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const formatPageName = (segment: string) => {
        if (segment === 'list-member') return 'Data Anggota';
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    };
    const pageName = lastSegment ? formatPageName(lastSegment) : 'Dashboard';

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-card/80 px-4 backdrop-blur-sm sticky top-0 z-10 dark:bg-background/80">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-2 rounded-xl" />
                <div className="mx-2 h-4 w-px bg-border/40 md:block" />

                <div className="md:block">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                {isHome ? (
                                    <BreadcrumbPage className="text-[13px] font-medium">Dashboard</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href="/dashboard" className="text-[13px]">Dashboard</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!isHome && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-[13px] font-medium">{pageName}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="ml-auto flex items-center gap-1">
                <div className="relative hidden md:flex items-center w-64 mr-2">
                    <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                    <Input type="text" placeholder="Cari data..." className="pl-9 h-8 bg-muted/50 border-none rounded-lg text-[13px]" />
                </div>

                <Button variant="ghost" size="icon" className="relative rounded-xl w-8 h-8">
                    <Bell className="w-[18px] h-[18px] text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-card"></span>
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl w-8 h-8" aria-label="Toggle Theme">
                    {isDark ? <Sun className="w-[18px] h-[18px] text-muted-foreground" /> : <Moon className="w-[18px] h-[18px] text-muted-foreground" />}
                </Button>
            </div>
        </header>
    );
}
