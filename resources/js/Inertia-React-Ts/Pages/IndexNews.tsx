import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "../Layouts/AppLayout";
import { route } from "../Lib/Route";
import { toast } from "sonner";
import { NewsItem, NewsPageProps } from "./Feature/News/Types";
import { Table } from "./Feature/News/Components/Table";
import { DeleteDialog } from "./Feature/News/Components/DeleteDialog";
import { Newspaper } from "lucide-react";

export default function IndexNews({ news }: NewsPageProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("Semua Tipe Berita");

  const handleDelete = (item: NewsItem) => {
    setSelectedNews(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedNews) return;
    setProcessing(true);
    router.delete(route("news.destroy", selectedNews.id), {
      preserveScroll: false,
      preserveState: true,
      onSuccess: () => {
        setIsDeleteOpen(false);
        setProcessing(false);
        toast.success("Berita berhasil dihapus.");
      },
      onError: () => setProcessing(false),
    });
  };

  return (
    <DashboardLayout>
      <Head title="Kelola Berita" />
      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
              <Newspaper className="w-5 h-5 mr-3 text-primary" /> Manajemen Data Berita
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola berita dan publikasi UKM Lises.
            </p>
          </div>
        </div>

        <div className="w-full border-b border-border mt-2" />

        {/* Modular News Table with TanStack Table */}
        <Table
          news={news?.data || []}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onDelete={handleDelete}
        />
      </div>

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
