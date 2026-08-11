import { useMemo } from "react";
import { DataTable } from "@admin/Components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { EventSession } from "../Types";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionTableProps {
  sessions: EventSession[];
  activeSessionTab: string;
  setActiveSessionTab: (val: string) => void;
  onAdd: () => void;
  onEdit: (session: EventSession) => void;
  onDelete: (id: number) => void;
}

export function SessionTable({
  sessions,
  activeSessionTab,
  setActiveSessionTab,
  onAdd,
  onEdit,
  onDelete,
}: SessionTableProps) {

  const columns = useMemo<ColumnDef<EventSession>[]>(
    () => [
      {
        accessorKey: "event",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.event?.title_id || "-"}
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
            Sesi <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.name}</span>,
      },
      {
        id: "time",
        accessorFn: (row) => row.start_time,
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Waktu <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.start_time.slice(0, 5)} - {row.original.end_time.slice(0, 5)}
          </span>
        ),
      },
      {
        accessorKey: "ticket_allocation",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Alokasi Tiket <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const allocation = row.original.ticket_allocation ?? 0;
          const remaining = row.original.remaining_tickets ?? allocation;
          const sold = allocation - remaining;
          return (
            <span className="text-muted-foreground">{sold} / {allocation} tiket</span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }) => {
          const session = row.original;
          return (
            <div className="flex justify-end gap-2 items-center">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                size="sm"
                onClick={() => onEdit(session)}
                title="Edit Sesi"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-lg h-8 w-8 p-0"
                onClick={() => onDelete(session.id)}
                title="Hapus Sesi"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const toolbarExtra = (
    <>
      <div className="flex-1 sm:flex-none">
        <Select value={activeSessionTab} onValueChange={setActiveSessionTab}>
          <SelectTrigger className="w-full sm:w-[180px] h-8 text-[13px]">
            <SelectValue placeholder="Pilih Tipe Tabel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="session">Table Type Session</SelectItem>
            <SelectItem value="payment">Table Type Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        size="sm"
        className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm flex-1 sm:flex-none sm:w-auto"
        onClick={onAdd}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Tambah Sesi
      </Button>
    </>
  );

  return (
    <DataTable
      columns={columns}
      data={sessions}
      searchPlaceholder="Cari sesi atau event..."
      toolbarExtra={toolbarExtra}
    />
  );
}
