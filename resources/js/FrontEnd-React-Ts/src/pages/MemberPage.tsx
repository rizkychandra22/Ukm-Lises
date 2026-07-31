import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, ArrowUpDown, Eye } from "lucide-react";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";
import { getMembers, getBatches, type Member, type Batch, type MemberType } from "@/lib/api/member";

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
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollTop } from "@/components/scroll-top";

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

export function MemberPage() {
  const { t, i18n } = useTranslation("MemberPage");
  const isEn = i18n.language === 'en';
  const [members, setMembers] = useState<Member[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [membersData, batchesData] = await Promise.all([
          getMembers(),
          getBatches(),
        ]);
        if (membersData && Array.isArray(membersData)) {
          setMembers(membersData);
        }
        if (batchesData && Array.isArray(batchesData)) {
          setBatches(batchesData);
        }
      } catch (error) {
        console.error("Failed to fetch member/batch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [activeTab, setActiveTab] = useState("Kepengurusan");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [memberStatusFilter, setMemberStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

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

  const alumniMembers = members.filter((m) => m.type === "Demisioner" || m.batch?.status === "Deactive");

  // Get batches list for dropdown filter
  const uniqueBatches = (batches.length > 0
    ? batches
    : Array.from(new Set(alumniMembers.map((m) => m.batch?.id).filter(Boolean))).map((batchId) => {
        const member = alumniMembers.find((m) => m.batch?.id === batchId);
        return {
          id: batchId || 0,
          nameId: member?.batch?.nameId || '',
          nameEn: member?.batch?.nameEn,
          year: member?.batch?.year || 0,
        };
      })
  )
    .sort((a, b) => b.year - a.year)
    .map((b) => ({
      batch: b.id.toString(),
      batch_name: isEn ? (b.nameEn || b.nameId) : b.nameId,
      year: b.year,
    }));

  // Reset pagination when search, sort, filter, or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortConfig, selectedBatch, memberStatusFilter, activeTab]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortValue = (member: Member, key: string): any => {
    switch (key) {
      case "name": return member.name?.toLowerCase();
      case "prodi": return (isEn ? (member.major?.nameEn || member.major?.nameId) : member.major?.nameId)?.toLowerCase();
      case "periode": return member.periode?.toLowerCase();
      case "position": return (isEn ? (member.positionEn || member.positionId) : member.positionId)?.toLowerCase();
      case "batch": return member.batch?.year;
      case "batch_name": return (isEn ? (member.batch?.nameEn || member.batch?.nameId) : member.batch?.nameId)?.toLowerCase();
      default: return "";
    }
  };

  const filterAndSortData = (data: typeof members) => {
    let filteredData = [...data];

    // Filter by search query
    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
      
      filteredData = filteredData.filter((member) => {
        const majorName = isEn ? (member.major?.nameEn || member.major?.nameId) : member.major?.nameId;
        const searchableText = `${member.name} ${majorName || ''}`.toLowerCase();
        
        // Memastikan setiap kata yang diketik cocok dengan awalan kata pada nama/jurusan
        return searchTerms.every(term => 
          searchableText.includes(` ${term}`) || searchableText.startsWith(term)
        );
      });
    }

    // Sort logic
    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        const valA = getSortValue(a, sortConfig.key);
        const valB = getSortValue(b, sortConfig.key);

        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const sortedActiveMembers = filterAndSortData(activeMembers);

  let sortedAlumniMembers = filterAndSortData(alumniMembers);
  if (selectedBatch !== "all") {
    sortedAlumniMembers = sortedAlumniMembers.filter((m) => m.batch?.id?.toString() === selectedBatch);
  }

  // Apply pagination
  const totalPagesActive = Math.ceil(sortedActiveMembers.length / itemsPerPage);
  const paginatedActiveMembers = sortedActiveMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPagesAlumni = Math.ceil(sortedAlumniMembers.length / itemsPerPage);
  const paginatedAlumniMembers = sortedAlumniMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = (totalPages: number) => {
    if (totalPages <= 1) return null;
    return (
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

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

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          {/* Controls Row (Category & Filter Selects on LEFT, Search on FAR RIGHT) */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
            {/* LEFT: Category Select & Filter Select (Side-by-side on mobile) */}
            <div className="flex flex-row gap-2.5 items-center w-full md:w-auto">
              {/* Select 1: Kategori Dropdown (Kepengurusan / Demisioner) */}
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-1/2 sm:w-44">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kepengurusan">{t('tabs.administration')}</SelectItem>
                  <SelectItem value="Demisioner">{t('tabs.demisioner')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Select 2: Filter Dropdown (Next to Kategori Dropdown) */}
              {activeTab === "Kepengurusan" && (
                <Select value={memberStatusFilter} onValueChange={setMemberStatusFilter}>
                  <SelectTrigger className="w-1/2 sm:w-48">
                    <SelectValue placeholder="Semua Anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('tabs.all_member')}</SelectItem>
                    <SelectItem value="pengurus">{t('tabs.admin_member')}</SelectItem>
                    <SelectItem value="biasa">{t('tabs.reguler_member')}</SelectItem>
                    <SelectItem value="baru">{t('tabs.new_member')}</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {activeTab === "Demisioner" && (
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-1/2 sm:w-56">
                    <SelectValue placeholder="Filter Angkatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('tabs.all_batch')}</SelectItem>
                    {uniqueBatches.map(({ batch, batch_name, year }) => (
                      <SelectItem key={batch} value={batch}>
                        {year} {batch_name ? `- ${batch_name}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* FAR RIGHT: Search Input Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="Kepengurusan">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.img")}</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("name")} className="-ml-4">
                        {t("table.name")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("prodi")} className="-ml-4">
                        {t("table.major")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("periode")} className="-ml-4">
                        {t("table.period")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("position")} className="-ml-4">
                        {t("table.position")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batch")} className="-ml-4">
                        {t("table.year")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batch_name")} className="-ml-4">
                        {t("table.batch_name")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">{t("table.show")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : paginatedActiveMembers.length > 0 ? (
                    paginatedActiveMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-white/[0.10] transition-colors">
                        <TableCell>
                          <img src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} alt={member.name} className="h-10 w-10 min-w-10 min-h-10 rounded-full object-cover border" />
                        </TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.major?.degree ? `${member.major.degree} - ` : ''}{isEn ? (member.major?.nameEn || member.major?.nameId) : member.major?.nameId}</TableCell>
                        <TableCell>{member.periode || '-'}</TableCell>
                        <TableCell>{isEn ? (member.positionEn || member.positionId) : member.positionId || '-'}</TableCell>
                        <TableCell>{member.batch?.year}</TableCell>
                        <TableCell>{isEn ? (member.batch?.nameEn || member.batch?.nameId) : member.batch?.nameId}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedMember(member)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        {t("table.not_found")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination for Kepengurusan */}
            {renderPagination(totalPagesActive)}
          </TabsContent>

          <TabsContent value="Demisioner">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.img")}</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("name")} className="-ml-4">
                        {t("table.name")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("prodi")} className="-ml-4">
                        {t("table.major")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batch")} className="-ml-4">
                        {t("table.year")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batch_name")} className="-ml-4">
                        {t("table.batch_name")}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">{t("table.show")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : paginatedAlumniMembers.length > 0 ? (
                    paginatedAlumniMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-white/[0.10] transition-colors">
                        <TableCell>
                          <img src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} alt={member.name} className="h-10 w-10 min-w-10 min-h-10 rounded-full object-cover border" />
                        </TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.major?.degree ? `${member.major.degree} - ` : ''}{isEn ? (member.major?.nameEn || member.major?.nameId) : member.major?.nameId}</TableCell>
                        <TableCell>{member.batch?.year}</TableCell>
                        <TableCell>{isEn ? (member.batch?.nameEn || member.batch?.nameId) : member.batch?.nameId}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedMember(member)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        {t("table.not_found")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination for Alumni */}
            {renderPagination(totalPagesAlumni)}
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
                src={selectedMember.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=random`} 
                alt={selectedMember.name} 
                className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                <p className="text-muted-foreground text-sm font-medium">{selectedMember.major?.degree ? `${selectedMember.major.degree} - ` : ''}{isEn ? (selectedMember.major?.nameEn || selectedMember.major?.nameId) : selectedMember.major?.nameId}</p>
              </div>
              
              <div className="w-full mt-6 space-y-4 bg-muted/30 p-5 rounded-xl border shadow-inner">
                {selectedMember.batch?.status !== "Deactive" && (
                  <>
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <span className="text-sm text-muted-foreground font-medium">{t("card.position")}</span>
                      <span className="text-sm font-semibold text-right max-w-[200px] break-words">
                        {isEn ? (selectedMember.positionEn || selectedMember.positionId) : selectedMember.positionId || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <span className="text-sm text-muted-foreground font-medium">{t("card.period")}</span>
                      <span className="text-sm font-semibold text-right">{selectedMember.periode || '-'}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-sm text-muted-foreground font-medium">{t("card.status")}</span>
                  <div className="flex gap-2 justify-end">
                    <Badge 
                      className={selectedMember.batch?.status !== "Deactive" 
                        ? "rounded-md bg-emerald-600 hover:bg-emerald-500 text-white border-transparent" 
                        : "rounded-md bg-amber-600 hover:bg-amber-500 text-white border-transparent"
                      }
                    >
                      {selectedMember.batch?.status !== "Deactive" ? isEn ? "Administration" : "Kepengurusan" : isEn ? "Demisioner" : "Demisioner"}
                    </Badge>
                    {selectedMember.batch?.status !== "Deactive" && (
                      <Badge 
                        className={selectedMember.status === "Active" 
                          ? "rounded-md bg-blue-600 hover:bg-blue-500 text-white border-transparent" 
                          : "rounded-md bg-slate-500 hover:bg-slate-400 text-white border-transparent"
                        }
                      >
                        {selectedMember.status === "Active" ? isEn ? "Active" : "Aktif" : isEn ? "Deactive" : "Tidak Aktif"}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-medium">{t("card.batch")}</span>
                    <span className="text-sm font-bold text-right">{selectedMember.batch?.year}</span>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {isEn ? (selectedMember.batch?.nameEn || selectedMember.batch?.nameId) : selectedMember.batch?.nameId}
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
