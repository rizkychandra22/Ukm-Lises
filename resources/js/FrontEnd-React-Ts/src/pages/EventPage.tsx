import { CalendarDays, MapPin, Search, Sparkles, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";
import { ScrollTop } from "@/components/scroll-top";
import { getEvents, EventItem } from "@/lib/api/event";

export function EventPage() {
  const { t, i18n } = useTranslation("EventPage");
  const isEn = i18n.language === 'en';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const data = await getEvents();
      setEvents(data);
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.trim().toLowerCase();
    return events.filter((event) => {
      const title = isEn ? (event.title_en || event.title_id) : event.title_id;
      const location = isEn ? (event.location_en || event.location_id) : event.location_id;
      const summary = isEn ? (event.summary_en || event.summary_id || '') : (event.summary_id || '');
      return [title, location, summary, event.type].join(' ').toLowerCase().includes(q);
    });
  }, [events, searchQuery, isEn]);

  const handleBuyTicket = (event: EventItem) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number | null): string => {
    if (!price || price === 0) return isEn ? 'Free' : 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isTicketAvailable = (event: EventItem): boolean => {
    if (event.status !== 'published') return false;
    // If ticket is null = unlimited
    if (event.ticket === null) return true;
    // Check remaining tickets
    return (event.remaining_tickets ?? 0) > 0;
  };

  return (
    <>
      <SEOHead pageKey="events" />
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge
              variant="outline"
              className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" /> {t("heading")}
            </Badge>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.15] md:text-4xl">
              {t("title_t1")} <span className="text-gradient-gold">{t("title_y1")}</span> {t("title_t2")}
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              placeholder={t("search_placeholder")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {/* LOADING STATE */}
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden rounded-3xl border-border/60">
                <Skeleton className="aspect-[4/3] w-full" />
                <CardContent className="flex flex-1 flex-col p-6 space-y-3">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/60">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredEvents.length === 0 ? (
            /* EMPTY STATE */
            <div className="col-span-full flex flex-col items-center justify-center py-20 md:py-20 px-3 text-center text-muted-foreground border-primary/50 border-2 border-dashed rounded-2xl">
              <Ticket className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">
                {events.length === 0 ? t("no_event") : t("search_empty")}
              </p>
            </div>
          ) : (
            /* EVENT CARDS */
            filteredEvents.map((event) => {
              const title = isEn ? (event.title_en || event.title_id) : event.title_id;
              const location = isEn ? (event.location_en || event.location_id) : event.location_id;
              const summary = isEn ? (event.summary_en || event.summary_id || '') : (event.summary_id || '');
              const available = isTicketAvailable(event);
              const isExclusive = event.type === 'Exclusive';

              return (
                <Card
                  key={event.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border-border/60 bg-card transition-colors hover:border-primary/60"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted/60 flex items-center justify-center">
                        <Ticket className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <Badge
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                        isExclusive
                          ? "bg-gradient-gold text-primary-foreground shadow-gold"
                          : "bg-muted text-muted-foreground border border-border hover:bg-muted"
                      }`}
                    >
                      {isExclusive ? (isEn ? 'Exclusive' : 'Eksklusif') : (isEn ? 'Non-Exclusive' : 'Non-Eksklusif')}
                    </Badge>
                  </div>

                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(event.date).toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 shrink-0" /> {location}
                      </span>
                    </div>

                    <CardTitle className="mt-4 font-display text-xl font-bold leading-snug line-clamp-2">
                      {title}
                    </CardTitle>
                    <CardDescription className="mt-3 flex-1 text-sm line-clamp-3">
                      {summary || (isEn ? 'No description available.' : 'Tidak ada deskripsi.')}
                    </CardDescription>

                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                      <span className="font-semibold text-primary">{formatPrice(event.price)}</span>
                      {available ? (
                        <Button
                          onClick={() => handleBuyTicket(event)}
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
              );
            })
          )}
        </div>

        {/* DIALOG BELI TIKET */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[90vw] max-w-[400px] sm:max-w-[425px] rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {t("dialog.title")}: {isEn ? (selectedEvent?.title_en || selectedEvent?.title_id) : selectedEvent?.title_id}
              </DialogTitle>
              <DialogDescription>
                {t("dialog.desc")}
                <br /><br />
                <strong>{t("dialog.price")}:</strong> {formatPrice(selectedEvent?.price ?? null)} <br />
                <strong>{t("dialog.location")}:</strong> {isEn ? (selectedEvent?.location_en || selectedEvent?.location_id) : selectedEvent?.location_id} <br />
                <strong>{t("dialog.date")}:</strong> {selectedEvent ? new Date(selectedEvent.date).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
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

      <ScrollTop />
    </>
  );
}
