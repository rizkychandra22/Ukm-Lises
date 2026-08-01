import { useState, useMemo } from "react";
import { Head, router, Link } from "@inertiajs/react";
import DashboardLayout from "../Layouts/AppLayout";
import { route } from "../Lib/Route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

interface News {
    id: number;
    type: string;
    date: string;
    title_id: string;
    title_en: string | null;
    slug: string;
    summary_id: string;
    summary_en: string | null;
    description_id: string;
    description_en: string | null;
    image: string;
    user: {
        id: number;
        name: string;
        roles: string[];
    };
}

interface PageProps {
    news: {
        data: News[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: any[];
    };
}

export default function IndexNews({ news }: PageProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [processing, setProcessing] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("Semua Tipe Berita");
    const [sortConfig, setSortConfig] = useState<{ key: 'title_id' | 'summary_id' | 'date', direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: 'title_id' | 'summary_id' | 'date') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedNews = useMemo(() => {
        let result = news.data.filter(n => {
            const matchesSearch = !searchQuery || 
                (n.title_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (n.summary_id || "").toLowerCase().includes(searchQuery.toLowerCase());
                
            const matchesType = selectedType === "Semua Tipe Berita" || n.type === selectedType;
            
            return matchesSearch && matchesType;
        });

        if (sortConfig) {
            result.sort((a, b) => {
                let aVal = String(a[sortConfig.key] || "");
                let bVal = String(b[sortConfig.key] || "");

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [news.data, searchQuery, selectedType, sortConfig]);

    const handleDelete = (item: News) => {
        setSelectedNews(item);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedNews) return;
        setProcessing(true);
        router.delete(route('news.destroy', selectedNews.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setProcessing(false);
                toast.success('Berita berhasil dihapus.');
            },
            onError: () => setProcessing(false)
        });
    };

    return (
        <DashboardLayout>
            <Head title="Kelola Berita" />
            <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">Manajemen Data Berita</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola berita dan publikasi UKM Lises.
                        </p>
                    </div>
                </div>

                <div className="w-full border-b border-border mt-2" />
                
                {/* Controls Row */}
                <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
                    {/* Search Input */}
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari berita..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
                        />
                    </div>

                    {/* Add Button & Filter */}
                    <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
                        <div className="flex-1 sm:flex-none">
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-full sm:w-[180px] h-8 text-[13px]">
                                    <SelectValue placeholder="Pilih Tipe Berita" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Semua Tipe Berita">Semua Tipe Berita</SelectItem>
                                    <SelectItem value="Pementasan">Berita Pementasan</SelectItem>
                                    <SelectItem value="Pelatihan">Berita Pelatihan</SelectItem>
                                    <SelectItem value="Prestasi">Berita Prestasi</SelectItem>
                                    <SelectItem value="Aktivitas">Berita Aktivitas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Link href={route('news.create')} className="flex-1 sm:flex-none w-full sm:w-auto shrink-0 inline-flex items-center justify-center h-8 px-3.5 rounded-lg text-[13px] font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Berita
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Gambar</TableHead>
                                <TableHead>
                                    <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSort('title_id')}>
                                        Judul <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSort('summary_id')}>
                                        Summary <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSort('date')}>
                                        Tanggal <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedNews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Tidak ada berita yang ditemukan.</TableCell>
                                </TableRow>
                            ) : (
                                filteredAndSortedNews.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="w-20 h-14 rounded-md overflow-hidden bg-muted border">
                                                <img src={item.image} alt={item.title_id} className="w-full h-full object-cover" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-sm line-clamp-2">{item.title_id}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs text-muted-foreground line-clamp-2">{item.summary_id || '-'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{dayjs(item.date).format('DD MMM YYYY')}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                <Link href={route('news.edit', item.id)} className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0" title="Edit Berita">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <Button variant="destructive" size="sm" className="rounded-lg h-8 w-8 p-0" onClick={() => handleDelete(item)} title="Hapus Berita">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Pagination */}
                {news.last_page > 1 && (
                    <div className="mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href={news.prev_page_url || "#"} className={!news.prev_page_url ? "pointer-events-none opacity-50" : ""} />
                                </PaginationItem>
                                {news.links.filter(l => !l.label.includes('&laquo;') && !l.label.includes('&raquo;')).map((link, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink href={link.url || "#"} isActive={link.active}>
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext href={news.next_page_url || "#"} className={!news.next_page_url ? "pointer-events-none opacity-50" : ""} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Alert Hapus */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Berita?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data dan foto akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={processing}>
                            {processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
