import { useState, useMemo } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { route } from '../Lib/Route';
import AdminLayout from '../Layouts/AppLayout';
import { Search, Plus, Edit, Trash2, ArrowUpDown, Eye } from 'lucide-react';
import { toast } from 'sonner';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- Types ---
type Batch = {
    id: number;
    user_id?: number;
    year: string;
    name_id: string;
    name_en: string;
    status: 'Active' | 'Deactive';
};

type Major = {
    id: number;
    faculty_id: string;
    faculty_en: string;
    name_id: string;
    name_en: string;
    degree: string | null;
};

type BatchMember = {
    id: number;
    batch_id: number;
    image: string | null;
    name: string;
    major_id: string | number;
    type: 'Demisioner' | 'Pengurus';
    status: 'Active' | 'Deactive';
    periode: string | null;
    position_id: string | null;
    position_en: string | null;
    batch?: Batch;
    major?: Major;
};

type Props = {
    members: BatchMember[];
    batches: Batch[];
    majors: Major[];
};

export default function Index({ members, batches, majors }: Props) {
    const { auth } = usePage<any>().props;
    const user = auth.user;

    const hasRole = (roleNames: string | string[]) => {
        if (!user?.roles) return false;
        if (Array.isArray(roleNames)) {
            return roleNames.some((role: string) => user.roles?.includes(role));
        }
        return user.roles.includes(roleNames);
    };

    const userBatch = useMemo(() => batches.find(b => b.user_id === user?.id), [batches, user]);

    // --- States ---
    const [viewingMember, setViewingMember] = useState<BatchMember | null>(null);
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

    // State Fakultas untuk Filter Program Studi
    const [selectedFaculty, setSelectedFaculty] = useState<string>('');

    const [activeTab, setActiveTab] = useState("anggota");
    const [activeMemberTab, setActiveMemberTab] = useState(hasRole('User') ? "MyBatch" : "Demisioner");
    const [searchMember, setSearchMember] = useState("");
    const [searchBatch, setSearchBatch] = useState("");

    // Sort State untuk Angkatan
    const [sortBatchConfig, setSortBatchConfig] = useState<{ key: 'year' | 'name_id', direction: 'asc' | 'desc' } | null>(null);

    const handleSortBatch = (key: 'year' | 'name_id') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortBatchConfig && sortBatchConfig.key === key && sortBatchConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortBatchConfig({ key, direction });
    };

    // Sort State untuk Anggota
    const [sortMemberConfig, setSortMemberConfig] = useState<{ key: 'name' | 'major_id' | 'periode' | 'position_id' | 'batch_year' | 'batch_name', direction: 'asc' | 'desc' } | null>(null);

    const handleSortMember = (key: 'name' | 'major_id' | 'periode' | 'position_id' | 'batch_year' | 'batch_name') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortMemberConfig && sortMemberConfig.key === key && sortMemberConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortMemberConfig({ key, direction });
    };

    // Modal State untuk Anggota
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<BatchMember | null>(null);

    // Delete Confirmation State Anggota
    const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

    // Derived states untuk Fakultas & Prodi
    const faculties = useMemo(() => {
        const unique = new Map<string, string>();
        majors.forEach(m => {
            if (!unique.has(m.faculty_id)) {
                unique.set(m.faculty_id, m.faculty_id);
            }
        });
        return Array.from(unique.values());
    }, [majors]);

    const availableMajors = useMemo(() => {
        return majors.filter(m => m.faculty_id === selectedFaculty);
    }, [majors, selectedFaculty]);

    // Form Anggota
    const {
        data: memberData,
        setData: setMemberData,
        post: postMember,
        delete: deleteMemberReq,
        reset: resetMember,
        processing: processingMember,
        errors: memberErrors
    } = useForm({
        batch_id: '',
        image: null as File | null,
        name: '',
        major_id: '',
        type: 'Pengurus' as 'Demisioner' | 'Pengurus',
        status: 'Active' as 'Active' | 'Deactive',
        periode: '',
        position_id: '',
        _method: 'post'
    });

    // --- Handlers Anggota ---
    const handleAddMember = () => {
        setEditingMember(null);
        resetMember();
        setSelectedFaculty('');
        const defaultBatchId = userBatch ? userBatch.id.toString() : '';
        const targetBatch = batches.find(b => b.id.toString() === defaultBatchId);

        const isDeactiveBatch = targetBatch?.status === 'Deactive';

        setMemberData(data => ({
            ...data,
            batch_id: defaultBatchId,
            type: isDeactiveBatch ? 'Demisioner' : 'Pengurus',
            status: '' as any,
            periode: '',
            position_id: '',
            _method: 'post'
        }));
        setIsMemberModalOpen(true);
    };

    const handleEditMember = (member: BatchMember) => {
        setEditingMember(member);

        const foundMajor = majors.find(m => m.id === Number(member.major_id));
        if (foundMajor) {
            setSelectedFaculty(foundMajor.faculty_id);
        } else {
            setSelectedFaculty('');
        }

        setMemberData({
            batch_id: member.batch_id.toString(),
            image: null,
            name: member.name,
            major_id: member.major_id.toString(),
            type: member.type,
            status: member.status,
            periode: member.periode || '',
            position_id: member.position_id || '',
            _method: 'put'
        });
        setIsMemberModalOpen(true);
    };

    const handleCancelEditMember = () => {
        setEditingMember(null);
        resetMember();
        setIsMemberModalOpen(false);
    };

    const handleSubmitMember = (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = editingMember
            ? route('list-member.members.update', editingMember.id)
            : route('list-member.members.store');

        postMember(endpoint, {
            onSuccess: () => {
                handleCancelEditMember();
                toast.success(`Berhasil ${editingMember ? 'memperbarui' : 'menambahkan'} data anggota.`);
            }
        });
    };

    const handleDeleteMember = (id: number) => {
        setMemberToDelete(id);
        setIsDeleteMemberDialogOpen(true);
    };

    const confirmDeleteMember = () => {
        if (memberToDelete) {
            deleteMemberReq(route('list-member.members.destroy', memberToDelete), {
                onSuccess: () => {
                    setIsDeleteMemberDialogOpen(false);
                    setMemberToDelete(null);
                    toast.success('Berhasil menghapus data anggota.');
                }
            });
        }
    };

    // Modal State untuk Angkatan
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    // Mode Edit Batch
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

    // Delete Confirmation State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [batchToDelete, setBatchToDelete] = useState<number | null>(null);

    // Form Angkatan (Batch)
    const {
        data: batchData,
        setData: setBatchData,
        post: postBatch,
        put: putBatch,
        delete: deleteBatchReq,
        reset: resetBatch,
        processing: processingBatch
    } = useForm({
        year: '',
        name_id: '',
        status: 'Active' as 'Active' | 'Deactive',
        username: '',
        password: ''
    });

    // --- Handlers Angkatan (Batch) ---
    const handleAddBatch = () => {
        setEditingBatch(null);
        resetBatch();
        setIsBatchModalOpen(true);
    };

    const handleEditBatch = (batch: Batch) => {
        setEditingBatch(batch);
        setBatchData({
            year: batch.year,
            name_id: batch.name_id,
            status: batch.status || 'Active',
            username: '',
            password: ''
        });
        setIsBatchModalOpen(true);
    };

    const handleCancelEditBatch = () => {
        setEditingBatch(null);
        resetBatch();
        setIsBatchModalOpen(false);
    };

    const handleSubmitBatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBatch) {
            putBatch(route('list-member.batches.update', editingBatch.id), {
                onSuccess: () => {
                    handleCancelEditBatch();
                    toast.success('Berhasil memperbarui data angkatan.');
                },
            });
        } else {
            postBatch(route('list-member.batches.store'), {
                onSuccess: () => {
                    handleCancelEditBatch();
                    toast.success('Berhasil menambahkan data angkatan.');
                },
            });
        }
    };

    const handleDeleteBatch = (id: number) => {
        setBatchToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteBatch = () => {
        if (batchToDelete) {
            deleteBatchReq(route('list-member.batches.destroy', batchToDelete), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setBatchToDelete(null);
                    toast.success('Berhasil menghapus data angkatan.');
                }
            });
        }
    };

    // --- Memoized Filtered Data ---
    const filteredBatches = useMemo(() => {
        let result = [...batches];

        if (searchBatch) {
            const lowercased = searchBatch.toLowerCase();
            result = result.filter(b =>
                b.year.toLowerCase().includes(lowercased) ||
                b.name_id.toLowerCase().includes(lowercased)
            );
        }

        if (sortBatchConfig) {
            result.sort((a, b) => {
                if (a[sortBatchConfig.key] < b[sortBatchConfig.key]) {
                    return sortBatchConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortBatchConfig.key] > b[sortBatchConfig.key]) {
                    return sortBatchConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return result;
    }, [batches, searchBatch, sortBatchConfig]);

    const filteredMembers = useMemo(() => {
        const result = members.filter(m => {
            let matchTab = false;
            if (activeMemberTab === 'MyBatch') {
                matchTab = m.batch_id === userBatch?.id;
            } else if (activeMemberTab === 'Administration' || activeMemberTab === 'Pengurus') {
                matchTab = m.type === 'Pengurus' && m.status === 'Active' && m.batch?.status !== 'Deactive';
            } else if (activeMemberTab === 'AnggotaLainnya') {
                matchTab = m.type === 'Pengurus' && m.status === 'Deactive' && m.batch?.status !== 'Deactive';
            } else {
                matchTab = m.type === 'Demisioner' || m.batch?.status === 'Deactive';
            }

            const matchSearch = m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
                (m.major?.name_id || m.major_id.toString()).toLowerCase().includes(searchMember.toLowerCase());

            return matchTab && matchSearch;
        });

        if (sortMemberConfig) {
            result.sort((a, b) => {
                let aValue: any = a[sortMemberConfig.key as keyof BatchMember];
                let bValue: any = b[sortMemberConfig.key as keyof BatchMember];

                if (sortMemberConfig.key === 'major_id') {
                    aValue = a.major?.name_id || '';
                    bValue = b.major?.name_id || '';
                } else if (sortMemberConfig.key === 'batch_year') {
                    aValue = a.batch?.year || '';
                    bValue = b.batch?.year || '';
                } else if (sortMemberConfig.key === 'batch_name') {
                    aValue = a.batch?.name_id || '';
                    bValue = b.batch?.name_id || '';
                }

                if (!aValue) aValue = '';
                if (!bValue) bValue = '';

                if (aValue < bValue) {
                    return sortMemberConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortMemberConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return result;
    }, [members, searchMember, activeMemberTab, userBatch, sortMemberConfig]);

    const showPeriodeJabatan = useMemo(() => {
        if (activeMemberTab === 'Administration' || activeMemberTab === 'AnggotaLainnya') return true;
        if (activeMemberTab === 'Demisioner') return false;
        // MyBatch
        return filteredMembers.some(m => m.status === 'Active' || m.position_id);
    }, [activeMemberTab, filteredMembers]);


    // --- UI Render ---
    return (
        <AdminLayout>
            <Head title="Kelola Anggota & Angkatan" />

            <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 relative">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">Manajemen Data Anggota</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Kelola data anggota dan data angkatan
                        </p>
                    </div>
                </div>

                {/* Unified Controls Container */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* LEFT: Main Tabs & Sub Tabs */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-start sm:items-center">
                        {!hasRole(['User']) && (
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-2 w-full">
                                    <TabsTrigger value="anggota">Anggota</TabsTrigger>
                                    <TabsTrigger value="angkatan">Angkatan</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        )}

                        {activeTab === 'anggota' && (
                            <Tabs value={activeMemberTab} onValueChange={setActiveMemberTab} className={hasRole('User') && userBatch ? 'w-full sm:w-80 relative' : 'w-full sm:w-96 relative'}>
                                <TabsList className="grid grid-cols-3 w-full">
                                    {hasRole('User') && userBatch ? (
                                        <>
                                            <TabsTrigger value="MyBatch">Angkatan {userBatch.year}</TabsTrigger>
                                            <TabsTrigger value="Demisioner">Demisioner</TabsTrigger>
                                            <TabsTrigger value="Administration">Kepengurusan</TabsTrigger>
                                        </>
                                    ) : (
                                        <>
                                            <TabsTrigger value="Demisioner">Demisioner</TabsTrigger>
                                            <TabsTrigger value="Administration">Kepengurusan</TabsTrigger>
                                            <TabsTrigger value="AnggotaLainnya">Anggota Lainnya</TabsTrigger>
                                        </>
                                    )}
                                </TabsList>
                            </Tabs>
                        )}
                    </div>

                    {/* RIGHT: Search & Add Button */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={activeTab === 'anggota' ? "Cari anggota berdasarkan nama atau prodi..." : "Cari angkatan..."}
                                className="pl-10"
                                value={activeTab === 'anggota' ? searchMember : searchBatch}
                                onChange={(e) => activeTab === 'anggota' ? setSearchMember(e.target.value) : setSearchBatch(e.target.value)}
                            />
                        </div>
                        {(() => {
                            if (activeTab === 'angkatan') return hasRole(['Developer', 'Admin']);
                            if (activeMemberTab === 'Administration') return hasRole(['Developer', 'Admin']);
                            if (activeMemberTab === 'AnggotaLainnya') return hasRole(['Developer', 'Admin']);
                            if (activeMemberTab === 'Demisioner') return hasRole(['Developer', 'Admin']);
                            if (activeMemberTab === 'MyBatch') return hasRole('User');
                            return hasRole(['Developer', 'Admin']);
                        })() && (
                                <Button className="w-full sm:w-auto shrink-0" onClick={activeTab === 'anggota' ? handleAddMember : handleAddBatch}>
                                    <Plus className="mr-2 h-4 w-4" /> Tambah {activeTab === 'anggota' ? 'Anggota' : 'Angkatan'}
                                </Button>
                            )}
                    </div>
                </div>

                {/* Main Tabs Content Container */}
                <Tabs value={activeTab} className="w-full">
                    {/* TAB ANGGOTA */}
                    <TabsContent value="anggota">
                        <div className="rounded-md border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Foto</TableHead>
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSortMember('name')}>
                                                Nama Anggota
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSortMember('major_id')}>
                                                Jurusan
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        {showPeriodeJabatan && (
                                            <>
                                                <TableHead>
                                                    <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSortMember('periode')}>
                                                        Periode
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead>
                                                    <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSortMember('position_id')}>
                                                        Jabatan
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                            </>
                                        )}
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSortMember('batch_year')}>
                                                Tahun
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSortMember('batch_name')}>
                                                Nama Angkatan
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={showPeriodeJabatan ? 8 : 6} className="text-center h-24 text-muted-foreground">
                                                Belum ada anggota.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredMembers.map((member) => (
                                            <TableRow key={member.id} className="transition-colors hover:bg-muted/50">
                                                <TableCell>
                                                    <img
                                                        src={member.image ? member.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                                                        alt={member.name}
                                                        className="h-10 w-10 min-w-10 min-h-10 shrink-0 rounded-full object-cover border"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                <TableCell>{member.major ? `${member.major.degree ? member.major.degree + ' - ' : ''}${member.major.name_id}` : member.major_id}</TableCell>
                                                {showPeriodeJabatan && (
                                                    <>
                                                        <TableCell>{member.periode || '-'}</TableCell>
                                                        <TableCell>{member.position_id || '-'}</TableCell>
                                                    </>
                                                )}
                                                <TableCell>{member.batch?.year}</TableCell>
                                                <TableCell>{member.batch?.name_id}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2 items-center">
                                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" size="sm" onClick={() => { setViewingMember(member); setIsViewSheetOpen(true); }}>
                                                            <Eye className="h-4 w-4 lg:mr-1" />
                                                            <span className="hidden lg:inline">Lihat</span>
                                                        </Button>
                                                        {(() => {
                                                            if (hasRole('Developer')) return true;
                                                            if (hasRole('Admin')) {
                                                                return member.type === 'Pengurus' && member.status === 'Active';
                                                            }
                                                            if (hasRole('User')) {
                                                                if (activeMemberTab !== 'MyBatch') return false;
                                                                if (member.batch_id !== userBatch?.id) return false;
                                                                return member.status === 'Deactive';
                                                            }
                                                            return false;
                                                        })() && (
                                                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" size="sm" onClick={() => handleEditMember(member)}>
                                                                <Edit className="h-4 w-4 mr-1 md:mr-0 lg:mr-1" />
                                                                <span className="hidden lg:inline">Edit</span>
                                                            </Button>
                                                        )}
                                                        {(() => {
                                                            if (hasRole('Developer')) return true;
                                                            if (hasRole('Admin')) {
                                                                return member.type === 'Pengurus' && member.status === 'Active';
                                                            }
                                                            if (hasRole('User')) {
                                                                if (activeMemberTab !== 'MyBatch') return false;
                                                                if (member.batch_id !== userBatch?.id) return false;
                                                                return member.status === 'Deactive';
                                                            }
                                                            return false;
                                                        })() && (
                                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteMember(member.id)}>
                                                                <Trash2 className="h-4 w-4 mr-1 md:mr-0 lg:mr-1" />
                                                                <span className="hidden lg:inline">Hapus</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>


                    {/* TAB ANGKATAN */}
                    <TabsContent value="angkatan">
                        <div className="rounded-md border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSortBatch('year')}>
                                                Tahun
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent" onClick={() => handleSortBatch('name_id')}>
                                                Nama Angkatan
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBatches.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                                Belum ada angkatan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBatches.map((b) => (
                                            <TableRow key={b.id}>
                                                <TableCell className="font-medium">{b.year}</TableCell>
                                                <TableCell>{b.name_id}</TableCell>
                                                <TableCell>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === 'Deactive' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}>
                                                        {b.status === 'Deactive' ? 'Deactive' : 'Active'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                            size="sm"
                                                            onClick={() => handleEditBatch(b)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-1 md:mr-0 lg:mr-1" />
                                                            <span className="hidden lg:inline">Edit</span>
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteBatch(b.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1 md:mr-0 lg:mr-1" />
                                                            <span className="hidden lg:inline">Hapus</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* MODAL ANGKATAN */}
                <Dialog open={isBatchModalOpen} onOpenChange={(open) => !open && handleCancelEditBatch()}>
                    <DialogContent className="w-[90%] max-w-[360px] rounded-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingBatch ? 'Edit Angkatan' : 'Tambah Angkatan Baru'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmitBatch} className="space-y-4 pt-4 max-h-[75vh] overflow-y-auto no-scrollbar px-1">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tahun Angkatan</label>
                                <Input
                                    placeholder="Cth: 2024"
                                    value={batchData.year}
                                    onChange={e => setBatchData('year', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Angkatan</label>
                                <Input
                                    placeholder="Cth: Purnawirawan"
                                    value={batchData.name_id}
                                    onChange={e => setBatchData('name_id', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={batchData.status}
                                    onChange={e => setBatchData('status', e.target.value as any)}
                                    required
                                >
                                    <option value="Active">Active (Mahasiswa)</option>
                                    <option value="Deactive">Deactive (Alumni)</option>
                                </select>
                            </div>

                            {/* Jika sedang edit, tampilkan opsional ubah kredensial */}
                            {editingBatch && (
                                <div className="pt-4 mt-4 border-t border-border/50 space-y-4">
                                    <p className="text-xs text-muted-foreground">
                                        Opsional: Isi kolom di bawah jika ingin mengubah akses akun untuk angkatan ini. (Biarkan kosong jika tidak diubah)
                                    </p>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Username Baru</label>
                                        <Input
                                            placeholder="Biarkan kosong untuk skip"
                                            value={batchData.username}
                                            onChange={e => setBatchData('username', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Password Baru</label>
                                        <Input
                                            type="password"
                                            placeholder="Biarkan kosong untuk skip"
                                            value={batchData.password}
                                            onChange={e => setBatchData('password', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelEditBatch}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processingBatch}
                                >
                                    {editingBatch ? 'Simpan Perubahan' : 'Buat Angkatan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* DELETE CONFIRMATION DIALOG */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) setBatchToDelete(null);
                }}>
                    <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Angkatan</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-[14px] mt-2 mb-4 text-foreground/80">
                                Apakah Anda yakin? Tindakan ini akan menghapus data angkatan beserta seluruh anggota di dalamnya.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-row justify-center gap-3 mt-2">
                            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-10 text-sm font-medium">
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteBatch} className="w-24 h-10 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Hapus
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                {/* MODAL ANGGOTA */}
                <Dialog open={isMemberModalOpen} onOpenChange={(open) => !open && handleCancelEditMember()}>
                    <DialogContent className="w-[90%] max-w-[500px] rounded-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingMember ? 'Edit Anggota' : 'Tambah Anggota Baru'}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmitMember} className="space-y-4 pt-4 max-h-[75vh] overflow-y-auto no-scrollbar px-1">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Anggota</label>
                                <Input
                                    placeholder="Nama Lengkap"
                                    value={memberData.name}
                                    onChange={e => setMemberData('name', e.target.value)}
                                    required
                                />
                                {memberErrors.name && <span className="text-xs text-red-500">{memberErrors.name}</span>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Fakultas</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedFaculty}
                                        onChange={e => {
                                            setSelectedFaculty(e.target.value);
                                            setMemberData('major_id', '');
                                        }}
                                        required
                                    >
                                        <option value="" disabled>Pilih Fakultas</option>
                                        {faculties.map(faculty => (
                                            <option key={faculty} value={faculty}>{faculty}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Program Studi</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={memberData.major_id}
                                        onChange={e => setMemberData('major_id', e.target.value)}
                                        required
                                        disabled={!selectedFaculty}
                                    >
                                        <option value="" disabled>Pilih Program Studi</option>
                                        {availableMajors.map(m => (
                                            <option key={m.id} value={m.id}>{m.degree ? `${m.degree} - ` : ''}{m.name_id}</option>
                                        ))}
                                    </select>
                                    {memberErrors.major_id && <span className="text-xs text-red-500 mt-1 block">{memberErrors.major_id}</span>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Angkatan</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={memberData.batch_id}
                                    onChange={e => {
                                        const selectedId = e.target.value;
                                        const targetB = batches.find(b => b.id.toString() === selectedId);
                                        const isDeactive = targetB?.status === 'Deactive';
                                        setMemberData(data => ({
                                            ...data,
                                            batch_id: selectedId,
                                            type: isDeactive ? 'Demisioner' : 'Pengurus',
                                            status: isDeactive ? 'Deactive' : '' as any,
                                            position_id: ''
                                        }));
                                    }}
                                    required
                                    disabled={activeMemberTab === 'MyBatch'}
                                >
                                    <option value="" disabled>Pilih Angkatan</option>
                                    {batches.map(b => (
                                        <option key={b.id} value={b.id}>{b.year} - {b.name_id}</option>
                                    ))}
                                </select>
                                {memberErrors.batch_id && <span className="text-xs text-red-500">{memberErrors.batch_id}</span>}
                            </div>

                            {(() => {
                                const selectedBatch = batches.find(b => b.id.toString() === memberData.batch_id);
                                const isDeactiveBatch = selectedBatch?.status === 'Deactive';

                                if (isDeactiveBatch) {
                                    return (
                                        <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground">
                                            Status anggota otomatis di-lock sebagai <b>Demisioner / Alumni</b> karena angkatan ini berstatus Deactive.
                                        </div>
                                    );
                                }

                                 let orgStatusValue = '';
                                if (memberData.status === 'Active') {
                                    orgStatusValue = 'Kepengurusan';
                                } else if (memberData.position_id === 'Anggota Biasa') {
                                    orgStatusValue = 'Anggota Biasa';
                                } else if (memberData.position_id === 'Anggota Baru') {
                                    orgStatusValue = 'Anggota Baru';
                                }

                                return (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Status Organisasi</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={orgStatusValue}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (val === 'Kepengurusan') {
                                                        setMemberData(data => ({
                                                            ...data,
                                                            status: 'Active',
                                                            position_id: data.position_id === 'Anggota Biasa' || data.position_id === 'Anggota Baru' ? '' : data.position_id
                                                        }));
                                                    } else if (val === 'Anggota Biasa') {
                                                        setMemberData(data => ({
                                                            ...data,
                                                            status: 'Deactive',
                                                            position_id: 'Anggota Biasa'
                                                        }));
                                                    } else if (val === 'Anggota Baru') {
                                                        setMemberData(data => ({
                                                            ...data,
                                                            status: 'Deactive',
                                                            position_id: 'Anggota Baru'
                                                        }));
                                                    }
                                                }}
                                                required
                                            >
                                                <option value="" disabled>Pilih Status</option>
                                                <option value="Kepengurusan">Kepengurusan</option>
                                                <option value="Anggota Biasa">Anggota Biasa</option>
                                                <option value="Anggota Baru">Anggota Baru</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Periode Kepengurusan</label>
                                            <Input
                                                placeholder="Contoh: 2025 - 2026"
                                                value={memberData.periode}
                                                onChange={e => setMemberData('periode', e.target.value)}
                                                required
                                            />
                                            {memberErrors.periode && <span className="text-xs text-red-500">{memberErrors.periode}</span>}
                                        </div>

                                        {orgStatusValue === 'Kepengurusan' && (
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Jabatan</label>
                                                <Input
                                                    placeholder="Contoh: Ketua Umum / Kadep SBD"
                                                    value={memberData.position_id}
                                                    onChange={e => setMemberData('position_id', e.target.value)}
                                                    required
                                                />
                                                {memberErrors.position_id && <span className="text-xs text-red-500">{memberErrors.position_id}</span>}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                            <div>
                                <label className="block text-sm font-medium mb-1">Foto Profile (Opsional)</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setMemberData('image', e.target.files ? e.target.files[0] : null)}
                                />
                                {memberErrors.image && <span className="text-xs text-red-500">{memberErrors.image}</span>}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCancelEditMember}>Batal</Button>
                                <Button type="submit" disabled={processingMember}>Simpan</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* DELETE CONFIRMATION DIALOG ANGGOTA */}
                <AlertDialog open={isDeleteMemberDialogOpen} onOpenChange={(open) => {
                    setIsDeleteMemberDialogOpen(open);
                    if (!open) setMemberToDelete(null);
                }}>
                    <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Anggota</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-[14px] mt-2 mb-4 text-foreground/80">
                                Apakah Anda yakin? Tindakan ini akan menghapus data anggota secara permanen.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-row justify-center gap-3 mt-2">
                            <AlertDialogCancel className="w-24 mt-0 border border-border bg-background hover:bg-muted text-foreground rounded-lg h-10 text-sm font-medium">
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteMember} className="w-24 h-10 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Hapus
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                {/* SHEET LIHAT ANGGOTA */}
                <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
                    <SheetContent className="overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle>Detail Anggota</SheetTitle>
                            <SheetDescription>
                                Informasi lengkap anggota UKM Lises.
                            </SheetDescription>
                        </SheetHeader>
                        {viewingMember && (
                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <img
                                        src={viewingMember.image ? viewingMember.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(viewingMember.name)}&background=random`}
                                        alt={viewingMember.name}
                                        className="w-32 h-32 min-w-32 min-h-32 shrink-0 rounded-full object-cover border-4 border-muted"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Nama Lengkap</h4>
                                        <p className="text-md font-medium">{viewingMember.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Program Studi</h4>
                                        <p className="text-md font-medium">{viewingMember.major ? `${viewingMember.major.degree ? viewingMember.major.degree + ' - ' : ''}${viewingMember.major.name_id}` : viewingMember.major_id}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Angkatan Tahun <b>{viewingMember.batch?.year}</b></h4>
                                        <p className="text-md font-medium">{viewingMember.batch?.name_id}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                        <p className="text-md font-medium">
                                            {viewingMember.type === 'Pengurus' ? 'Kepengurusan' : 'Demisioner'}
                                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${viewingMember.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {viewingMember.status}
                                            </span>
                                        </p>
                                    </div>
                                    {viewingMember.type === 'Pengurus' && (
                                        <>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground">Periode</h4>
                                                <p className="text-md font-medium">{viewingMember.periode || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground">Jabatan</h4>
                                                <p className="text-md font-medium">{viewingMember.position_id || '-'}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </AdminLayout>
    );
}
