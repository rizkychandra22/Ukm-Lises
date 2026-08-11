import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PayOrder } from "../Types";

interface OrderDetailSheetProps {
  isOpen: boolean;
  order: PayOrder | null;
  onClose: () => void;
  formatIDR: (amount?: number | null) => string;
}

export function OrderDetailSheet({
  isOpen,
  order,
  onClose,
  formatIDR,
}: OrderDetailSheetProps) {
  if (!order) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[90%] sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Detail Pesanan Tiket</SheetTitle>
          <SheetDescription>Verifikasi rincian transaksi & bukti transfer.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted/40 rounded-lg space-y-1">
            <span className="text-xs text-muted-foreground">Kode Pesanan</span>
            <p className="text-lg font-mono font-bold text-primary">{order.order_code}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs text-muted-foreground">Email</h4>
              <p className="text-sm font-medium">{order.email || "-"}</p>
            </div>
            <div>
              <h4 className="text-xs text-muted-foreground">No. WhatsApp</h4>
              <p className="text-sm font-medium">{order.phone || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-xs text-muted-foreground">Nama Pemesan</h4>
              <p className="text-sm font-medium">{order.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-xs text-muted-foreground">Event / Acara</h4>
              <p className="text-sm font-medium">
                {order.event?.title_id}
                {order.event_session && (
                  <span className="block text-[11px] text-foreground mt-0.5">
                    {order.event_session.name_id} ({(order.event_session.start_time || "").slice(0, 5)} - {(order.event_session.end_time || "").slice(0, 5)})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs text-muted-foreground">Jumlah Tiket</h4>
              <p className="text-sm font-medium">{order.qty} Tiket</p>
            </div>
            <div>
              <h4 className="text-xs text-muted-foreground">Total Transfer</h4>
              <p className="text-sm font-semibold text-emerald-600">
                {formatIDR(order.total_price)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-xs text-muted-foreground">Pembayaran Melalui</h4>
              <p className="text-sm font-medium capitalize">
                {order.pay_account
                  ? `${order.pay_account.name_account} - ${order.pay_account.no_account} - ${order.pay_account?.batch_member?.name}`
                  : "Cash / Tunai"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <h4 className="text-xs text-muted-foreground">Bukti Pembayaran / Transfer</h4>
            {order.payment_proof ? (
              <a
                href={order.payment_proof}
                target="_blank"
                rel="noreferrer"
                className="block border rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              >
                <img
                  src={order.payment_proof}
                  alt="Bukti Transfer"
                  className="w-full max-h-72 object-contain bg-black/5"
                />
                <span className="block text-center text-[11px] py-1 bg-muted text-muted-foreground">
                  Klik untuk membuka gambar penuh
                </span>
              </a>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {order.order_method === "offline"
                  ? `Offline Order Via ${order?.pay_account?.batch_member?.name}`
                  : "Tidak ada bukti pembayaran diunggah."}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
