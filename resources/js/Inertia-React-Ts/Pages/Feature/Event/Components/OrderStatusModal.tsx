import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { PayOrder } from "../Types";

interface OrderStatusModalProps {
  isOpen: boolean;
  editingOrder: PayOrder | null;
  status: "pending" | "success" | "cancelled";
  processingOrder: boolean;
  onStatusChange: (status: "pending" | "success" | "cancelled") => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function OrderStatusModal({
  isOpen,
  editingOrder,
  status,
  processingOrder,
  onStatusChange,
  onSubmit,
  onCancel,
}: OrderStatusModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90%] max-w-[380px] rounded-md">
        <DialogHeader>
          <DialogTitle>Verifikasi Status Pesanan</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              Kode Order:{" "}
              <span className="font-mono font-bold">{editingOrder?.order_code}</span>
            </label>
            <Select value={status} onValueChange={(val: any) => onStatusChange(val)}>
              <SelectTrigger className="h-8 text-[13px]">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending (Menunggu Verifikasi)</SelectItem>
                <SelectItem value="success">Success (Pembayaran Valid)</SelectItem>
                <SelectItem value="cancelled">Cancelled (Dibatalkan / Batal)</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              disabled={processingOrder}
            >
              {processingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
