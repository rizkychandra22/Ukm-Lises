import { useMemo } from "react";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "../../../../Components/DataTable";
import { GalleryItem } from "../Types";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ArrowUpDown } from "lucide-react";

interface TableProps {
  galleries: GalleryItem[];
  onAdd: () => void;
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

export function Table({
  galleries,
  onAdd,
  onEdit,
  onDelete,
}: TableProps) {
  const columns = useMemo<ColumnDef<GalleryItem, any>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Gambar",
        cell: ({ row }: { row: { original: GalleryItem } }) => (
          <div className="w-20 h-14 rounded-md overflow-hidden bg-muted border">
            <img
              src={row.original.image}
              alt={row.original.title_id}
              className="w-full h-full object-cover"
            />
          </div>
        ),
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
        cell: ({ row }: { row: { original: GalleryItem } }) => (
          <div className="font-medium text-sm text-foreground">{row.original.title_id}</div>
        ),
      },
      {
        accessorKey: "desc_id",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Deskripsi <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: GalleryItem } }) => (
          <div className="text-sm font-medium line-clamp-2 text-muted-foreground">
            {row.original.desc_id || "-"}
          </div>
        ),
      },
      {
        id: "status",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: GalleryItem } }) => (
          <div className="flex flex-col gap-1 items-start">
            {row.original.is_index && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-700">
                Index (Hero)
              </span>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }: { row: { original: GalleryItem } }) => {
          const item = row.original;
          return (
            <div className="flex justify-end gap-2 items-center">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                size="sm"
                onClick={() => onEdit(item)}
                title="Edit Galeri"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-lg h-8 w-8 p-0"
                onClick={() => onDelete(item)}
                title="Hapus Galeri"
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
    <Button
      onClick={onAdd}
      size="sm"
      className="h-8 px-3.5 rounded-lg text-[13px] font-medium w-full sm:w-auto shrink-0 shadow-sm"
    >
      <Plus className="w-4 h-4 mr-1" /> Tambah Galeri
    </Button>
  );

  return (
    <DataTable
      columns={columns}
      data={galleries}
      searchPlaceholder="Cari galeri..."
      toolbarExtra={toolbarExtra}
    />
  );
}
