import { useState } from "react";
import { flexRender } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
  LegacyColumnDef as ColumnDef,
} from "@tanstack/react-table/legacy";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { SearchFilter } from "./SearchFilter";

interface DataTableProps<TData extends Record<string, any>> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchPlaceholder?: string;
  toolbarExtra?: React.ReactNode;
  mobileLayout?: "row" | "col";
}

export function DataTable<TData extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Cari data...",
  toolbarExtra,
  mobileLayout = "col",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useLegacyTable({
    data: data as any,
    columns: columns as any,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting as any,
    onGlobalFilterChange: setGlobalFilter as any,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Controls Row */}
      <div className={`flex ${mobileLayout === "row" ? "flex-row items-center flex-wrap sm:flex-nowrap" : "flex-col lg:flex-row items-stretch lg:items-center"} justify-between gap-3`}>
        {/* Search Input */}
        <SearchFilter
          value={globalFilter ?? ""}
          onChange={setGlobalFilter}
          placeholder={searchPlaceholder}
        />

        {/* Filter / Extra Buttons Wrapper */}
        {toolbarExtra && (
          <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
            {toolbarExtra}
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="transition-colors"
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24 text-sm text-muted-foreground">
                  Tidak ada data yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1 py-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Tampilkan per halaman</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-16 text-xs bg-background border-border/60">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>
            | Total {table.getFilteredRowModel().rows.length} data
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="mr-2 font-medium">
            Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border-border/60"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border-border/60"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border-border/60"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border-border/60"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
