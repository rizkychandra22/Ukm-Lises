import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "../Layouts/AppLayout";
import { route } from "../Lib/Route";
import { toast } from "sonner";
import { GalleryItem, GalleryFormData, GalleryPageProps } from "./Feature/Gallery/Types";
import { Table } from "./Feature/Gallery/Components/Table";
import { FormModal } from "./Feature/Gallery/Components/FormModal";
import { DeleteDialog } from "./Feature/Gallery/Components/DeleteDialog";
import { ImageIcon } from "lucide-react";

export default function IndexGallery({ galleries }: GalleryPageProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState<GalleryFormData>({
    title_id: "",
    desc_id: "",
    image: null,
    is_index: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const handleAdd = () => {
    setFormData({ title_id: "", desc_id: "", image: null, is_index: false });
    setErrors({});
    setSelectedGallery(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (gallery: GalleryItem) => {
    setSelectedGallery(gallery);
    setFormData({
      title_id: gallery.title_id,
      desc_id: gallery.desc_id || "",
      image: null,
      is_index: gallery.is_index,
    });
    setErrors({});
    setIsSheetOpen(true);
  };

  const handleDelete = (gallery: GalleryItem) => {
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
      onError: (err: any) => {
        setErrors(err || {});
        setProcessing(false);
      },
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
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
              <ImageIcon className="w-5 h-5 mr-3 text-primary" /> Manajemen Data Galeri
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola gambar galeri yang akan ditampilkan di halaman utama.
            </p>
          </div>
        </div>

        <div className="w-full border-b border-border mt-2" />

        {/* Modular Gallery Table with TanStack Table */}
        <Table
          galleries={galleries?.data || []}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal Tambah/Edit */}
      <FormModal
        isOpen={isSheetOpen}
        selectedGallery={selectedGallery}
        formData={formData}
        errors={errors}
        processing={processing}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => setIsSheetOpen(false)}
      />

      {/* Alert Hapus */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        processing={processing}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}
