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
import { useTranslation } from "@/i18n";

export function EventPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation("EventPage");

  const events = [
    {
      id: 1,
      type: t("card1.type"),
      date: t("card1.date"),
      title: t("card1.title"),
      location: t("card1.location"),
      price: t("card1.price"),
      excerpt: t("card1.summary"),
      img: g3,
      available: true,
    },
    {
      id: 2,
      type: t("card2.type"),
      date: t("card2.date"),
      title: t("card2.title"),
      location: t("card2.location"),
      price: t("card2.price"),
      excerpt: t("card2.summary"),
      img: g2,
      available: false,
    },
    {
      id: 3,
      type: t("card3.type"),
      date: t("card3.date"),
      title: t("card3.title"),
      location: t("card3.location"),
      price: t("card3.price"),
      excerpt: t("card3.summary"),
      img: g1,
      available: true,
    },
  ];

  const handleBuyTicket = (eventId: number) => {
    setSelectedEvent(eventId);
    setIsDialogOpen(true);
  };

  const activeEvent = events.find((e) => e.id === selectedEvent);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
      <Badge
        variant="outline"
        className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
      >
        <Sparkles className="h-3.5 w-3.5" /> {t("heading")}
      </Badge>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.15] md:text-6xl">
        {t("title_t1")} <span className="text-gradient-gold">{t("title_y1")}</span> {t("title_t2")}
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
                  event.type === t("card1.type") || event.type === t("card3.type")
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
              <CardDescription className="mt-3 flex-1 text-sm">{event.excerpt}</CardDescription>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="font-semibold text-primary">{event.price}</span>
                {event.available ? (
                  <Button
                    onClick={() => handleBuyTicket(event.id)}
                    className="rounded-full bg-gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
                  >
                    <Ticket className="h-4 w-4 mr-2" /> {t("buy")}
                  </Button>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("no_buy")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[80vw] max-w-[400px] sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle>{t("dialog.title")}: {activeEvent?.title}</DialogTitle>
            <DialogDescription>
              {t("dialog.desc")}
              <br />
              <br />
              <strong>{t("dialog.price")}:</strong> {activeEvent?.price} <br />
              <strong>{t("dialog.location")}:</strong> {activeEvent?.location} <br />
              <strong>{t("dialog.date")}:</strong> {activeEvent?.date}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="outline"
              className="mt-2 sm:mt-0"
            >
              {t("dialog.btn_close")}
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-gradient-gold text-primary-foreground"
            >
              {t("dialog.btn_confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
