import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EventItem } from "../Types";

interface EventDetailSheetProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  formatIDR: (amount?: number | null) => string;
}

export function EventDetailSheet({
  isOpen,
  event,
  onClose,
  formatIDR,
}: EventDetailSheetProps) {
  if (!event) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[90%] sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Detail Event</SheetTitle>
          <SheetDescription>Informasi lengkap seputar acara yang dipilih.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <img
            src={event.image ? event.image : "/placeholder-event.webp"}
            alt={event.title_id}
            className="w-full h-44 rounded-lg object-cover border"
          />
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Judul Event</h4>
            <p className="text-base font-semibold">{event.title_id}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Tanggal & Waktu</h4>
              <p className="text-sm font-medium">
                {new Date(event.date).toLocaleString("id-ID")}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Harga Tiket</h4>
              <p className="text-sm font-semibold text-emerald-600">
                {formatIDR(event.price)}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Lokasi</h4>
            <p className="text-sm font-medium">{event.location_id}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Ringkasan</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {event.summary_id || "-"}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
