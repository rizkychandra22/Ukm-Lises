import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, ArrowUpDown, Eye } from "lucide-react";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";
import { type Member } from "@/lib/api/member";
import { useMembers, useBatches } from "@/hooks/use-member";
import { DataTable } from "@admin/Components/DataTable";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollTop } from "@/components/scroll-top";

export function MemberPage() {
  const { t, i18n } = useTranslation("MemberPage");
  const isEn = i18n.language === "en";
  const { members, isLoading: isMembersLoading } = useMembers();
  const { batches, isLoading: isBatchesLoading } = useBatches();

  const isLoading = isMembersLoading || isBatchesLoading;

  const [activeTab, setActiveTab] = useState("Kepengurusan");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [memberStatusFilter, setMemberStatusFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const activeMembers = members.filter((m) => {
    const isActiveBatch = m.batch?.status !== "Deactive";
    if (!isActiveBatch) return false;

    if (memberStatusFilter === "pengurus") {
      return m.status === "Active";
    } else if (memberStatusFilter === "biasa") {
      return m.status === "Deactive" && m.positionId === "Anggota Biasa";
    } else if (memberStatusFilter === "baru") {
      return m.status === "Deactive" && m.positionId === "Anggota Baru";
    }

    return true;
  });

  const alumniMembers = members.filter((m) => m.batch?.status === "Deactive");

  // Get batches list for dropdown filter
  const uniqueBatches = (
    batches.length > 0
      ? batches
      : Array.from(new Set(alumniMembers.map((m) => m.batch?.id).filter(Boolean))).map(
          (batchId) => {
            const member = alumniMembers.find((m) => m.batch?.id === batchId);
            return {
              id: batchId || 0,
              nameId: member?.batch?.nameId || "",
              nameEn: member?.batch?.nameEn,
              year: member?.batch?.year || 0,
              status: member?.batch?.status || "Deactive",
            };
          },
        )
  )
    .filter((b) => b.status === "Deactive")
    .sort((a, b) => b.year - a.year)
    .map((b) => ({
      batch: b.id.toString(),
      batch_name: isEn ? b.nameEn || b.nameId : b.nameId,
      year: b.year,
    }));

  const filterAndSearchData = (data: typeof members) => {
    let filteredData = [...data];

    // Filter by search query
    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);

      filteredData = filteredData.filter((member) => {
        const majorName = isEn
          ? member.major?.nameEn || member.major?.nameId
          : member.major?.nameId;
        const searchableText = `${member.name} ${majorName || ""}`.toLowerCase();

        return searchTerms.every(
          (term) => searchableText.includes(` ${term}`) || searchableText.startsWith(term),
        );
      });
    }
    return filteredData;
  };

  const searchedActiveMembers = filterAndSearchData(activeMembers);

  let searchedAlumniMembers = filterAndSearchData(alumniMembers);
  if (selectedBatch !== "all") {
    searchedAlumniMembers = searchedAlumniMembers.filter(
      (m) => m.batch?.id?.toString() === selectedBatch,
    );
  }

  const activeColumns = useMemo<ColumnDef<Member, any>[]>(
    () => [
      {
        id: "image",
        header: t("table.img"),
        cell: ({ row }) => {
          const member = row.original;
          return (
            <img
              src={
                member.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`
              }
              alt={member.name}
              className="h-10 w-10 min-w-10 min-h-10 rounded-full object-cover border"
            />
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.name")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        id: "prodi",
        accessorFn: (row) =>
          isEn ? row.major?.nameEn || row.major?.nameId : row.major?.nameId,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.major")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const member = row.original;
          return (
            <>
              {member.major?.degree ? `${member.major.degree} - ` : ""}
              {isEn ? member.major?.nameEn || member.major?.nameId : member.major?.nameId}
            </>
          );
        },
      },
      {
        accessorKey: "periode",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.period")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => row.original.periode || "-",
      },
      {
        id: "position",
        accessorFn: (row) =>
          isEn ? row.positionEn || row.positionId : row.positionId,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.position")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) =>
          isEn
            ? row.original.positionEn || row.original.positionId
            : row.original.positionId || "-",
      },
      {
        id: "batch",
        accessorFn: (row) => row.batch?.year,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.year")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        id: "batch_name",
        accessorFn: (row) =>
          isEn ? row.batch?.nameEn || row.batch?.nameId : row.batch?.nameId,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.batch_name")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">{t("table.show")}</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMember(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [isEn, t],
  );

  const alumniColumns = useMemo<ColumnDef<Member, any>[]>(
    () => [
      {
        id: "image",
        header: t("table.img"),
        cell: ({ row }) => {
          const member = row.original;
          return (
            <img
              src={
                member.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`
              }
              alt={member.name}
              className="h-10 w-10 min-w-10 min-h-10 rounded-full object-cover border"
            />
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.name")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        id: "prodi",
        accessorFn: (row) =>
          isEn ? row.major?.nameEn || row.major?.nameId : row.major?.nameId,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.major")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const member = row.original;
          return (
            <>
              {member.major?.degree ? `${member.major.degree} - ` : ""}
              {isEn ? member.major?.nameEn || member.major?.nameId : member.major?.nameId}
            </>
          );
        },
      },
      {
        id: "batch",
        accessorFn: (row) => row.batch?.year,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.year")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        id: "batch_name",
        accessorFn: (row) =>
          isEn ? row.batch?.nameEn || row.batch?.nameId : row.batch?.nameId,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4"
            >
              {t("table.batch_name")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">{t("table.show")}</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedMember(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [isEn, t],
  );
  // Pagination handled by DataTable

  return (
    <>
      <SEOHead pageKey="members" />
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pt-16">
        <Badge
          variant="outline"
          className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" /> {t("heading")}
        </Badge>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.15] md:text-4xl mb-8">
          {t("title_t1")} <span className="text-gradient-gold">{t("title_y1")}</span>.
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Controls Row (Category & Filter Selects on LEFT, Search on FAR RIGHT) */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
            {/* Left: Search Input Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Right: Category Select & Filter Select (Side-by-side on mobile) */}
            <div className="flex flex-row gap-2.5 items-center w-full md:w-auto">
              {/* Select 1: Kategori Dropdown (Kepengurusan / Demisioner) */}
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-1/2 sm:w-44">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kepengurusan">{t("tabs.administration")}</SelectItem>
                  <SelectItem value="Demisioner">{t("tabs.demisioner")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Select 2: Filter Dropdown (Next to Kategori Dropdown) */}
              {activeTab === "Kepengurusan" && (
                <Select value={memberStatusFilter} onValueChange={setMemberStatusFilter}>
                  <SelectTrigger className="w-1/2 sm:w-48">
                    <SelectValue placeholder="Semua Anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("tabs.all_member")}</SelectItem>
                    <SelectItem value="pengurus">{t("tabs.admin_member")}</SelectItem>
                    <SelectItem value="biasa">{t("tabs.reguler_member")}</SelectItem>
                    <SelectItem value="baru">{t("tabs.new_member")}</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {activeTab === "Demisioner" && (
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-1/2 sm:w-56">
                    <SelectValue placeholder="Filter Angkatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("tabs.all_batch")}</SelectItem>
                    {uniqueBatches.map(({ batch, batch_name, year }) => (
                      <SelectItem key={batch} value={batch}>
                        {year} {batch_name ? `- ${batch_name}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <TabsContent value="Kepengurusan">
            {isLoading ? (
              <div className="rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("table.img")}</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.name")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.major")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.period")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.position")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.year")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.batch_name")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">{t("table.show")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="[&>div>div:first-child]:hidden">
                <DataTable columns={activeColumns} data={searchedActiveMembers} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="Demisioner">
            {isLoading ? (
              <div className="rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("table.img")}</TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.name")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.major")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.year")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="-ml-4">
                          {t("table.batch_name")}
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">{t("table.show")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="[&>div>div:first-child]:hidden">
                <DataTable columns={alumniColumns} data={searchedAlumniMembers} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* View Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="w-[90vw] max-w-[400px] sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle>{t("card.detail")}</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="flex flex-col items-center gap-4 py-4">
              <img
                src={
                  selectedMember.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=random`
                }
                alt={selectedMember.name}
                className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                <p className="text-muted-foreground text-sm font-medium">
                  {selectedMember.major?.degree ? `${selectedMember.major.degree} - ` : ""}
                  {isEn
                    ? selectedMember.major?.nameEn || selectedMember.major?.nameId
                    : selectedMember.major?.nameId}
                </p>
              </div>

              <div className="w-full mt-4 space-y-2 bg-muted/30 p-4 rounded-xl border shadow-inner">
                {selectedMember.batch?.status !== "Deactive" && (
                  <>
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-sm text-muted-foreground font-medium">
                        {t("card.position")}
                      </span>
                      <span className="text-sm font-semibold text-right max-w-[200px] break-words">
                        {isEn
                          ? selectedMember.positionEn || selectedMember.positionId
                          : selectedMember.positionId || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-sm text-muted-foreground font-medium">
                        {t("card.period")}
                      </span>
                      <span className="text-sm font-semibold text-right">
                        {selectedMember.periode || "-"}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-sm text-muted-foreground font-medium">
                    {t("card.status")}
                  </span>
                  <div className="flex gap-2 justify-end">
                    <Badge
                      className={
                        selectedMember.batch?.status !== "Deactive"
                          ? "rounded-md bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
                          : "rounded-md bg-amber-600 hover:bg-amber-500 text-white border-transparent"
                      }
                    >
                      {selectedMember.batch?.status !== "Deactive"
                        ? isEn
                          ? "Administration"
                          : "Kepengurusan"
                        : isEn
                          ? "Demisioner"
                          : "Demisioner"}
                    </Badge>
                    {selectedMember.batch?.status !== "Deactive" && (
                      <Badge
                        className={
                          selectedMember.status === "Active"
                            ? "rounded-md bg-blue-600 hover:bg-blue-500 text-white border-transparent"
                            : "rounded-md bg-slate-500 hover:bg-slate-400 text-white border-transparent"
                        }
                      >
                        {selectedMember.status === "Active"
                          ? isEn
                            ? "Active"
                            : "Aktif"
                          : isEn
                            ? "Deactive"
                            : "Tidak Aktif"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">
                      {t("card.batch")}
                    </span>
                    <span className="text-sm font-bold text-right">
                      {selectedMember.batch?.year}
                    </span>
                  </div>
                  <div className="text-right mt-0.5">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {isEn
                        ? selectedMember.batch?.nameEn || selectedMember.batch?.nameId
                        : selectedMember.batch?.nameId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">WhatsApp</span>
                    <span className="text-sm font-semibold text-right">
                      {selectedMember.whatsapp || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">Instagram</span>
                    <span className="text-sm font-semibold text-right">
                      {selectedMember.instagram || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ScrollTop />
    </>
  );
}
