import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { EventItem, PayAccount, EventSession } from "../Types";

interface OfflineOrderModalProps {
  isOpen: boolean;
  events: EventItem[];
  sessions: EventSession[];
  accounts: PayAccount[];
  offlineOrderData: {
    event_id: string;
    event_session_id: string;
    name: string;
    phone: string;
    email: string;
    qty: string;
    notes: string;
    pay_account_id: string;
  };
  offlineOrderErrors: Record<string, string>;
  processingOfflineOrder: boolean;
  setOfflineOrderData: (key: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function OfflineOrderModal({
  isOpen,
  events,
  sessions,
  accounts,
  offlineOrderData,
  offlineOrderErrors,
  processingOfflineOrder,
  setOfflineOrderData,
  onSubmit,
  onCancel,
}: OfflineOrderModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="w-[90%] max-w-[500px] rounded-md">
        <DialogHeader>
          <DialogTitle>Catat Pesanan Tiket Offline</DialogTitle>
        </DialogHeader>
        <p className="text-[12px] text-muted-foreground -mt-2 pb-1">
          Pesanan ini dicatat manual oleh admin. Status otomatis berhasil karena pembayaran
          diterima langsung.
        </p>

        <form
          onSubmit={onSubmit}
          className="space-y-4 pt-1 max-h-[72vh] overflow-y-auto no-scrollbar px-1"
        >
          {/* Pilih Event */}
          <div>
            <label className="block text-sm font-medium mb-1">Event</label>
            <Select
              value={offlineOrderData.event_id}
              onValueChange={(val) => setOfflineOrderData("event_id", val)}
            >
              <SelectTrigger className="h-8 text-[13px]">
                <SelectValue placeholder="Pilih event yang akan dipesan" />
              </SelectTrigger>
              <SelectContent>
                {events
                  .filter((ev) => ev.status === "published")
                  .map((ev) => (
                    <SelectItem key={ev.id} value={ev.id.toString()}>
                      {ev.title_id} —{" "}
                      {new Date(ev.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {offlineOrderErrors.event_id && (
              <span className="text-xs text-destructive">{offlineOrderErrors.event_id}</span>
            )}
          </div>

          {/* Session Selection (Only for Exclusive Events) */}
          {offlineOrderData.event_id && events.find(e => e.id.toString() === offlineOrderData.event_id)?.type === 'Exclusive' && (
            <div>
              <label className="block text-sm font-medium mb-1">Sesi Event <span className="text-destructive">*</span></label>
              <Select
                value={offlineOrderData.event_session_id}
                onValueChange={(val: string) => setOfflineOrderData("event_session_id", val)}
                required
              >
                <SelectTrigger className="h-8 text-[13px]">
                  <SelectValue placeholder="Pilih Sesi Event..." />
                </SelectTrigger>
                <SelectContent>
                  {sessions
                    .filter((s) => s.event_id.toString() === offlineOrderData.event_id)
                    .map((session) => {
                      const available = session.ticket_allocation - (session.orders_sum_qty || 0);
                      const start = session.start_time ? session.start_time.slice(0, 5) : "";
                      const end = session.end_time ? session.end_time.slice(0, 5) : "";
                      return (
                        <SelectItem key={session.id} value={session.id.toString()} disabled={available <= 0}>
                          {session.name} ({start} - {end}) — {available > 0 ? `Sisa ${available} Tiket` : "Habis"}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              {offlineOrderErrors.event_session_id && (
                <span className="text-xs text-destructive">{offlineOrderErrors.event_session_id}</span>
              )}
            </div>
          )}

          {/* Info Pemesan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Pemesan</label>
              <Input
                className="h-8 text-[13px]"
                placeholder="Nama lengkap"
                value={offlineOrderData.name}
                onChange={(e) => setOfflineOrderData("name", e.target.value)}
                required
              />
              {offlineOrderErrors.name && (
                <span className="text-xs text-destructive">{offlineOrderErrors.name}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. Telepon</label>
              <Input
                className="h-8 text-[13px] font-mono"
                placeholder="Cth: 081234567890"
                value={offlineOrderData.phone}
                onChange={(e) => setOfflineOrderData("phone", e.target.value)}
                required
              />
              {offlineOrderErrors.phone && (
                <span className="text-xs text-destructive">{offlineOrderErrors.phone}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                className="h-8 text-[13px]"
                placeholder="email@example.com"
                value={offlineOrderData.email}
                onChange={(e) => setOfflineOrderData("email", e.target.value)}
              />
              {offlineOrderErrors.email && (
                <span className="text-xs text-destructive">{offlineOrderErrors.email}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Tiket</label>
              <Input
                type="text"
                className="h-8 text-[13px]"
                value={offlineOrderData.qty}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setOfflineOrderData("qty", "");
                  } else {
                    const parsed = parseInt(val.replace(/\D/g, ""));
                    if (!isNaN(parsed)) setOfflineOrderData("qty", parsed.toString());
                  }
                }}
                required
              />
              {offlineOrderErrors.qty && (
                <span className="text-xs text-destructive">{offlineOrderErrors.qty}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rekening Pembayaran (Pilih jika Transfer)</label>
            <Select
              value={offlineOrderData.pay_account_id || "cash"}
              onValueChange={(val: any) => setOfflineOrderData("pay_account_id", val === "cash" ? "" : val)}
            >
              <SelectTrigger className="h-8 text-[13px]">
                <SelectValue placeholder="Pilih Rekening (Atau Cash)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash / Tunai</SelectItem>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id.toString()}>
                    {acc.name_account} - {acc.no_account} - {acc.batch_member?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catatan</label>
            <Textarea
              rows={2}
              className="text-[13px] resize-none"
              placeholder="Catatan tambahan..."
              value={offlineOrderData.notes}
              onChange={(e) => setOfflineOrderData("notes", e.target.value)}
            />
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
              disabled={processingOfflineOrder}
            >
              {processingOfflineOrder ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
