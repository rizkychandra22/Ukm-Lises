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
import { Copy, Loader2, CheckCircle2, QrCode } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  PayAccount,
  getPaymentAccounts,
  generateOrderCode,
  submitOrder,
  trackOrder,
} from "@/lib/api/order";
import { getEvents, EventItem } from "@/lib/api/event";

export function EventPage() {
  const { t, i18n } = useTranslation("EventPage");
  const isEn = i18n.language === "en";

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [accounts, setAccounts] = useState<PayAccount[]>([]);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qty: 1 as number | string,
    notes: "",
    payment_method: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const data = await getEvents();
      setEvents(data);
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  const visibleEvents = useMemo(() => {
    return [...events]
      .filter((event) => ["published", "completed"].includes(event.status))
      .sort((a, b) => {
        const priority: Record<string, number> = {
          published: 0,
          completed: 1,
        };

        return (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
      });
  }, [events]);

  const filteredEvents = useMemo(() => {
    const baseEvents = visibleEvents;
    if (!searchQuery.trim()) return baseEvents;

    const q = searchQuery.trim().toLowerCase();
    return baseEvents.filter((event) => {
      const title = isEn ? event.title_en || event.title_id : event.title_id;
      const location = isEn ? event.location_en || event.location_id : event.location_id;
      const summary = isEn ? event.summary_en || event.summary_id || "" : event.summary_id || "";
      return [title, location, summary, event.type].join(" ").toLowerCase().includes(q);
    });
  }, [visibleEvents, searchQuery, isEn]);

  useEffect(() => {
    const checkOrder = async () => {
      const q = searchQuery.trim().toUpperCase();
      if (q.startsWith("EVT") && q.length > 5) {
        const order = await trackOrder(q);
        if (order) {
          setTrackedOrder(order);
        } else {
          setTrackedOrder(null);
        }
      } else {
        setTrackedOrder(null);
      }
    };

    const timeoutId = setTimeout(checkOrder, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleBuyTicket = async (event: EventItem) => {
    setSelectedEvent(event);
    setIsSuccess(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      qty: 1,
      notes: "",
      payment_method: "",
    });
    setPaymentProof(null);
    setIsDialogOpen(true);

    try {
      const [fetchedAccounts, code] = await Promise.all([
        getPaymentAccounts(),
        generateOrderCode(),
      ]);
      setAccounts(fetchedAccounts);
      setOrderCode(code);
    } catch (e) {
      console.error(e);
      toast.error(isEn ? "Failed to load order info." : "Gagal memuat info pesanan.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !orderCode) return;

    if (selectedEvent.price && selectedEvent.price > 0 && !paymentProof) {
      toast.error(isEn ? "Please upload payment proof." : "Harap unggah bukti pembayaran.");
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("order_code", orderCode);
    payload.append("event_id", selectedEvent.id.toString());
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("qty", formData.qty.toString());

    if (formData.notes) payload.append("notes", formData.notes);
    if (formData.payment_method) payload.append("payment_method", formData.payment_method);
    if (paymentProof) payload.append("payment_proof", paymentProof);

    const result = await submitOrder(payload);

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const copyOrderCode = () => {
    if (orderCode) {
      navigator.clipboard.writeText(orderCode);
      toast.success(isEn ? "Order Code copied!" : "Kode Order disalin!");
    }
  };

  const formatPrice = (price: number | null): string => {
    if (!price || price === 0) return isEn ? "Free" : "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isTicketAvailable = (event: EventItem): boolean => {
    if (event.status !== "published") return false;
    if (event.ticket === null) return true;
    return (event.remaining_tickets ?? 0) > 0;
  };

  const canBuyTicket = (event: EventItem): boolean => {
    if (!event.price || event.price === 0) return false;
    return isTicketAvailable(event);
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
              {t("title_t1")} <span className="text-gradient-gold">{t("title_y1")}</span>{" "}
              {t("title_t2")}
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
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  className="flex flex-col overflow-hidden rounded-3xl border-border/60"
                >
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
          ) : filteredEvents.length === 0 && !trackedOrder ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 md:py-20 px-3 text-center text-muted-foreground border-primary/50 border-2 border-dashed rounded-2xl">
              <Ticket className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">
                {events.length === 0 ? t("no_event") : t("search_empty")}
              </p>
            </div>
          ) : (
            <>
              {trackedOrder && (
                <Card
                  className="group flex flex-col overflow-hidden rounded-3xl border-border/60 bg-card transition-colors hover:border-primary/60 cursor-pointer col-span-full md:col-span-1 shadow-lg ring-2 ring-primary/50 relative"
                  onClick={() => setIsTicketModalOpen(true)}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-gold"></div>
                  <CardContent className="p-6 space-y-4 pt-8">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {isEn ? "Order Code" : "Kode Order"}
                      </p>
                      <p className="font-mono font-extrabold text-2xl text-primary mt-1">
                        {trackedOrder.order_code}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight line-clamp-2">
                        {trackedOrder.event?.title_id || "Unknown Event"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className={`rounded-md border-0 ${
                          trackedOrder.status === "success"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : trackedOrder.status === "pending"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {trackedOrder.status.toUpperCase()}
                      </Badge>
                      <span className="font-semibold text-sm">{trackedOrder.qty} Tiket</span>
                    </div>
                    <div className="pt-3 border-t border-dashed">
                      <p className="text-lg font-bold text-right text-foreground">
                        {formatPrice(trackedOrder.total_price)}
                      </p>
                    </div>
                    <div className="bg-primary/5 text-primary text-center py-2 rounded-lg mt-2 group-hover:bg-primary/10 transition-colors">
                      <p className="text-xs font-semibold uppercase">
                        {isEn ? "Click to view ticket" : "Ketuk untuk lihat e-tiket"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {filteredEvents.map((event) => {
                const title = isEn ? event.title_en || event.title_id : event.title_id;
                const location = isEn ? event.location_en || event.location_id : event.location_id;
                const summary = isEn
                  ? event.summary_en || event.summary_id || ""
                  : event.summary_id || "";
                const available = isTicketAvailable(event);
                const isExclusive = event.type === "Exclusive";
                const canShowBuyButton = canBuyTicket(event);
                const statusLabel = event.status === "published" ? "Published" : "Completed";

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
                      <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
                        <Badge
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isExclusive
                              ? "bg-gradient-gold text-primary-foreground shadow-gold"
                              : "bg-muted text-foreground border border-border hover:bg-muted"
                          }`}
                        >
                          {isExclusive
                            ? isEn
                              ? "Exclusive"
                              : "Eksklusif"
                            : isEn
                              ? "Non-Exclusive"
                              : "Non-Eksklusif"}
                        </Badge>

                        <Badge
                          className={
                            event.status === "published"
                              ? "bg-gradient-gold text-primary-foreground shadow-gold"
                              : "bg-destructive text-destructive-foreground border border-border hover:bg-destructive"
                          }
                        >
                          {statusLabel}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-primary/70" />
                          {new Date(event.date).toLocaleDateString(isEn ? "en-US" : "id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" /> {location}
                        </span>
                      </div>

                      <CardTitle className="mt-4 font-display text-xl font-bold leading-snug line-clamp-2">
                        {title}
                      </CardTitle>
                      <CardDescription className="mt-3 flex-1 text-sm line-clamp-3">
                        {summary || (isEn ? "No description available." : "Tidak ada deskripsi.")}
                      </CardDescription>

                      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                        <span className="font-semibold text-primary">
                          {formatPrice(event.price)}
                        </span>
                        {canShowBuyButton ? (
                          <Button
                            onClick={() => handleBuyTicket(event)}
                            className="rounded-full bg-gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
                          >
                            <Ticket className="h-4 w-4 mr-2" /> {t("buy")}
                          </Button>
                        ) : (
                          <span className="text-sm font-medium text-foreground">{t("no_buy")}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </section>

      <section>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <DialogHeader>
              <DialogTitle>
                {isEn ? "Ticket Order" : "Pesan Tiket"}:{" "}
                {isEn
                  ? selectedEvent?.title_en || selectedEvent?.title_id
                  : selectedEvent?.title_id}
              </DialogTitle>
              {!isSuccess && (
                <DialogDescription>
                  {isEn
                    ? "Please fill the form below to place your order."
                    : "Silakan isi form di bawah ini untuk memesan tiket."}
                </DialogDescription>
              )}
            </DialogHeader>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-xl">
                    {isEn ? "Order Submitted!" : "Pesanan Berhasil Dibuat!"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {isEn ? "Your order code is" : "Kode Pesanan Anda adalah"}{" "}
                    <span className="font-bold text-foreground">{orderCode}</span>.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {isEn
                      ? "Please keep this code to check your order status."
                      : "Simpan kode ini untuk memantau status pesanan Anda."}
                  </p>
                </div>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="mt-4 bg-gradient-gold text-primary-foreground"
                >
                  {isEn ? "Close" : "Tutup"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 py-2">
                {/* INFO PEMBAYARAN & KODE ORDER */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {isEn ? "Your Order Code" : "Kode Order Anda"}
                      </p>
                      <p className="font-mono font-bold text-lg tracking-wider text-primary">
                        {orderCode || "..."}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={copyOrderCode}
                      disabled={!orderCode}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {isEn ? "Copy" : "Salin"}
                    </Button>
                  </div>
                  {selectedEvent?.price && selectedEvent.price > 0 ? (
                    <p className="text-sm">
                      {isEn
                        ? "Please make the payment first using one of the accounts below, then upload the proof."
                        : "Silahkan lakukan pembayaran terlebih dahulu ke salah satu rekening di bawah ini, lalu unggah buktinya."}
                    </p>
                  ) : null}
                </div>

                {/* FIELDS */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      {isEn ? "Full Name" : "Nama Lengkap"} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isEn ? "Your full name" : "Nama lengkap anda"}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@mail.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">
                        WhatsApp <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="081234567890"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="qty">
                        {isEn ? "Ticket Qty" : "Jumlah Tiket"}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative flex items-center">
                        <Input
                          id="qty"
                          type="text"
                          min="1"
                          max={selectedEvent?.remaining_tickets ?? undefined}
                          required
                          value={formData.qty}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              setFormData({ ...formData, qty: "" });
                            } else {
                              const parsed = parseInt(val.replace(/\D/g, ""));
                              if (!isNaN(parsed)) {
                                setFormData({ ...formData, qty: parsed });
                              }
                            }
                          }}
                          className={selectedEvent?.remaining_tickets !== null ? "pr-30" : ""}
                        />
                        {selectedEvent?.remaining_tickets !== null && (
                          <span className="absolute right-3 text-xs text-muted-foreground">
                            {isEn ? "Left:" : "Sisa:"} {selectedEvent?.remaining_tickets}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>{isEn ? "Total Price" : "Total Harga"}</Label>
                      <div className="h-9 px-3 py-1 flex items-center border rounded-md bg-muted/30 font-semibold text-primary">
                        {formatPrice(
                          (selectedEvent?.price || 0) *
                            (typeof formData.qty === "number" ? formData.qty : 0),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* UPLOAD & PAYMENT (IF NOT FREE) */}
                  {selectedEvent?.price && selectedEvent.price > 0 ? (
                    <>
                      <div className="grid gap-2">
                        <Label>
                          {isEn ? "Payment Method" : "Metode Pembayaran"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          required
                          value={formData.payment_method}
                          onValueChange={(val) => setFormData({ ...formData, payment_method: val })}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isEn ? "Select transfer destination" : "Pilih tujuan transfer"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts.map((acc) => (
                              <SelectItem
                                key={acc.id}
                                value={`${acc.name_account} - ${acc.no_account} - ${acc.batch_member?.name || "Unknown"}`}
                              >
                                {acc.name_account} - {acc.no_account} -{" "}
                                {acc.batch_member?.name || "Unknown"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="proof">
                          {isEn ? "Payment Proof" : "Bukti Pembayaran"}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="proof"
                          type="file"
                          accept="image/*"
                          required
                          onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                        />
                      </div>
                    </>
                  ) : null}

                  <div className="grid gap-2">
                    <Label htmlFor="notes">
                      {isEn ? "Additional Notes" : "Catatan (Opsional)"}
                    </Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={isEn ? "Any special request?" : "Pesan atau catatan tambahan"}
                    />
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-border/50 flex flex-row justify-end gap-2 sm:gap-2">
                  <Button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    variant="outline"
                    className="mt-0 sm:mt-0"
                    disabled={isSubmitting}
                  >
                    {isEn ? "Cancel" : "Batal"}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-gold text-primary-foreground mt-0 sm:mt-0"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEn ? "Confirm Order" : "Pesan Tiket"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* DIALOG E-TICKET BOARDING PASS */}
        <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
          <DialogContent className="w-[90vw] max-w-[400px] max-h-[90vh] overflow-y-auto rounded-[32px] p-0 bg-card border-none shadow-2xl [&>button]:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {trackedOrder && (
              <div className="flex flex-col relative">
                {/* Header Ticket */}
                <div className="bg-gradient-gold p-8 text-primary-foreground relative overflow-hidden flex flex-col items-center justify-center text-center">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
                  <Ticket className="w-12 h-12 mb-3 opacity-90" />
                  <h2 className="text-3xl font-black mb-2 font-display tracking-widest">
                    {isEn ? "E-TICKET" : "E-TIKET"}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-white/25 hover:bg-white/30 border-none text-white shadow-none uppercase tracking-widest font-bold px-3 py-1"
                  >
                    {trackedOrder.status}
                  </Badge>
                </div>

                {/* Body Ticket */}
                <div className="px-8 py-8 bg-card relative">
                  {/* Dashed Cut Line */}
                  <div className="absolute top-0 left-0 w-full h-px border-t-[3px] border-dashed border-border/80 -translate-y-1/2"></div>
                  {/* Circle Cutouts */}
                  <div className="absolute top-0 left-0 w-8 h-8 bg-background/90 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-inner"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-background/90 rounded-full translate-x-1/2 -translate-y-1/2 shadow-inner"></div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        {isEn ? "Event" : "Acara"}
                      </p>
                      <p className="font-bold text-lg leading-tight">
                        {trackedOrder.event?.title_id || "Unknown Event"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          {isEn ? "Name" : "Nama"}
                        </p>
                        <p className="font-semibold text-sm truncate">{trackedOrder.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          {isEn ? "Ticket Qty" : "Jml Tiket"}
                        </p>
                        <p className="font-semibold text-sm">{trackedOrder.qty} Pcs</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          {isEn ? "Location" : "Lokasi"}
                        </p>
                        <p className="font-semibold text-sm truncate">
                          {trackedOrder.event?.location_id || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          {isEn ? "Date" : "Tanggal"}
                        </p>
                        <p className="font-semibold text-sm">
                          {trackedOrder.event?.date
                            ? new Date(trackedOrder.event.date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Barcode */}
                  <div className="mt-6 pt-5 border-t border-dashed flex flex-col items-center justify-center">
                    <QrCode className="w-32 h-32 text-primary mb-2" />
                    <p className="font-mono text-lg tracking-[0.2em] font-extrabold text-center text-primary">
                      {trackedOrder.order_code}
                    </p>
                  </div>
                </div>

                {/* Close Button overlay */}
                <button
                  onClick={() => setIsTicketModalOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>

      <ScrollTop />
    </>
  );
}
