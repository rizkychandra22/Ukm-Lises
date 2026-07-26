import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, ArrowUpDown, Eye } from "lucide-react";
import { useTranslation } from "@/i18n";
import { useMembers } from "@/constants/members";

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
  TabsList,
  TabsTrigger,
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

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

export function MemberPage() {
  const { t } = useTranslation("MemberPage");
  const members = useMembers();

  const [activeTab, setActiveTab] = useState("kepengurusan");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

  const activeMembers = members.filter((m) => m.status === "Aktif");
  const alumniMembers = members.filter((m) => m.status === "Non-Aktif");

  // Get unique batches for alumni filter
  const uniqueBatches = Array.from(
    new Set(alumniMembers.map((m) => m.batch))
  ).sort((a, b) => b.localeCompare(a)); // sort descending

  // Reset pagination when search, sort, filter, or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortConfig, selectedBatch, activeTab]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filterAndSortData = (data: typeof members) => {
    let filteredData = [...data];

    // Filter by search query
    if (searchQuery) {
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
      
      filteredData = filteredData.filter((member) => {
        const searchableText = `${member.name} ${member.prodi}`.toLowerCase();
        
        // Memastikan setiap kata yang diketik cocok dengan awalan kata pada nama/jurusan
        return searchTerms.every(term => 
          searchableText.includes(` ${term}`) || searchableText.startsWith(term)
        );
      });
    }

    // Sort logic
    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
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
    sortedAlumniMembers = sortedAlumniMembers.filter((m) => m.batch === selectedBatch);
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
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pt-16">
        <Badge
          variant="outline"
          className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" /> {t("heading")}
        </Badge>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.15] md:text-6xl mb-8">
          {t("title_t1")} <span className="text-gradient-gold">{t("title_y1")}</span>.
        </h1>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          {/* Top Controls Layout */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="kepengurusan">Kepengurusan</TabsTrigger>
              <TabsTrigger value="alumni">Alumni</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {activeTab === "alumni" && (
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter Angkatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Angkatan</SelectItem>
                    {uniqueBatches.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        Angkatan {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau jurusan..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="kepengurusan">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("name")} className="-ml-4">
                        Nama Anggota
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("prodi")} className="-ml-4">
                        Jurusan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("position")} className="-ml-4">
                        Jabatan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batch")} className="-ml-4">
                        Tahun
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batch_name")} className="-ml-4">
                        Nama Angkatan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedActiveMembers.length > 0 ? (
                    paginatedActiveMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-white/[0.10] transition-colors">
                        <TableCell>
                          <img src={member.img} alt={member.name} className="h-10 w-10 rounded-full object-cover border" />
                        </TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.prodi}</TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>{member.batch}</TableCell>
                        <TableCell>{member.batch_name}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedMember(member)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Tidak ada data ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination for Kepengurusan */}
            {renderPagination(totalPagesActive)}
          </TabsContent>

          <TabsContent value="alumni">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("name")} className="-ml-4">
                        Nama Anggota
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("prodi")} className="-ml-4">
                        Jurusan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batch")} className="-ml-4">
                        Tahun
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batch_name")} className="-ml-4">
                        Nama Angkatan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAlumniMembers.length > 0 ? (
                    paginatedAlumniMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-white/[0.10] transition-colors">
                        <TableCell>
                          <img src={member.img} alt={member.name} className="h-10 w-10 rounded-full object-cover border" />
                        </TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.prodi}</TableCell>
                        <TableCell>{member.batch}</TableCell>
                        <TableCell>{member.batch_name}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedMember(member)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Tidak ada data ditemukan.
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
            <DialogTitle>Detail Anggota</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="flex flex-col items-center gap-4 py-4">
              <img 
                src={selectedMember.img} 
                alt={selectedMember.name} 
                className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                <p className="text-muted-foreground text-sm font-medium">{selectedMember.prodi}</p>
              </div>
              
              <div className="w-full mt-4 space-y-3 bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium">{selectedMember.status}</span>
                </div>
                {selectedMember.status === "Aktif" && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Jabatan</span>
                    <span className="text-sm font-medium">{selectedMember.position}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Angkatan</span>
                  <span className="text-sm font-medium text-right">
                    {selectedMember.batch} <br />
                    <span className="text-xs text-muted-foreground">{selectedMember.batch_name}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
