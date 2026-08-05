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
import { EventItem } from "../Types";

interface FormModalProps {
  isOpen: boolean;
  editingEvent: EventItem | null;
  eventData: {
    title_id: string;
    title_en?: string;
    image: File | null;
    summary_id?: string;
    summary_en?: string;
    type: "Exclusive" | "Non-Exclusive";
    date: string;
    location_id: string;
    location_en?: string;
    price: string;
    ticket: string;
    status: "draft" | "published" | "cancelled" | "completed";
  };
  eventDateInput: string;
  eventTimeInput: string;
  eventErrors: Record<string, string>;
  processingEvent: boolean;
  setEventData: (key: string, value: any) => void;
  setEventDateInput: (value: string) => void;
  setEventTimeInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function FormModal({
  isOpen,
  editingEvent,
  eventData,
  eventDateInput,
  eventTimeInput,
  eventErrors,
  processingEvent,
  setEventData,
  setEventDateInput,
  setEventTimeInput,
  onSubmit,
  onCancel,
}: FormModalProps) {
  const isExclusiveEvent = eventData.type === "Exclusive";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90%] max-w-[550px] rounded-md">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Edit Data Event" : "Tambah Event Baru"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto no-scrollbar px-1"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Judul Event</label>
            <Input
              className="h-8 text-[13px]"
              placeholder="Contoh: Pagelaran Seni Budaya 2026"
              value={eventData.title_id}
              onChange={(e) => setEventData("title_id", e.target.value)}
              required
            />
            {eventErrors.title_id && (
              <span className="text-xs text-red-500">{eventErrors.title_id}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lokasi Event</label>
            <Input
              className="h-8 text-[13px]"
              placeholder="Contoh: Gedung Aula Utama UKM"
              value={eventData.location_id}
              onChange={(e) => setEventData("location_id", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Pelaksanaan</label>
              <div className="relative">
                <Input
                  type="date"
                  className="h-8 text-[13px] pr-10"
                  value={eventDateInput}
                  onChange={(e) => setEventDateInput(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jam Pelaksanaan</label>
              <div className="relative">
                <Input
                  type="time"
                  className="h-8 text-[13px] pr-10"
                  value={eventTimeInput}
                  onChange={(e) => setEventTimeInput(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipe Event</label>
              <Select
                value={eventData.type}
                onValueChange={(val: any) => {
                  setEventData("type", val);
                  if (val === "Non-Exclusive") {
                    setEventData("price", "");
                    setEventData("ticket", "");
                  }
                }}
              >
                <SelectTrigger className="h-8 text-[13px]">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-Exclusive">Non-Exclusive</SelectItem>
                  <SelectItem value="Exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status Publikasi</label>
              <Select
                value={eventData.status}
                onValueChange={(val: any) => setEventData("status", val)}
              >
                <SelectTrigger className="h-8 text-[13px]">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isExclusiveEvent && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Harga Tiket</label>
                <Input
                  type="number"
                  min="0"
                  className="h-8 text-[13px]"
                  placeholder="Cth: 50000"
                  value={eventData.price}
                  onChange={(e) => setEventData("price", e.target.value)}
                  required={isExclusiveEvent}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kuota Tiket</label>
                <Input
                  type="number"
                  min="0"
                  className="h-8 text-[13px]"
                  placeholder="Cth: 100"
                  value={eventData.ticket}
                  onChange={(e) => setEventData("ticket", e.target.value)}
                  required={isExclusiveEvent}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Ringkasan / Deskripsi Event
            </label>
            <Textarea
              rows={3}
              className="text-[13px]"
              placeholder="Jelaskan secara singkat mengenai acara ini..."
              value={eventData.summary_id}
              onChange={(e) => setEventData("summary_id", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gambar Banner Event</label>
            <Input
              type="file"
              accept="image/*"
              className="bg-background text-sm file:text-foreground file:bg-muted file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2"
              onChange={(e) => setEventData("image", e.target.files ? e.target.files[0] : null)}
            />
            {eventErrors.image && (
              <span className="text-xs text-red-500">{eventErrors.image}</span>
            )}
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
              disabled={processingEvent}
            >
              {processingEvent ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> {editingEvent ? "Simpan Perubahan" : "Simpan"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { FormModal as EventFormModal };
