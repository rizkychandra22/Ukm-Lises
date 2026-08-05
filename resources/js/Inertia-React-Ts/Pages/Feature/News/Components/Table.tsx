import { useMemo } from "react";
import { Link } from "@inertiajs/react";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "../../Event/Components/DataTable";
import { NewsItem } from "../Types";
import { route } from "@admin/Lib/Route";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, ArrowUpDown } from "lucide-react";
import dayjs from "dayjs";

interface TableProps {
  news: NewsItem[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  onDelete: (item: NewsItem) => void;
}

export function Table({
  news,
  selectedType,
  onTypeChange,
  onDelete,
}: TableProps) {
  const filteredData = useMemo(() => {
    if (selectedType === "Semua Tipe Berita") return news;
    return news.filter((n) => n.type === selectedType);
  }, [news, selectedType]);

  const columns = useMemo<ColumnDef<NewsItem, any>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Gambar",
        cell: ({ row }: { row: { original: NewsItem } }) => (
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
        cell: ({ row }: { row: { original: NewsItem } }) => (
          <div className="font-medium text-sm line-clamp-2 text-foreground">
            {row.original.title_id}
          </div>
        ),
      },
      {
        accessorKey: "summary_id",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Summary <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: NewsItem } }) => (
          <div className="text-sm text-muted-foreground line-clamp-2">
            {row.original.summary_id || "-"}
          </div>
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
            Tanggal <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: NewsItem } }) => (
          <div className="text-sm">
            {dayjs(row.original.date).format("DD MMM YYYY")}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }: { row: { original: NewsItem } }) => {
          const item = row.original;
          return (
            <div className="flex justify-end gap-2 items-center">
              <Link
                href={route("news.edit", item.id)}
                className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                title="Edit Berita"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-lg h-8 w-8 p-0"
                onClick={() => onDelete(item)}
                title="Hapus Berita"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onDelete],
  );

  const toolbarExtra = (
    <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
      <div className="flex-1 sm:flex-none">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-8 text-[13px]">
            <SelectValue placeholder="Pilih Tipe Berita" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Tipe Berita">Semua Tipe Berita</SelectItem>
            <SelectItem value="Pementasan">Berita Pementasan</SelectItem>
            <SelectItem value="Pelatihan">Berita Pelatihan</SelectItem>
            <SelectItem value="Prestasi">Berita Prestasi</SelectItem>
            <SelectItem value="Aktivitas">Berita Aktivitas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Link
        href={route("news.create")}
        className="flex-1 sm:flex-none w-full sm:w-auto shrink-0 inline-flex items-center justify-center h-8 px-3.5 rounded-lg text-[13px] font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="w-4 h-4 mr-1" /> Tambah Berita
      </Link>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      searchPlaceholder="Cari berita..."
      toolbarExtra={toolbarExtra}
    />
  );
}
