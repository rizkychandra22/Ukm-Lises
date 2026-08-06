import { useMemo } from "react";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "./DataTable";
import { EventItem } from "../Types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash2, ArrowUpDown, Plus } from "lucide-react";

interface EventTableProps {
  events: EventItem[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onView: (event: EventItem) => void;
  onEdit: (event: EventItem) => void;
  onDelete: (id: number) => void;
  onAdd?: () => void;
  hasRole: (roles: string | string[]) => boolean;
  formatIDR: (amount?: number | null) => string;
}

export function EventTable({
  events,
  statusFilter,
  onStatusFilterChange,
  onView,
  onEdit,
  onDelete,
  onAdd,
  hasRole,
  formatIDR,
}: EventTableProps) {
  // Filter events by status if not "all"
  const filteredData = useMemo(() => {
    if (statusFilter === "all") return events;
    return events.filter((e) => e.status === statusFilter);
  }, [events, statusFilter]);

  const columns = useMemo<ColumnDef<EventItem, any>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Banner",
        cell: ({ row }: { row: { original: EventItem } }) => {
          const imgUrl = row.original.image;
          return (
            <img
              src={imgUrl ? imgUrl : "/placeholder-event.webp"}
              alt={row.original.title_id}
              className="h-10 w-16 shrink-0 rounded object-cover border"
            />
          );
        },
      },
      {
        accessorKey: "title_id",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Judul <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: EventItem } }) => (
          <span className="text-sm font-medium text-foreground">{row.original.title_id}</span>
        ),
      },
      {
        accessorKey: "type",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tipe <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: EventItem } }) => (
          <span
            className={
              row.original.type === "Exclusive"
                ? "inline-flex items-center px-2.5 py-1 rounded-[8px] text-[10px] font-semibold bg-violet-500/10 text-violet-700"
                : "inline-flex items-center px-2.5 py-1 rounded-[8px] text-[10px] font-semibold bg-sky-500/10 text-sky-700"
            }
          >
            {row.original.type}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tanggal & Waktu <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: EventItem } }) => (
          <span className="text-sm">
            {new Date(row.original.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Harga <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: EventItem } }) => (
          <span className="text-sm font-medium">{formatIDR(row.original.price)}</span>
        ),
      },
      {
        id: "ticket",
        header: "Tiket",
        cell: ({ row }: { row: { original: EventItem } }) => (
          <span className="text-sm font-medium">
            {row.original.ticket
              ? `${row.original.remaining_tickets ?? row.original.ticket} / ${row.original.ticket}`
              : "Unlimited"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: EventItem } }) => {
          const status = row.original.status;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                status === "completed"
                  ? "bg-emerald-500/10 text-emerald-700"
                  : status === "published"
                    ? "bg-sky-500/10 text-sky-700"
                    : status === "draft"
                      ? "bg-amber-500/10 text-amber-700"
                      : "bg-rose-500/10 text-rose-700"
              }`}
            >
              {status === "completed"
                ? "Completed"
                : status === "published"
                  ? "Published"
                  : status === "draft"
                    ? "Draft"
                    : "Cancelled"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }: { row: { original: EventItem } }) => {
          const event = row.original;
          return (
            <div className="flex justify-end gap-2 items-center">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 w-8 p-0"
                size="sm"
                onClick={() => onView(event)}
                title="Lihat Detail"
              >
                <Eye className="h-4 w-4" />
              </Button>

              {hasRole(["Developer", "Admin"]) && (
                <>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                    size="sm"
                    onClick={() => onEdit(event)}
                    title="Edit Event"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-lg h-8 w-8 p-0"
                    onClick={() => onDelete(event.id)}
                    title="Hapus Event"
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
    [onView, onEdit, onDelete, hasRole, formatIDR],
  );

  const toolbarExtra = (
    <>
      <div className="flex-1 sm:flex-none">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-8 text-[13px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasRole(["Developer", "Admin"]) && onAdd && (
        <Button
          size="sm"
          className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm flex-1 sm:flex-none sm:w-auto"
          onClick={onAdd}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Tambah Event
        </Button>
      )}
    </>
  );

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      searchPlaceholder="Cari judul event atau lokasi..."
      toolbarExtra={toolbarExtra}
    />
  );
}
