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
import { Loader2, Save } from "lucide-react";
import { EventSession, EventItem } from "../Types";

interface SessionFormModalProps {
  isOpen: boolean;
  editingSession: EventSession | null;
  sessionData: {
    event_id: string;
    name: string;
    start_time: string;
    end_time: string;
    ticket_allocation: string;
  };
  events: EventItem[];
  processingSession: boolean;
  setSessionData: (key: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function SessionFormModal({
  isOpen,
  editingSession,
  sessionData,
  events,
  processingSession,
  setSessionData,
  onSubmit,
  onCancel,
}: SessionFormModalProps) {
  // Only show exclusive events for sessions, and only those that are not completed or cancelled.
  const exclusiveEvents = events.filter(
    (e) => e.type === "Exclusive" && (e.status === "draft" || e.status === "published")
  );

  // Calculate remaining tickets for selected event
  const selectedEvent = exclusiveEvents.find((e) => e.id.toString() === sessionData.event_id);
  const eventTicketMax = selectedEvent ? selectedEvent.ticket || 0 : 0;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="w-[90%] max-w-[420px] rounded-md">
        <DialogHeader>
          <DialogTitle>{editingSession ? "Edit Sesi Event" : "Tambah Sesi Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Event</label>
            <Select
              value={sessionData.event_id}
              onValueChange={(val) => setSessionData("event_id", val)}
            >
              <SelectTrigger className="h-8 text-[13px]">
                <SelectValue placeholder="Pilih Event" />
              </SelectTrigger>
              <SelectContent>
                {exclusiveEvents.map((evt) => (
                  <SelectItem key={evt.id} value={evt.id.toString()}>
                    {evt.title_id} ({evt.status.charAt(0).toUpperCase() + evt.status.slice(1)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sesi Event</label>
            <Input
              type="text"
              className="h-8 text-[13px]"
              value={sessionData.name}
              onChange={(e) => setSessionData("name", e.target.value)}
              placeholder="Contoh: Sesi 1 / Sesi Pagi"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Jam Mulai</label>
              <Input
                type="time"
                className="h-8 text-[13px]"
                value={sessionData.start_time}
                onChange={(e) => setSessionData("start_time", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jam Selesai</label>
              <Input
                type="time"
                className="h-8 text-[13px]"
                value={sessionData.end_time}
                onChange={(e) => setSessionData("end_time", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tiket Sesi</label>
              <Input
              type="number"
              min="1"
              className="h-8 text-[13px]"
              value={sessionData.ticket_allocation}
              onChange={(e) => setSessionData("ticket_allocation", e.target.value)}
              placeholder="Contoh : 100"
              required
            />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Tiket</label>
              <Input
                type="text"
                className="h-8 text-[13px]"
                value={selectedEvent ? eventTicketMax + " Tiket Tersedia" : "Silahkan Pilih Event"}  
                required readOnly
              />
            </div>
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
              disabled={processingSession}
            >
              {processingSession ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> {editingSession ? "Simpan Perubahan" : "Simpan"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
