import { useMemo } from "react";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "../../../../Components/DataTable";
import { PayOrder } from "../Types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, CheckCircle, Trash2, ArrowUpDown, Plus } from "lucide-react";

interface OrderTableProps {
  orders: PayOrder[];
  statusFilter: string;
  methodFilter: string;
  onStatusFilterChange: (status: string) => void;
  onMethodFilterChange: (method: string) => void;
  onView: (order: PayOrder) => void;
  onEditStatus: (order: PayOrder) => void;
  onDelete: (id: number) => void;
  onAddOffline?: () => void;
  hasRole: (roles: string | string[]) => boolean;
  formatIDR: (amount?: number | null) => string;
}

export function OrderTable({
  orders,
  statusFilter,
  methodFilter,
  onStatusFilterChange,
  onMethodFilterChange,
  onView,
  onEditStatus,
  onDelete,
  onAddOffline,
  hasRole,
  formatIDR,
}: OrderTableProps) {
  const filteredData = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (methodFilter !== "all" && o.order_method !== methodFilter) return false;
      return true;
    });
  }, [orders, statusFilter, methodFilter]);

  const columns = useMemo<ColumnDef<PayOrder, any>[]>(
    () => [
      {
        accessorKey: "order_code",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kode Order <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: PayOrder } }) => (
          <span className="font-mono font-semibold text-sm text-foreground">
            {row.original.order_code}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pemesan <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: PayOrder } }) => (
          <span className="font-medium text-sm text-foreground">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "event.title_id",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: PayOrder } }) => (
          <div className="w-30 sm:w-45">
            <span className="text-sm font-medium text-foreground line-clamp-2">{row.original.event?.title_id || "-"}</span>
          </div>
        ),
      },
      {
        id: "event_session",
        header: "Sesi",
        cell: ({ row }: { row: { original: PayOrder } }) => {
          const session = row.original.event_session;
          if (!session) return <span className="text-sm text-muted-foreground">-</span>;
          const start = session.start_time ? session.start_time.slice(0, 5) : "";
          const end = session.end_time ? session.end_time.slice(0, 5) : "";
          return (
            <div className="flex flex-col gap-0.5 text-sm w-20 sm:w-18">
              <span className="font-medium text-foreground whitespace-nowrap">{session.name}</span>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {start} - {end}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "qty",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Qty <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: PayOrder } }) => (
          <span className="text-sm font-medium">{row.original.qty} Tiket</span>
        ),
      },
      {
        accessorKey: "total_price",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Harga <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: PayOrder } }) => (
          <span className="font-medium text-sm">{formatIDR(row.original.total_price)}</span>
        ),
      },
      {
        accessorKey: "order_method",
        header: "Pembelian",
        cell: ({ row }: { row: { original: PayOrder } }) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${
              row.original.order_method === "online"
                ? "bg-blue-500/10 text-blue-700"
                : "bg-purple-500/10 text-purple-700"
            }`}
          >
            {row.original.order_method}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: PayOrder } }) => {
          const status = row.original.status;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                status === "success"
                  ? "bg-emerald-500/10 text-emerald-700"
                  : status === "pending"
                    ? "bg-amber-500/10 text-amber-700"
                    : "bg-rose-500/10 text-rose-700"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }: { row: { original: PayOrder } }) => {
          const ord = row.original;
          return (
            <div className="flex justify-end gap-2 items-center">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 w-8 p-0"
                size="sm"
                onClick={() => onView(ord)}
                title="Lihat Bukti Bayar & Detail"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {hasRole(["Developer", "Admin"]) && (
                <>
                  {ord.order_method !== "offline" && (
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                      size="sm"
                      onClick={() => onEditStatus(ord)}
                      title="Ubah Status Tiket"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-lg h-8 w-8 p-0"
                    onClick={() => onDelete(ord.id)}
                    title="Hapus Order"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const toolbarExtra = (
    <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
      <div className="w-full sm:w-auto flex flex-row gap-2">
        <Select value={methodFilter} onValueChange={onMethodFilterChange}>
          <SelectTrigger className="flex-1 sm:w-[150px] h-8 text-[13px]">
            <SelectValue placeholder="Tipe Pembelian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Pembelian</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="flex-1 sm:w-[150px] h-8 text-[13px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasRole(["Developer", "Admin"]) && onAddOffline && (
        <Button
          size="sm"
          className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
          onClick={onAddOffline}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Pesan Tiket
        </Button>
      )}
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      searchPlaceholder="Cari kode order atau pemesan..."
      toolbarExtra={toolbarExtra}
    />
  );
}
