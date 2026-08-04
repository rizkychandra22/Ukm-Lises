import { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "../Layouts/AppLayout";
import { route } from "../Lib/Route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Search, ArrowUpDown, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface Gallery {
  id: number;
  title_id: string;
  title_en: string;
  desc_id: string | null;
  desc_en: string | null;
  image: string;
  // is_active: boolean;
  is_index: boolean;
  user: {
    id: number;
    name: string;
    roles: string[];
  };
}

interface PageProps {
  galleries: {
    data: Gallery[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: any[];
  };
}

export default function IndexGallery({ galleries }: PageProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState({
    title_id: "",
    desc_id: "",
    image: null as File | null,
    // is_active: false,
    is_index: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: "title_id" | "desc_id" | "status";
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: "title_id" | "desc_id" | "status") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedGalleries = useMemo(() => {
    const result = galleries.data.filter((g) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (g.title_id || "").toLowerCase().includes(q) ||
        (g.title_en || "").toLowerCase().includes(q) ||
        (g.desc_id || "").toLowerCase().includes(q) ||
        (g.desc_en || "").toLowerCase().includes(q)
      );
    });

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = (() => {
          if (sortConfig.key === "title_id") return a.title_id || "";
          if (sortConfig.key === "desc_id") return a.desc_id || "";
          // if (sortConfig.key === 'status') return (a.is_active ? "1" : "0") + (a.is_index ? "1" : "0");
          return "";
        })();
        const bVal = (() => {
          if (sortConfig.key === "title_id") return b.title_id || "";
          if (sortConfig.key === "desc_id") return b.desc_id || "";
          // if (sortConfig.key === 'status') return (b.is_active ? "1" : "0") + (b.is_index ? "1" : "0");
          return "";
        })();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [galleries.data, searchQuery, sortConfig]);

  const handleAdd = () => {
    setFormData({ title_id: "", desc_id: "", image: null, is_index: false });
    setErrors({});
    setSelectedGallery(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setFormData({
      title_id: gallery.title_id,
      desc_id: gallery.desc_id || "",
      image: null,
      // is_active: gallery.is_active,
      is_index: gallery.is_index,
    });
    setErrors({});
    setIsSheetOpen(true);
  };

  const handleDelete = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const data = new FormData();
    if (selectedGallery) data.append("_method", "PUT");

    data.append("title_id", formData.title_id);
    if (formData.desc_id) data.append("desc_id", formData.desc_id);
    if (formData.image) data.append("image", formData.image);
    // data.append('is_active', formData.is_active ? '1' : '0');
    data.append("is_index", formData.is_index ? "1" : "0");

    const endpoint = selectedGallery
      ? route("gallery.update", selectedGallery.id)
      : route("gallery.store");

    router.post(endpoint, data, {
      onSuccess: () => {
        setIsSheetOpen(false);
        setProcessing(false);
        toast.success(`Berhasil ${selectedGallery ? "memperbarui" : "menambahkan"} data galeri.`);
      },
      // onError: (err) => {
      //     setErrors(err);
      //     setProcessing(false);
      //     if (err.is_active) toast.error(err.is_active);
      // }
    });
  };

  const confirmDelete = () => {
    if (!selectedGallery) return;
    setProcessing(true);
    router.delete(route("gallery.destroy", selectedGallery.id), {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setProcessing(false);
        toast.success("Berhasil menghapus data galeri.");
      },
      onError: () => setProcessing(false),
    });
  };

  return (
    <DashboardLayout>
      <Head title="Kelola Galeri" />
      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">
              Manajemen Data Galeri
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola gambar galeri yang akan ditampilkan di halaman utama.
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
              placeholder="Cari galeri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
            />
          </div>

          {/* Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <Button
              onClick={handleAdd}
              size="sm"
              className="h-8 px-3.5 rounded-lg text-[13px] font-medium w-full sm:w-auto shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Tambah Galeri
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Gambar</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="-ml-4 hover:bg-transparent"
                    onClick={() => handleSort("title_id")}
                  >
                    Judul <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="-ml-4 hover:bg-transparent"
                    onClick={() => handleSort("desc_id")}
                  >
                    Deskripsi <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="-ml-4 hover:bg-transparent"
                    onClick={() => handleSort("status")}
                  >
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedGalleries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Tidak ada galeri yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedGalleries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-20 h-14 rounded-md overflow-hidden bg-muted border">
                        <img
                          src={item.image}
                          alt={item.title_id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{item.title_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium line-clamp-2">{item.desc_id || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        {/* {item.is_active && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-100 text-green-700 border border-green-200">Active (Slider)</span>} */}
                        {item.is_index && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                            Index (Hero)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <Button
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          title="Edit Galeri"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-lg h-8 w-8 p-0"
                          onClick={() => handleDelete(item)}
                          title="Hapus Galeri"
                        >
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
        {galleries.last_page > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={galleries.prev_page_url || "#"}
                    className={!galleries.prev_page_url ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {galleries.links
                  .filter((l) => !l.label.includes("&laquo;") && !l.label.includes("&raquo;"))
                  .map((link, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink href={link.url || "#"} isActive={link.active}>
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                <PaginationItem>
                  <PaginationNext
                    href={galleries.next_page_url || "#"}
                    className={!galleries.next_page_url ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit */}
      <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <DialogContent className="w-[90%] max-w-[500px] rounded-md">
          <DialogHeader>
            <DialogTitle>{selectedGallery ? "Edit Galeri" : "Tambah Galeri"}</DialogTitle>
            {/* <DialogDescription>
                            Isi detail galeri. Teks berbahasa Indonesia akan otomatis diterjemahkan ke bahasa Inggris oleh sistem.
                        </DialogDescription> */}
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 pt-4 max-h-[75vh] overflow-y-auto no-scrollbar px-1"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Galeri</Label>
                <Input
                  value={formData.title_id}
                  onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                />
                {errors.title_id && (
                  <span className="text-xs text-destructive">{errors.title_id}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Deskripsi Galeri</Label>
                <Textarea
                  value={formData.desc_id}
                  onChange={(e) => setFormData({ ...formData, desc_id: e.target.value })}
                  className="h-24"
                />
                {errors.desc_id && (
                  <span className="text-xs text-destructive">{errors.desc_id}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  Gambar Galeri{" "}
                  {selectedGallery && (
                    <span className="bg-background text-sm file:text-foreground file:bg-muted file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2">
                      (Kosongkan jika tidak diubah)
                    </span>
                  )}
                </Label>
                <Input
                  type="file"
                  className="bg-background text-sm file:text-foreground file:bg-muted file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })
                  }
                  required={!selectedGallery}
                />
                {errors.image && <span className="text-xs text-destructive">{errors.image}</span>}
              </div>

              <div className="space-y-4 pt-4 border-t">
                {/* <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Jadikan Slider (Active)</Label>
                                        <p className="text-xs text-muted-foreground">Tampil di slider HomePage (Maksimal 3 gambar).</p>
                                    </div>
                                    <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                                </div> */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Jadikan Hero (Index)</Label>
                    <p className="text-xs text-muted-foreground">
                      Tampil paling awal & besar di Halaman Galeri.
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_index}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_index: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 mb-2 border-t mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3.5 rounded-lg text-[13px] font-medium"
                onClick={() => setIsSheetOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 px-3.5 rounded-lg text-[13px] font-medium"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {selectedGallery ? "Simpan Perubahan" : "Simpan"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Hapus */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Galeri?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Gambar dan data akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={processing}
            >
              {processing ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
