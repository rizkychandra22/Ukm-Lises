import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import DashboardLayout from "../../../Layouts/AppLayout";
import { route } from "../../../Lib/Route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

interface NewsProps {
  news?: {
    id: number;
    type: string;
    date: string;
    title_id: string;
    summary_id: string;
    description_id: string;
    image: string;
  };
}

export default function FormNews({ news }: NewsProps) {
  const isEdit = !!news;

  const { data, setData, post, processing, errors } = useForm<any>({
    _method: isEdit ? "PUT" : "POST",
    type: news?.type || "",
    date: news?.date ? dayjs(news.date).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
    title_id: news?.title_id || "",
    summary_id: news?.summary_id || "",
    description_id: news?.description_id || "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(news?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isEdit ? route("news.update", news.id) : route("news.store");

    post(endpoint, {
      onSuccess: () => {
        toast.success(`Berita berhasil ${isEdit ? "diperbarui" : "ditambahkan"}.`);
      },
      onError: () => {
        toast.error("Gagal menyimpan berita. Periksa kembali form isian Anda.");
      },
    });
  };

  return (
    <DashboardLayout>
      <Head title={isEdit ? `Edit Berita: ${news.title_id}` : "Tambah Berita"} />
      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">
              Manajemen Data Berita
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola berita dan publikasi UKM Lises.
            </p>
          </div>
        </div>

        <div className="w-full border-b border-border mt-2" />

        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kiri: Meta Data */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Tipe Berita / Kategori</Label>
                  <Select value={data.type} onValueChange={(val) => setData("type", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Tipe Berita" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pementasan">Pementasan</SelectItem>
                      <SelectItem value="Pelatihan">Pelatihan</SelectItem>
                      <SelectItem value="Prestasi">Prestasi</SelectItem>
                      <SelectItem value="Aktivitas">Aktivitas</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <span className="text-xs text-destructive">{errors.type}</span>}
                </div>

                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={data.date}
                    onChange={(e) => setData("date", e.target.value)}
                  />
                  {errors.date && <span className="text-xs text-destructive">{errors.date}</span>}
                </div>

                <div className="space-y-2">
                  <Label>Judul Berita</Label>
                  <Input
                    value={data.title_id}
                    onChange={(e) => setData("title_id", e.target.value)}
                    placeholder="Contoh: Penampilan Asmarandana di Bandung"
                  />
                  {errors.title_id && (
                    <span className="text-xs text-destructive">{errors.title_id}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Ringkasan / Summary {isEdit ? "" : "(Opsional/Singkat)"}</Label>
                  <Textarea
                    value={data.summary_id}
                    onChange={(e) => setData("summary_id", e.target.value)}
                    placeholder="Ringkasan singkat dari berita ini..."
                    className="h-20"
                  />
                  {errors.summary_id && (
                    <span className="text-xs text-destructive">{errors.summary_id}</span>
                  )}
                </div>
              </div>

              {/* Kanan: Foto */}
              <div className="space-y-2">
                <Label>
                  Foto Utama (Cover){" "}
                  {isEdit && (
                    <span className="text-muted-foreground text-xs font-normal ml-2">
                      (Kosongkan jika tidak diubah)
                    </span>
                  )}
                </Label>
                <div className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-6 bg-muted/20 relative group h-[278px]">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg absolute inset-0"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 bg-white/20 text-white backdrop-blur-sm px-4 py-2 rounded-full font-medium">
                            <Upload className="w-4 h-4" /> Ganti Foto
                          </div>
                        </Label>
                      </div>
                    </>
                  ) : (
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center text-center"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground">Pilih Foto</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Maks. 10MB (JPG, PNG, WEBP)
                      </span>
                    </Label>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {errors.image && <span className="text-xs text-destructive">{errors.image}</span>}
              </div>
            </div>

            {/* Bawah: Konten Panjang */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Label>Isi Berita / Deskripsi Berita</Label>
              <Textarea
                value={data.description_id}
                onChange={(e) => setData("description_id", e.target.value)}
                placeholder="Tulis deskripsi berita secara lengkap di sini..."
                className="min-h-[300px]"
              />
              {errors.description_id && (
                <span className="text-xs text-destructive">{errors.description_id}</span>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3.5 rounded-lg text-[13px] font-medium"
                onClick={() => router.visit(route("news.index"))}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="h-8 px-3.5 rounded-lg text-[13px] font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {isEdit ? "Simpan Perubahan" : "Simpan"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
