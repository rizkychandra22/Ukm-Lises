import { useMemo } from "react";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "./DataTable";
import { PayAccount } from "../Types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUpDown, Plus } from "lucide-react";

interface AccountTableProps {
  accounts: PayAccount[];
  onEdit: (account: PayAccount) => void;
  onDelete: (id: number) => void;
  onAdd?: () => void;
  hasRole: (roles: string | string[]) => boolean;
}

export function AccountTable({
  accounts,
  onEdit,
  onDelete,
  onAdd,
  hasRole,
}: AccountTableProps) {
  const columns = useMemo<ColumnDef<PayAccount, any>[]>(
    () => [
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
        cell: ({ row }: { row: { original: PayAccount } }) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${
              row.original.type === "bank"
                ? "bg-blue-500/10 text-blue-700"
                : "bg-emerald-500/10 text-emerald-700"
            }`}
          >
            {row.original.type}
          </span>
        ),
      },
      {
        accessorKey: "name_account",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Bank <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: PayAccount } }) => (
          <span className="font-semibold text-sm text-foreground">{row.original.name_account}</span>
        ),
      },
      {
        accessorKey: "no_account",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nomor Rekening <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: PayAccount } }) => (
          <span className="text-sm font-medium">{row.original.no_account}</span>
        ),
      },
      {
        accessorKey: "batch_member.name",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Pemilik <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: PayAccount } }) => (
          <span className="text-sm">{row.original.batch_member?.name || "-"}</span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }: { row: { original: PayAccount } }) => {
          const acc = row.original;
          return (
            <div className="flex justify-end gap-2 items-center">
              {hasRole(["Developer", "Admin"]) && (
                <>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                    size="sm"
                    onClick={() => onEdit(acc)}
                    title="Edit Rekening"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-lg h-8 w-8 p-0"
                    onClick={() => onDelete(acc.id)}
                    title="Hapus Rekening"
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
    [onEdit, onDelete, hasRole],
  );

  const toolbarExtra = hasRole(["Developer", "Admin"]) && onAdd ? (
    <Button
      size="sm"
      className="h-8 px-3.5 rounded-lg text-[13px] font-medium shrink-0 shadow-sm w-full sm:w-auto flex-none"
      onClick={onAdd}
    >
      <Plus className="h-3.5 w-3.5 mr-1" />
      Tambah Rekening
    </Button>
  ) : null;

  return (
    <DataTable
      columns={columns}
      data={accounts}
      searchPlaceholder="Cari bank atau nama pemilik..."
      toolbarExtra={toolbarExtra}
    />
  );
}
