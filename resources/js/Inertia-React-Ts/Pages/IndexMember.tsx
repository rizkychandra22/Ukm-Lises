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
    year: string;
    name_id: string;
    name_en: string;
};

type BatchMember = {
    id: number;
    batch_id: number;
    image: string | null;
    name: string;
    prodi_id: string;
    prodi_en: string;
    type: 'Administration' | 'Demisioner';
    status: 'Active' | 'Deactive';
    periode: string | null;
    position_id: string | null;
    position_en: string | null;
    batch?: Batch;
};

type Props = {
    members: BatchMember[];
    batches: Batch[];
};

export default function Index({ members, batches }: Props) {
    const { auth } = usePage<any>().props;
    const user = auth.user;

    const hasRole = (roleNames: string | string[]) => {
        if (!user?.roles) return false;
        if (Array.isArray(roleNames)) {
            return roleNames.some((role: string) => user.roles?.includes(role));
        }
        return user.roles.includes(roleNames);
    };

    // --- States ---
    const [viewingMember, setViewingMember] = useState<BatchMember | null>(null);
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("anggota");
    const [activeMemberTab, setActiveMemberTab] = useState("Demisioner");
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

    // Modal State untuk Anggota
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<BatchMember | null>(null);

    // Delete Confirmation State Anggota
    const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

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
        prodi_id: '',
        type: 'Administration',
        periode: '',
        position_id: '',
        _method: 'post'
    });

    // --- Handlers Anggota ---
    const handleAddMember = () => {
        setEditingMember(null);
        resetMember();
        setMemberData('type', activeMemberTab as any);
        setMemberData('_method', 'post');
        setIsMemberModalOpen(true);
    };

    const handleEditMember = (member: BatchMember) => {
        setEditingMember(member);
        setMemberData({
            batch_id: member.batch_id.toString(),
            image: null,
            name: member.name,
            prodi_id: member.prodi_id,
            type: member.type,
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
        return members.filter(m => 
            (m.type === activeMemberTab) &&
            (m.name.toLowerCase().includes(searchMember.toLowerCase()) || 
             m.prodi_id.toLowerCase().includes(searchMember.toLowerCase()))
        );
    }, [members, searchMember, activeMemberTab]);


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
                                <TabsList className="grid grid-cols-2 w-full sm:w-64">
                                    <TabsTrigger value="anggota">Anggota</TabsTrigger>
                                    <TabsTrigger value="angkatan">Angkatan</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        )}

                        {activeTab === 'anggota' && (
                            <Tabs value={activeMemberTab} onValueChange={setActiveMemberTab}>
                                <TabsList className="grid grid-cols-2 w-full sm:w-64">
                                    <TabsTrigger value="Demisioner">Demisioner</TabsTrigger>
                                    <TabsTrigger value="Administration">Kepengurusan</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        )}
                    </div>

                    {/* RIGHT: Search & Add Button */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
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
                            if (activeTab === 'angkatan') return hasRole(['Master', 'Admin']);
                            if (activeMemberTab === 'Administration') return hasRole(['Master', 'Admin']);
                            return hasRole(['Master', 'Admin', 'User']);
                        })() && (
                            <Button className="w-full sm:w-auto" onClick={activeTab === 'anggota' ? handleAddMember : handleAddBatch}>
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
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent">
                                                Nama Anggota
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent">
                                                Jurusan
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        {activeMemberTab !== 'Demisioner' && (
                                            <>
                                                <TableHead>
                                                    <Button variant="ghost" className="-ml-4 hover:bg-transparent">
                                                        Periode
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead>
                                                    <Button variant="ghost" className="-ml-4 hover:bg-transparent">
                                                        Jabatan
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                            </>
                                        )}
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent">
                                                Tahun
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button variant="ghost" className="-ml-4 hover:bg-transparent">
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
                                            <TableCell colSpan={activeMemberTab === 'Administration' ? 8 : 6} className="text-center h-24 text-muted-foreground">
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
                                                    className="h-10 w-10 rounded-full object-cover border" 
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell>{member.prodi_id}</TableCell>
                                            {activeMemberTab !== 'Demisioner' && (
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
                                                    {(activeMemberTab === 'Administration' ? hasRole(['Master', 'Admin']) : hasRole(['Master', 'User'])) && (
                                                        <>
                                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm" onClick={() => handleEditMember(member)}>
                                                                <Edit className="h-4 w-4 mr-1 md:mr-0 lg:mr-1" /> 
                                                                <span className="hidden lg:inline">Edit</span>
                                                            </Button>
                                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteMember(member.id)}>
                                                                <Trash2 className="h-4 w-4 mr-1 md:mr-0 lg:mr-1" /> 
                                                                <span className="hidden lg:inline">Hapus</span>
                                                            </Button>
                                                        </>
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
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            className="bg-blue-600 hover:bg-blue-700 text-white" 
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
                            <div>
                                <label className="block text-sm font-medium mb-1">Program Studi</label>
                                <Input 
                                    placeholder="Program Studi"
                                    value={memberData.prodi_id}
                                    onChange={e => setMemberData('prodi_id', e.target.value)}
                                    required
                                />
                                {memberErrors.prodi_id && <span className="text-xs text-red-500">{memberErrors.prodi_id}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Angkatan</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={memberData.batch_id}
                                    onChange={e => setMemberData('batch_id', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Pilih Angkatan</option>
                                    {batches.map(b => (
                                        <option key={b.id} value={b.id}>{b.year} - {b.name_id}</option>
                                    ))}
                                </select>
                                {memberErrors.batch_id && <span className="text-xs text-red-500">{memberErrors.batch_id}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={memberData.type}
                                    onChange={e => setMemberData('type', e.target.value as any)}
                                    required
                                >
                                    {hasRole(['Master', 'Admin']) && <option value="Administration">Kepengurusan</option>}
                                    <option value="Demisioner">Demisioner</option>
                                </select>
                                {memberErrors.type && <span className="text-xs text-red-500">{memberErrors.type}</span>}
                            </div>
                            {memberData.type === 'Administration' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Periode</label>
                                        <Input 
                                            placeholder="Contoh: 2024-2025"
                                            value={memberData.periode}
                                            onChange={e => setMemberData('periode', e.target.value)}
                                            required
                                        />
                                        {memberErrors.periode && <span className="text-xs text-red-500">{memberErrors.periode}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Jabatan</label>
                                        <Input 
                                            placeholder="Contoh: Ketua Umum"
                                            value={memberData.position_id}
                                            onChange={e => setMemberData('position_id', e.target.value)}
                                            required
                                        />
                                        {memberErrors.position_id && <span className="text-xs text-red-500">{memberErrors.position_id}</span>}
                                    </div>
                                </>
                            )}
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
                                        className="w-32 h-32 rounded-full object-cover border-4 border-muted" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Nama Lengkap</h4>
                                        <p className="font-medium">{viewingMember.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Program Studi</h4>
                                        <p className="font-medium">{viewingMember.prodi_id}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Angkatan {viewingMember.batch?.year}</h4>
                                        <p className="font-medium">{viewingMember.batch?.name_id}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                                        <p className="font-medium">
                                            {viewingMember.type === 'Administration' ? 'Kepengurusan' : 'Demisioner'} 
                                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${viewingMember.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {viewingMember.status}
                                            </span>
                                        </p>
                                    </div>
                                    {viewingMember.type === 'Administration' && (
                                        <>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground">Periode</h4>
                                                <p className="font-medium">{viewingMember.periode || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground">Jabatan</h4>
                                                <p className="font-medium">{viewingMember.position_id || '-'}</p>
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
