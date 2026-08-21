import { useState, useMemo } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import { route } from "../../Lib/Route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "../../Components/DataTable";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { Plus, Edit, Trash2, ArrowUpDown, Eye, Loader2, Save, Rocket, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Release {
  id: number;
  version: string;
  title: string;
  subtitle: string | null;
  description: string;
  created_at: string;
}

export default function Release({ releases }: { releases: Release[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState<Release | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    data,
    setData,
    post,
    put,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm({
    version: "",
    title: "",
    subtitle: "",
    description: "",
  });

  const handleOpenModal = (release?: Release) => {
    if (release) {
      setEditingId(release.id);
      setData({
        version: release.version,
        title: release.title,
        subtitle: release.subtitle || "",
        description: release.description || "",
      });
    } else {
      setEditingId(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleView = (release: Release) => {
    setViewData(release);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      put(route("system.releases.update", editingId), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Data release berhasil diperbarui");
          reset();
        },
      });
    } else {
      post(route("system.releases.store"), {
        preserveScroll: false,
        preserveState: true,
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Data release berhasil ditambahkan");
          reset();
        },
      });
    }
  };

  const handleDelete = () => {
    if (editingId) {
      destroy(route("system.releases.destroy", editingId), {
        preserveScroll: false,
        preserveState: true,
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          toast.success("Data release berhasil dihapus");
        },
      });
    }
  };

  const columns = useMemo<ColumnDef<Release, any>[]>(
    () => [
      {
        accessorKey: "version",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Version <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: Release } }) => (
          <Badge className="font-mono bg-primary text-black hover:bg-primary/90">
            {row.original.version}
          </Badge>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }: { row: { original: Release } }) => <div>{row.original.title}</div>,
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }: { row: { original: Release } }) => (
          <div className="flex justify-end gap-2 items-center">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 w-8 p-0"
              size="sm"
              onClick={() => handleView(row.original)}
              title="Lihat Detail"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
              size="sm"
              onClick={() => handleOpenModal(row.original)}
              title="Edit Release"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-lg h-8 w-8 p-0"
              onClick={() => {
                setEditingId(row.original.id);
                setIsDeleteModalOpen(true);
              }}
              title="Hapus Release"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const toolbarExtra = (
    <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
      <Button
        onClick={() => handleOpenModal()}
        size="sm"
        className="flex-1 sm:flex-none w-full sm:w-auto shrink-0 rounded-lg text-[13px] shadow-sm"
      >
        <Plus className="w-4 h-4 mr-1" /> Tambah Release
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <Head title="Release Information" />
      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div className="w-full">
          <div className="flex flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
              <Info className="w-5 h-5 mr-3 text-primary" /> Release Information
            </h2>
            <div className="flex shrink-0 mt-1 sm:mt-0">
              <Badge variant="default" className="text-xs">
                <Rocket className="mr-1 w-3 h-3" />
                {(usePage().props as any).web_version || "Release v0.0.0"}
              </Badge>
            </div>
          </div>
          <p className="w-full text-sm text-muted-foreground mt-1">
            Manage the list of releases and the app update changelog. The latest version will appear
            throughout the app.
          </p>
        </div>

        <div className="w-full border-b border-border mt-2" />

        <DataTable
          columns={columns}
          data={releases}
          searchPlaceholder="Cari berdasarkan versi atau judul..."
          toolbarExtra={toolbarExtra}
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Release" : "Tambah Release Baru"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Version</label>
                <Input
                  value={data.version}
                  onChange={(e) => setData("version", e.target.value)}
                  placeholder="e.g. v1.0.0"
                />
                {errors.version && <p className="text-xs text-red-500">{errors.version}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                  placeholder="e.g. Fitur Baru Ditambahkan"
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle (Opsional)</label>
                <Input
                  value={data.subtitle}
                  onChange={(e) => setData("subtitle", e.target.value)}
                  placeholder="Penjelasan singkat"
                />
                {errors.subtitle && <p className="text-xs text-red-500">{errors.subtitle}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Opsional)</label>
                <Textarea
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Detail fitur dan perubahan..."
                  rows={5}
                />
                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 mb-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" /> {editingId ? "Simpan Perubahan" : "Simpan"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Release</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Apakah Anda yakin ingin menghapus data release ini? Data yang sudah dihapus tidak dapat
            dikembalikan.
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={processing}
            >
              {processing ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <SheetContent className="w-[90%] sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detail Release</SheetTitle>
            <SheetDescription>
              Complete information regarding this release version.
            </SheetDescription>
          </SheetHeader>
          {viewData && (
            <div className="flex flex-col gap-4 py-4 mt-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Version</label>
                <div className="font-mono text-sm font-medium">{viewData.version}</div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <div className="font-medium">{viewData.title}</div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Subtitle</label>
                <div className="font-medium">{viewData.subtitle || "-"}</div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div className="whitespace-pre-wrap font-medium">{viewData.description || "-"}</div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
