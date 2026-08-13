import { useMemo } from "react";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { DataTable } from "../../../../Components/DataTable";
import { BatchMember, Batch } from "../Types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit, Trash2, ArrowUpDown, Plus } from "lucide-react";

interface MemberTableProps {
  members: BatchMember[];
  batches: Batch[];
  activeMemberTab: string;
  memberStatusFilter: string;
  demisionerBatchFilter: string;
  userBatch?: Batch;
  hasRole: (roles: string | string[]) => boolean;
  onActiveMemberTabChange: (val: string) => void;
  onMemberStatusFilterChange: (val: string) => void;
  onDemisionerBatchFilterChange: (val: string) => void;
  onView: (member: BatchMember) => void;
  onEdit: (member: BatchMember) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export function MemberTable({
  members,
  batches,
  activeMemberTab,
  memberStatusFilter,
  demisionerBatchFilter,
  userBatch,
  hasRole,
  onActiveMemberTabChange,
  onMemberStatusFilterChange,
  onDemisionerBatchFilterChange,
  onView,
  onEdit,
  onDelete,
  onAdd,
}: MemberTableProps) {
  const filteredData = useMemo(() => {
    return members.filter((m) => {
      let matchTab: boolean;
      if (activeMemberTab === "MyBatch") {
        matchTab = m.batch_id === userBatch?.id;
      } else if (
        activeMemberTab === "Administration" ||
        activeMemberTab === "Pengurus" ||
        activeMemberTab === "Kepengurusan"
      ) {
        matchTab = m.batch?.status !== "Deactive";
        if (matchTab) {
          if (memberStatusFilter === "pengurus") {
            matchTab = m.status === "Active";
          } else if (memberStatusFilter === "biasa") {
            matchTab = m.status === "Deactive" && m.position_id === "Anggota Biasa";
          } else if (memberStatusFilter === "baru") {
            matchTab = m.status === "Deactive" && m.position_id === "Anggota Baru";
          }
        }
      } else {
        matchTab = m.batch?.status === "Deactive";
        if (matchTab && demisionerBatchFilter !== "all") {
          matchTab = m.batch_id?.toString() === demisionerBatchFilter;
        }
      }
      return matchTab;
    });
  }, [members, activeMemberTab, memberStatusFilter, demisionerBatchFilter, userBatch]);

  const showPeriodeJabatan = useMemo(() => {
    if (
      activeMemberTab === "Administration" ||
      activeMemberTab === "Pengurus" ||
      activeMemberTab === "Kepengurusan"
    )
      return true;
    if (activeMemberTab === "Demisioner") return false;
    return filteredData.some((m) => m.status === "Active" || m.position_id);
  }, [activeMemberTab, filteredData]);

  const columns = useMemo<ColumnDef<BatchMember, any>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Foto",
        cell: ({ row }: { row: { original: BatchMember } }) => {
          const img = row.original.image;
          return (
            <img
              src={
                img
                  ? img
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.original.name)}&background=random`
              }
              alt={row.original.name}
              className="h-10 w-10 min-w-10 min-h-10 shrink-0 rounded-full object-cover border"
            />
          );
        },
      },
      {
        accessorKey: "name",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Anggota <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: BatchMember } }) => (
          <div className="font-medium text-sm text-foreground">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "major_id",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Jurusan <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: BatchMember } }) => (
          <div className="text-sm">
            {row.original.major
              ? `${row.original.major.degree ? row.original.major.degree + " - " : ""}${row.original.major.name_id}`
              : row.original.major_id}
          </div>
        ),
      },
      ...(showPeriodeJabatan
        ? [
            {
              accessorKey: "periode",
              header: ({ column }: { column: any }) => (
                <Button
                  variant="ghost"
                  className="-ml-4 hover:bg-transparent text-sm font-semibold"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Periode <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }: { row: { original: BatchMember } }) => (
                <div className="text-sm">{row.original.periode || "-"}</div>
              ),
            },
            {
              accessorKey: "position_id",
              header: ({ column }: { column: any }) => (
                <Button
                  variant="ghost"
                  className="-ml-4 hover:bg-transparent text-sm font-semibold"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Jabatan <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ),
              cell: ({ row }: { row: { original: BatchMember } }) => (
                <div className="text-sm">{row.original.position_id || "-"}</div>
              ),
            },
          ]
        : []),
      {
        id: "batch_year",
        accessorFn: (row: BatchMember) => row.batch?.year || "",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tahun <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: BatchMember } }) => (
          <div className="text-sm font-medium">{row.original.batch?.year || "-"}</div>
        ),
      },
      {
        id: "batch_name",
        accessorFn: (row: BatchMember) => row.batch?.name_id || "",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama Angkatan <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: BatchMember } }) => (
          <div className="text-sm">
            {row.original.batch
              ? `${row.original.batch.year} - ${row.original.batch.name_id}`
              : "-"}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right text-sm">Aksi</div>,
        cell: ({ row }: { row: { original: BatchMember } }) => {
          const member = row.original;
          const canEditOrDelete = (() => {
            if (hasRole("Developer")) return true;
            if (hasRole("Admin")) {
              return member.type === "Pengurus" && member.status === "Active";
            }
            if (hasRole("User")) {
              if (activeMemberTab !== "MyBatch") return false;
              if (member.batch_id !== userBatch?.id) return false;
              return member.status === "Deactive";
            }
            return false;
          })();

          return (
            <div className="flex justify-end gap-2 items-center">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 w-8 p-0"
                size="sm"
                onClick={() => onView(member)}
                title="Lihat Detail Anggota"
              >
                <Eye className="h-4 w-4" />
              </Button>
              {canEditOrDelete && (
                <>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0"
                    size="sm"
                    onClick={() => onEdit(member)}
                    title="Edit Anggota"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-lg h-8 w-8 p-0"
                    onClick={() => onDelete(member.id)}
                    title="Hapus Anggota"
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
    [showPeriodeJabatan, activeMemberTab, userBatch],
  );

  const canAddMember = (() => {
    if (activeMemberTab === "Administration" || activeMemberTab === "Demisioner")
      return hasRole(["Developer", "Admin"]);
    if (activeMemberTab === "MyBatch") return hasRole("User");
    return hasRole(["Developer", "Admin"]);
  })();

  const toolbarExtra = (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
      {/* Dropdown Filters */}
      {(activeMemberTab === "Administration" ||
        activeMemberTab === "Demisioner" ||
        !hasRole("User")) && (
        <div className="flex flex-row items-center gap-2.5 w-full sm:w-auto min-w-0">
          {!hasRole("User") && (
            <Select value={activeMemberTab} onValueChange={onActiveMemberTabChange}>
              <SelectTrigger className="h-8 flex-1 min-w-0 sm:w-40 rounded-lg text-[13px] bg-muted/50 border-border/60">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administration" className="text-[13px]">
                  Kepengurusan
                </SelectItem>
                <SelectItem value="Demisioner" className="text-[13px]">
                  Demisioner
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          {activeMemberTab === "Administration" && (
            <Select value={memberStatusFilter} onValueChange={onMemberStatusFilterChange}>
              <SelectTrigger className="h-8 flex-1 min-w-0 sm:w-40 rounded-lg text-[13px] bg-muted/50 border-border/60">
                <SelectValue placeholder="Filter Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-[13px]">
                  Semua Anggota
                </SelectItem>
                <SelectItem value="pengurus" className="text-[13px]">
                  Pengurus Aktif
                </SelectItem>
                <SelectItem value="biasa" className="text-[13px]">
                  Anggota Biasa
                </SelectItem>
                <SelectItem value="baru" className="text-[13px]">
                  Anggota Baru
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          {activeMemberTab === "Demisioner" && (
            <Select value={demisionerBatchFilter} onValueChange={onDemisionerBatchFilterChange}>
              <SelectTrigger className="h-8 flex-1 min-w-0 sm:w-44 rounded-lg text-[13px] bg-muted/50 border-border/60">
                <SelectValue placeholder="Filter Angkatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-[13px]">
                  Semua Angkatan
                </SelectItem>
                {batches
                  .filter((b) => b.status === "Deactive")
                  .map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()} className="text-[13px]">
                      {b.year} - {b.name_id}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {canAddMember && (
        <Button
          size="sm"
          className="h-8 px-3.5 rounded-lg text-[13px] font-medium w-full sm:w-auto shrink-0 shadow-sm"
          onClick={onAdd}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Tambah Anggota
        </Button>
      )}
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      searchPlaceholder="Cari anggota berdasarkan nama atau prodi..."
      toolbarExtra={toolbarExtra}
    />
  );
}
