import { CalendarDays, MapPin, Sparkles, Ticket } from "lucide-react";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    type: "Eksklusif",
    date: "15 Agu 2026",
    title: "Konser Amal: Nada Asmarandana",
    location: "Gedung Kesenian Sukabumi",
    price: "Rp 50.000",
    excerpt:
      "Pertunjukan musik dan tari amal untuk penggalangan dana kemanusiaan, menampilkan kolaborasi spesial.",
    img: g3,
    available: true,
  },
  {
    id: 2,
    type: "Non-Eksklusif",
    date: "22 Sep 2026",
    title: "Pentas Budaya UMMI",
    location: "Lapangan Utama Kampus UMMI",
    price: "Gratis",
    excerpt:
      "Pentas seni terbuka bagi seluruh mahasiswa dan umum untuk merayakan bulan budaya kampus.",
    img: g2,
    available: false,
  },
  {
    id: 3,
    type: "Eksklusif",
    date: "10 Okt 2026",
    title: "Malam Gala: Harmoni Tatar Sunda",
    location: "Ballroom Hotel Santika Sukabumi",
    price: "Rp 100.000",
    excerpt:
      "Pertunjukan spektakuler dengan tata cahaya memukau dan penampilan maestro tamu.",
    img: g1,
    available: true,
  },
];

export function EventPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBuyTicket = (eventId: number) => {
    setSelectedEvent(eventId);
    setIsDialogOpen(true);
  };

  const activeEvent = events.find((e) => e.id === selectedEvent);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-20">
      <Badge variant="outline" className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" /> Event
      </Badge>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold md:text-6xl">
        Hadirilah <span className="text-gradient-gold">pertunjukan</span> kami.
      </h1>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            className="group flex flex-col overflow-hidden rounded-3xl border-border/60 bg-card transition-colors hover:border-primary/60"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={event.img}
                alt={event.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <Badge
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                  event.type === "Eksklusif"
                    ? "bg-gradient-gold text-primary-foreground shadow-gold"
                    : "bg-muted text-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                {event.type}
              </Badge>
            </div>
            <CardContent className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> {event.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {event.location}
                </span>
              </div>
              <CardTitle className="mt-4 font-display text-xl font-bold leading-snug">
                {event.title}
              </CardTitle>
              <CardDescription className="mt-3 flex-1 text-sm">
                {event.excerpt}
              </CardDescription>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="font-semibold text-primary">
                  {event.price}
                </span>
                {event.available ? (
                  <Button
                    onClick={() => handleBuyTicket(event.id)}
                    className="rounded-full bg-gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
                  >
                    <Ticket className="h-4 w-4 mr-2" /> Beli Tiket
                  </Button>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    Tiket Habis / Bebas
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Beli Tiket: {activeEvent?.title}</DialogTitle>
            <DialogDescription>
              Fitur pembayaran untuk event ini sedang dalam tahap pengembangan.
              <br />
              <br />
              <strong>Harga:</strong> {activeEvent?.price} <br />
              <strong>Lokasi:</strong> {activeEvent?.location} <br />
              <strong>Tanggal:</strong> {activeEvent?.date}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Tutup
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} className="bg-gradient-gold text-primary-foreground">
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
