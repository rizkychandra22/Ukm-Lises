import { useMemo } from "react";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "../../../../Components/DataTable";
import { Batch } from "../Types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUpDown, Plus } from "lucide-react";

interface BatchTableProps {
  batches: Batch[];
  onEdit: (batch: Batch) => void;
  onDelete: (id: number) => void;
  onAdd?: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

export function BatchTable({ batches, onEdit, onDelete, onAdd, hasRole }: BatchTableProps) {
  const columns = useMemo<ColumnDef<Batch, any>[]>(
    () => [
      {
        accessorKey: "year",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tahun <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: Batch } }) => (
          <span className="font-semibold text-sm text-foreground">{row.original.year}</span>
        ),
      },
      {
        accessorKey: "name_id",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Angkatan <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: Batch } }) => (
          <span className="font-medium text-sm text-foreground">{row.original.name_id}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: Batch } }) => {
          const b = row.original;
          return (
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                b.status === "Deactive"
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              }`}
            >
              {b.status === "Deactive" ? "Deactive" : "Active"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }: { row: { original: Batch } }) => {
          const batch = row.original;
          return (
            <div className="flex justify-end gap-2 items-center">
              {hasRole(["Developer", "Admin"]) && (
                <>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                    size="sm"
                    onClick={() => onEdit(batch)}
                    title="Edit Angkatan"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-lg h-8 w-8 p-0"
                    onClick={() => onDelete(batch.id)}
                    title="Hapus Angkatan"
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

  const toolbarExtra =
    hasRole(["Developer", "Admin"]) && onAdd ? (
      <Button
        size="sm"
        className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
        onClick={onAdd}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Tambah Angkatan
      </Button>
    ) : null;

  return (
    <DataTable
      columns={columns}
      data={batches}
      searchPlaceholder="Cari angkatan..."
      toolbarExtra={toolbarExtra}
    />
  );
}
