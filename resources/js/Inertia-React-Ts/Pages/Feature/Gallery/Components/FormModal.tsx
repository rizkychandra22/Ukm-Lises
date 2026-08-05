import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { GalleryItem, GalleryFormData } from "../Types";

interface FormModalProps {
  isOpen: boolean;
  selectedGallery: GalleryItem | null;
  formData: GalleryFormData;
  errors: Record<string, string>;
  processing: boolean;
  setFormData: React.Dispatch<React.SetStateAction<GalleryFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function FormModal({
  isOpen,
  selectedGallery,
  formData,
  errors,
  processing,
  setFormData,
  onSubmit,
  onCancel,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90%] max-w-[500px] rounded-md">
        <DialogHeader>
          <DialogTitle>{selectedGallery ? "Edit Galeri" : "Tambah Galeri"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-4 pt-4 max-h-[75vh] overflow-y-auto no-scrollbar px-1"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Galeri</Label>
              <Input
                value={formData.title_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, title_id: e.target.value }))}
                required
              />
              {errors.title_id && (
                <span className="text-xs text-destructive">{errors.title_id}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Deskripsi Galeri</Label>
              <Textarea
                value={formData.desc_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, desc_id: e.target.value }))}
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
                  setFormData((prev) => ({
                    ...prev,
                    image: e.target.files ? e.target.files[0] : null,
                  }))
                }
                required={!selectedGallery}
              />
              {errors.image && <span className="text-xs text-destructive">{errors.image}</span>}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Jadikan Hero (Index)</Label>
                  <p className="text-xs text-muted-foreground">
                    Tampil paling awal & besar di Halaman Galeri.
                  </p>
                </div>
                <Switch
                  checked={formData.is_index}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_index: checked }))
                  }
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
              onClick={onCancel}
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
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />{" "}
                  {selectedGallery ? "Simpan Perubahan" : "Simpan"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
