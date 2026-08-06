import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Loader2, Save } from "lucide-react";
import { Batch } from "../Types";

interface BatchFormModalProps {
  isOpen: boolean;
  editingBatch: Batch | null;
  batchData: {
    year: string;
    name_id: string;
    status: "Active" | "Deactive";
    username?: string;
    password?: string;
  };
  processingBatch: boolean;
  setBatchData: (key: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function BatchFormModal({
  isOpen,
  editingBatch,
  batchData,
  processingBatch,
  setBatchData,
  onSubmit,
  onCancel,
}: BatchFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90%] max-w-[360px] rounded-md">
        <DialogHeader>
          <DialogTitle>
            {editingBatch ? "Edit Angkatan" : "Tambah Angkatan Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-4 max-h-[75vh] overflow-y-auto no-scrollbar px-1">
          <div>
            <label className="block text-sm font-medium mb-1">Tahun Angkatan</label>
            <Input
              className="h-8 text-[13px]"
              placeholder="Cth: 2025"
              value={batchData.year}
              onChange={(e) => setBatchData("year", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nama Angkatan</label>
            <Input
              className="h-8 text-[13px]"
              placeholder="Cth: Angkatan Candradimuka"
              value={batchData.name_id}
              onChange={(e) => setBatchData("name_id", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={batchData.status || undefined}
              onValueChange={(val: any) => setBatchData("status", val)}
            >
              <SelectTrigger className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1.5 text-[13px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active (Mahasiswa)</SelectItem>
                <SelectItem value="Deactive">Deactive (Alumni)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!editingBatch && (
            <div className="flex items-start gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 p-3 rounded-md">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-xs leading-relaxed">
                Pemberitahuan: Sistem akan otomatis membuatkan akun akses untuk angkatan ini dengan Username <span className="font-semibold">lises{batchData.year || "202X"}</span> dan Password bawaan: <span className="font-semibold">password</span>
              </p>
            </div>
          )}

          {editingBatch && (
            <>
              <div className="flex items-start gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 p-3 rounded-md">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p className="text-xs leading-relaxed">
                  Opsional: Isi kolom di bawah jika ingin mengubah akses akun untuk angkatan ini. (Biarkan kosong jika tidak diubah)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username Baru</label>
                <Input
                  className="h-8 text-[13px]"
                  placeholder="Biarkan kosong untuk skip"
                  value={batchData.username || ""}
                  onChange={(e) => setBatchData("username", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password Baru</label>
                <Input
                  type="password"
                  className="h-8 text-[13px]"
                  placeholder="Biarkan kosong untuk skip"
                  value={batchData.password || ""}
                  onChange={(e) => setBatchData("password", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2 mb-2">
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
              disabled={processingBatch}
            >
              {processingBatch ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> {editingBatch ? "Simpan Perubahan" : "Simpan"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
