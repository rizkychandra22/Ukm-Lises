import { useState, useMemo } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from "@admin/Layouts/AppLayout";
import { route } from "../Lib/Route";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Loader2,
    Save,
    CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// --- Types ---
type EventItem = {
    id: number;
    title_id: string;
    title_en?: string;
    image?: string | null;
    summary_id?: string | null;
    summary_en?: string | null;
    type: 'Exclusive' | 'Non-Exclusive';
    date: string;
    location_id: string;
    location_en?: string;
    price?: number | null;
    ticket?: number | null;
    sold_tickets?: number;
    remaining_tickets?: number | null;
    status: 'draft' | 'published' | 'cancelled' | 'completed';
};

type PayOrder = {
    id: number;
    order_code: string;
    name: string;
    email: string;
    phone: string;
    event_id: number;
    qty: number;
    total_price: number;
    notes?: string | null;
    payment_method?: string | null;
    payment_proof?: string | null;
    order_method: 'online' | 'offline';
    status: 'pending' | 'success' | 'cancelled';
    event?: EventItem;
};

type BatchMemberSelect = {
    id: number;
    name: string;
};

type PayAccount = {
    id: number;
    batch_member_id: number;
    type: 'bank' | 'e-wallet';
    name_account: string;
    no_account: string;
    batch_member?: BatchMemberSelect;
};

type Props = {
    events: EventItem[];
    orders: PayOrder[];
    accounts: PayAccount[];
    members: BatchMemberSelect[];
};

export default function IndexEvent({ events = [], orders = [], accounts = [], members = [] }: Props) {
    const { auth } = usePage<any>().props;
    const user = auth.user;

    const hasRole = (roleNames: string | string[]) => {
        if (!user?.roles) return false;
        if (Array.isArray(roleNames)) {
            return roleNames.some((role: string) => user.roles?.includes(role));
        }
        return user.roles.includes(roleNames);
    };

    // --- State Main Tab ---
    const [activeTab, setActiveTab] = useState("event");

    // --- State Search ---
    const [searchQuery, setSearchQuery] = useState("");

    // --- State View Detail Sheet ---
    const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);
    const [viewingOrder, setViewingOrder] = useState<PayOrder | null>(null);
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

    // =========================================================================
    //  1. EVENT MANAGEMENT STATES & HANDLERS
    // =========================================================================
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
    const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);
    const [eventDateInput, setEventDateInput] = useState('');
    const [eventTimeInput, setEventTimeInput] = useState('');

    const {
        data: eventData,
        setData: setEventData,
        post: postEvent,
        delete: deleteEventReq,
        reset: resetEvent,
        processing: processingEvent,
        errors: eventErrors
    } = useForm({
        title_id: '',
        title_en: '',
        image: null as File | null,
        summary_id: '',
        summary_en: '',
        type: 'Non-Exclusive' as 'Exclusive' | 'Non-Exclusive',
        date: '',
        location_id: '',
        location_en: '',
        price: '',
        ticket: '',
        status: 'published' as 'draft' | 'published' | 'cancelled' | 'completed',
        _method: 'post'
    });

    const isExclusiveEvent = eventData.type === 'Exclusive';

    const formatDateInput = (value?: string | null) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const formatTimeInput = (value?: string | null) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const normalizeDateTime = (dateValue: string, timeValue: string) => {
        if (!dateValue || !timeValue) return dateValue || '';
        return `${dateValue} ${timeValue}:00`;
    };

    const handleAddEvent = () => {
        setEditingEvent(null);
        resetEvent();
        setEventDateInput('');
        setEventTimeInput('');
        setEventData(data => ({
            ...data,
            type: 'Non-Exclusive',
            date: '',
            status: 'published',
            _method: 'post'
        }));
        setIsEventModalOpen(true);
    };

    const handleEditEvent = (event: EventItem) => {
        setEditingEvent(event);
        setEventDateInput(formatDateInput(event.date));
        setEventTimeInput(formatTimeInput(event.date));
        setEventData({
            title_id: event.title_id || '',
            title_en: event.title_en || '',
            image: null,
            summary_id: event.summary_id || '',
            summary_en: event.summary_en || '',
            type: event.type || 'Non-Exclusive',
            date: formatDateInput(event.date),
            location_id: event.location_id || '',
            location_en: event.location_en || '',
            price: event.price !== null && event.price !== undefined ? event.price.toString() : '',
            ticket: event.ticket !== null && event.ticket !== undefined ? event.ticket.toString() : '',
            status: event.status || 'published',
            _method: 'put'
        });
        setIsEventModalOpen(true);
    };

    const handleCancelEditEvent = () => {
        setEditingEvent(null);
        setEventDateInput('');
        setEventTimeInput('');
        resetEvent();
        setIsEventModalOpen(false);
    };

    const handleSubmitEvent = (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = editingEvent
            ? route('events.update', editingEvent.id)
            : route('events.store');

        if (eventData.type === 'Non-Exclusive') {
            setEventData('price', '');
            setEventData('ticket', '');
        }

        const fullDate = normalizeDateTime(eventDateInput, eventTimeInput);
        setEventData('date', fullDate);

        if (editingEvent) {
            setEventData('_method', 'put');
            postEvent(endpoint, {
                onSuccess: () => {
                    handleCancelEditEvent();
                    toast.success('Berhasil memperbarui data event.');
                }
            });
            return;
        }

        setEventData('_method', 'post');
        postEvent(endpoint, {
            onSuccess: () => {
                handleCancelEditEvent();
                toast.success('Berhasil menambahkan data event.');
            }
        });
    };

    const handleDeleteEvent = (id: number) => {
        setEventToDelete(id);
        setIsDeleteEventDialogOpen(true);
    };

    const confirmDeleteEvent = () => {
        if (eventToDelete) {
            deleteEventReq(route('events.destroy', eventToDelete), {
                onSuccess: () => {
                    setIsDeleteEventDialogOpen(false);
                    setEventToDelete(null);
                    toast.success('Berhasil menghapus data event.');
                }
            });
        }
    };

    // =========================================================================
    //  2. ORDER MANAGEMENT STATES & HANDLERS
    // =========================================================================
    const [isOrderStatusModalOpen, setIsOrderStatusModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<PayOrder | null>(null);
    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

    const {
        data: orderData,
        setData: setOrderData,
        put: putOrder,
        delete: deleteOrderReq,
        processing: processingOrder,
    } = useForm({
        status: 'pending' as 'pending' | 'success' | 'cancelled'
    });

    const handleEditOrderStatus = (order: PayOrder) => {
        setEditingOrder(order);
        setOrderData('status', order.status);
        setIsOrderStatusModalOpen(true);
    };

    const handleSubmitOrderStatus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;

        putOrder(route('orders.update-status', editingOrder.id), {
            onSuccess: () => {
                setIsOrderStatusModalOpen(false);
                setEditingOrder(null);
                toast.success('Berhasil memperbarui status pesanan tiket.');
            }
        });
    };

    const handleDeleteOrder = (id: number) => {
        setOrderToDelete(id);
        setIsDeleteOrderDialogOpen(true);
    };

    const confirmDeleteOrder = () => {
        if (orderToDelete) {
            deleteOrderReq(route('orders.destroy', orderToDelete), {
                onSuccess: () => {
                    setIsDeleteOrderDialogOpen(false);
                    setOrderToDelete(null);
                    toast.success('Berhasil menghapus data pesanan.');
                }
            });
        }
    };

    // =========================================================================
    //  2b. OFFLINE ORDER CREATION STATES & HANDLERS
    // =========================================================================
    const [isOfflineOrderModalOpen, setIsOfflineOrderModalOpen] = useState(false);

    const {
        data: offlineOrderData,
        setData: setOfflineOrderData,
        post: postOfflineOrder,
        reset: resetOfflineOrder,
        processing: processingOfflineOrder,
        errors: offlineOrderErrors,
    } = useForm({
        event_id: '' as string,
        name: '',
        phone: '',
        email: '',
        qty: '1',
        payment_method: 'Cash',
        notes: '',
    });

    const handleAddOfflineOrder = () => {
        resetOfflineOrder();
        setIsOfflineOrderModalOpen(true);
    };

    const handleSubmitOfflineOrder = (e: React.FormEvent) => {
        e.preventDefault();
        postOfflineOrder(route('orders.store'), {
            onSuccess: () => {
                setIsOfflineOrderModalOpen(false);
                resetOfflineOrder();
                toast.success('Pesanan tiket offline berhasil dicatat!');
            }
        });
    };

    // =========================================================================
    //  3. BANK ACCOUNT STATES & HANDLERS
    // =========================================================================
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<PayAccount | null>(null);
    const [isDeleteBankDialogOpen, setIsDeleteBankDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<number | null>(null);

    const {
        data: accountData,
        setData: setAccountData,
        post: postAccount,
        put: putAccount,
        delete: deleteAccountReq,
        reset: resetAccount,
        processing: processingAccount,
        errors: accountErrors
    } = useForm({
        batch_member_id: '',
        type: 'bank' as 'bank' | 'e-wallet',
        name_account: '',
        no_account: ''
    });

    const handleAddAccount = () => {
        setEditingAccount(null);
        resetAccount();
        setIsBankModalOpen(true);
    };

    const handleEditAccount = (account: PayAccount) => {
        setEditingAccount(account);
        setAccountData({
            batch_member_id: account.batch_member_id.toString(),
            type: account.type,
            name_account: account.name_account,
            no_account: account.no_account
        });
        setIsBankModalOpen(true);
    };

    const handleCancelEditAccount = () => {
        setEditingAccount(null);
        resetAccount();
        setIsBankModalOpen(false);
    };

    const handleSubmitAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAccount) {
            putAccount(route('accounts.update', editingAccount.id), {
                onSuccess: () => {
                    handleCancelEditAccount();
                    toast.success('Berhasil memperbarui data rekening.');
                }
            });
        } else {
            postAccount(route('accounts.store'), {
                onSuccess: () => {
                    handleCancelEditAccount();
                    toast.success('Berhasil menambahkan rekening baru.');
                }
            });
        }
    };

    const handleDeleteAccount = (id: number) => {
        setAccountToDelete(id);
        setIsDeleteBankDialogOpen(true);
    };

    const confirmDeleteAccount = () => {
        if (accountToDelete) {
            deleteAccountReq(route('accounts.destroy', accountToDelete), {
                onSuccess: () => {
                    setIsDeleteBankDialogOpen(false);
                    setAccountToDelete(null);
                    toast.success('Berhasil menghapus data rekening.');
                }
            });
        }
    };

    // =========================================================================
    //  FILTERED DATA MEMOIZATION
    // =========================================================================
    const filteredEvents = useMemo(() => {
        if (!searchQuery) return events;
        const q = searchQuery.toLowerCase();
        return events.filter(e =>
            e.title_id.toLowerCase().includes(q) ||
            e.location_id.toLowerCase().includes(q) ||
            e.type.toLowerCase().includes(q)
        );
    }, [events, searchQuery]);

    const filteredOrders = useMemo(() => {
        if (!searchQuery) return orders;
        const q = searchQuery.toLowerCase();
        return orders.filter(o =>
            o.order_code.toLowerCase().includes(q) ||
            o.name.toLowerCase().includes(q) ||
            o.email.toLowerCase().includes(q) ||
            (o.event?.title_id || '').toLowerCase().includes(q)
        );
    }, [orders, searchQuery]);

    const filteredAccounts = useMemo(() => {
        if (!searchQuery) return accounts;
        const q = searchQuery.toLowerCase();
        return accounts.filter(a =>
            a.name_account.toLowerCase().includes(q) ||
            a.no_account.toLowerCase().includes(q) ||
            (a.batch_member?.name || '').toLowerCase().includes(q)
        );
    }, [accounts, searchQuery]);

    // Format IDR Helper
    const formatIDR = (amount?: number | null) => {
        if (amount === null || amount === undefined || amount === 0) return 'Gratis';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <DashboardLayout>
            <Head title="Kelola Event & Tiket" />

            <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
                {/* Header Section */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">Manajemen Event & Tiket</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Kelola data Event, Verifikasi Pesanan Tiket, dan Rekening Pembayaran
                    </p>
                </div>

                {/* Tabs Row (Shadcn Underline Style) */}
                <div className="w-full border-b border-border">
                    <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
                        {!hasRole(['User']) && (
                            <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setSearchQuery(''); }}>
                                <TabsList className="flex h-auto p-0 bg-transparent gap-4 justify-start rounded-none border-none">
                                    <TabsTrigger
                                        value="event"
                                        className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                                    >
                                        Event
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="order"
                                        className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                                    >
                                        Pesanan Tiket
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="bank"
                                        className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                                    >
                                        Rekening Bank
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        )}
                    </div>
                </div>

                {/* Controls Row (Search Box & Add Button) */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={
                                activeTab === 'event' ? "Cari judul event atau lokasi..." :
                                activeTab === 'order' ? "Cari kode order atau pemesan..." : "Cari bank atau nama pemilik..."
                            }
                            className="pl-9 h-8 bg-muted/50 border border-border/60 rounded-lg text-[13px] shadow-none focus:bg-background transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {hasRole(['Developer', 'Admin']) && (
                        <Button
                            size="sm"
                            className="h-8 px-3.5 rounded-lg text-[13px] font-medium w-full sm:w-auto shrink-0 shadow-sm"
                            onClick={
                                activeTab === 'event' ? handleAddEvent :
                                activeTab === 'order' ? handleAddOfflineOrder :
                                handleAddAccount
                            }
                        >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            {activeTab === 'event' ? 'Tambah Event' : activeTab === 'order' ? 'Pesanan Offline' : 'Tambah Rekening'}
                        </Button>
                    )}
                </div>

                {/* Tab Content Wrapper */}
                <Tabs value={activeTab} className="w-full">
                    {/* TAB CONTENT: EVENT */}
                    <TabsContent value="event" className="mt-0">
                        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm">Banner</TableHead>
                                        <TableHead className="text-sm">Judul</TableHead>
                                        <TableHead className="text-sm">Tipe</TableHead>
                                        <TableHead className="text-sm">Tanggal</TableHead>
                                        <TableHead className="text-sm">Harga</TableHead>
                                        <TableHead className="text-sm">Tiket</TableHead>
                                        <TableHead className="text-sm">Status</TableHead>
                                        <TableHead className="text-right text-sm">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEvents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center h-24 text-sm text-muted-foreground">
                                                Belum ada data event.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEvents.map((item) => (
                                            <TableRow key={item.id} className="transition-colors">
                                                <TableCell>
                                                    <img
                                                        src={item.image ? item.image : '/placeholder-event.webp'}
                                                        alt={item.title_id}
                                                        className="h-10 w-16 shrink-0 rounded object-cover border"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">{item.title_id}</TableCell>
                                                <TableCell>
                                                    <span className={item.type === 'Exclusive'
                                                        ? 'inline-flex items-center px-2.5 py-1 rounded-[8px] text-[10px] font-semibold bg-violet-500/10 text-violet-700'
                                                        : 'inline-flex items-center px-2.5 py-1 rounded-[8px] text-[10px] font-semibold bg-sky-500/10 text-sky-700'}>
                                                        {item.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm">{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                <TableCell className="text-sm font-medium">{formatIDR(item.price)}</TableCell>
                                                <TableCell className="text-sm font-medium">
                                                    {item.ticket ? `${item.remaining_tickets ?? item.ticket} / ${item.ticket}` : 'Unlimited'}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                                        item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-700' :
                                                        item.status === 'published' ? 'bg-sky-500/10 text-sky-700' :
                                                        item.status === 'draft' ? 'bg-amber-500/10 text-amber-700' :
                                                        'bg-rose-500/10 text-rose-700'
                                                    }`}>
                                                        {item.status === 'completed' ? 'Completed' :
                                                         item.status === 'published' ? 'Published' :
                                                         item.status === 'draft' ? 'Draft' :
                                                         'Cancelled'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2 items-center">
                                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 w-8 p-0" size="sm" onClick={() => { setViewingEvent(item); setViewingOrder(null); setIsViewSheetOpen(true); }} title="Lihat Detail">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {hasRole(['Developer', 'Admin']) && (
                                                            <>
                                                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0" size="sm" onClick={() => handleEditEvent(item)} title="Edit Event">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="destructive" size="sm" className="rounded-lg h-8 w-8 p-0" onClick={() => handleDeleteEvent(item.id)} title="Hapus Event">
                                                                    <Trash2 className="h-4 w-4" />
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

                    {/* TAB CONTENT: PESANAN TIKET (ORDER) */}
                    <TabsContent value="order" className="mt-0">
                        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm">Kode Order</TableHead>
                                        <TableHead className="text-sm">Pemesan</TableHead>
                                        <TableHead className="text-sm">Event</TableHead>
                                        <TableHead className="text-sm">Qty</TableHead>
                                        <TableHead className="text-sm">Total Harga</TableHead>
                                        <TableHead className="text-sm">Status Tiket</TableHead>
                                        <TableHead className="text-right text-sm">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24 text-sm text-muted-foreground">
                                                Belum ada transaksi pemesanan tiket.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((ord) => (
                                            <TableRow key={ord.id} className="transition-colors">
                                                <TableCell className="font-mono font-semibold text-sm">{ord.order_code}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{ord.name}</span>
                                                        <span className="text-xs text-muted-foreground">{ord.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">{ord.event?.title_id || '-'}</TableCell>
                                                <TableCell className="text-sm font-medium">{ord.qty} Tiket</TableCell>
                                                <TableCell className="font-medium text-sm">{formatIDR(ord.total_price)}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                                        ord.status === 'success' ? 'bg-emerald-500/10 text-emerald-700' :
                                                        ord.status === 'pending' ? 'bg-amber-500/10 text-amber-700' : 'bg-rose-500/10 text-rose-700'
                                                    }`}>
                                                        {ord.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2 items-center">
                                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 w-8 p-0" size="sm" onClick={() => { setViewingOrder(ord); setViewingEvent(null); setIsViewSheetOpen(true); }} title="Lihat Bukti Bayar & Detail">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {hasRole(['Developer', 'Admin']) && (
                                                            <>
                                                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0" size="sm" onClick={() => handleEditOrderStatus(ord)} title="Ubah Status Tiket">
                                                                    <CheckCircle className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="destructive" size="sm" className="rounded-lg h-8 w-8 p-0" onClick={() => handleDeleteOrder(ord.id)} title="Hapus Order">
                                                                    <Trash2 className="h-4 w-4" />
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

                    {/* TAB CONTENT: REKENING BANK */}
                    <TabsContent value="bank" className="mt-0">
                        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm">Tipe</TableHead>
                                        <TableHead className="text-sm">Nama Bank / Platform</TableHead>
                                        <TableHead className="text-sm">Nomor Rekening</TableHead>
                                        <TableHead className="text-sm">Atas Nama / Bendahara</TableHead>
                                        <TableHead className="text-right text-sm">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAccounts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24 text-sm text-muted-foreground">
                                                Belum ada data rekening pembayaran.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredAccounts.map((acc) => (
                                            <TableRow key={acc.id} className="transition-colors">
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${acc.type === 'bank' ? 'bg-blue-500/10 text-blue-700' : 'bg-emerald-500/10 text-emerald-700'}`}>
                                                        {acc.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-semibold text-sm">{acc.name_account}</TableCell>
                                                <TableCell className="text-sm font-medium">{acc.no_account}</TableCell>
                                                <TableCell className="text-sm">{acc.batch_member?.name || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2 items-center">
                                                        {hasRole(['Developer', 'Admin']) && (
                                                            <>
                                                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 w-8 p-0" size="sm" onClick={() => handleEditAccount(acc)} title="Edit Rekening">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="destructive" size="sm" className="rounded-lg h-8 w-8 p-0" onClick={() => handleDeleteAccount(acc.id)} title="Hapus Rekening">
                                                                    <Trash2 className="h-4 w-4" />
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
                </Tabs>

                {/* =========================================================
                    MODAL EVENT (ADD / EDIT)
                   ========================================================= */}
                <Dialog open={isEventModalOpen} onOpenChange={(open) => !open && handleCancelEditEvent()}>
                    <DialogContent className="w-[90%] max-w-[550px] rounded-md">
                        <DialogHeader>
                            <DialogTitle>{editingEvent ? 'Edit Data Event' : 'Tambah Event Baru'}</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmitEvent} className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto no-scrollbar px-1">
                            <div>
                                <label className="block text-sm font-medium mb-1">Judul Event</label>
                                <Input
                                    className="h-8 text-[13px]"
                                    placeholder="Contoh: Pagelaran Seni Budaya 2026"
                                    value={eventData.title_id}
                                    onChange={e => setEventData('title_id', e.target.value)}
                                    required
                                />
                                {eventErrors.title_id && <span className="text-xs text-red-500">{eventErrors.title_id}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Lokasi Event</label>
                                <Input
                                    className="h-8 text-[13px]"
                                    placeholder="Contoh: Gedung Aula Utama UKM"
                                    value={eventData.location_id}
                                    onChange={e => setEventData('location_id', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tanggal Pelaksanaan</label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            className="h-8 text-[13px] pr-10"
                                            value={eventDateInput}
                                            onChange={e => setEventDateInput(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Jam Pelaksanaan</label>
                                    <div className="relative">
                                        <Input
                                            type="time"
                                            className="h-8 text-[13px] pr-10"
                                            value={eventTimeInput}
                                            onChange={e => setEventTimeInput(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tipe Event</label>
                                    <Select
                                        value={eventData.type}
                                        onValueChange={(val: any) => {
                                            setEventData('type', val);
                                            if (val === 'Non-Exclusive') {
                                                setEventData('price', '');
                                                setEventData('ticket', '');
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-8 text-[13px]">
                                            <SelectValue placeholder="Pilih Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Non-Exclusive">Non-Exclusive</SelectItem>
                                            <SelectItem value="Exclusive">Exclusive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status Publikasi</label>
                                    <Select value={eventData.status} onValueChange={(val: any) => setEventData('status', val)}>
                                        <SelectTrigger className="h-8 text-[13px]">
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {isExclusiveEvent && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Harga Tiket</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            className="h-8 text-[13px]"
                                            placeholder="Cth: 50000"
                                            value={eventData.price}
                                            onChange={e => setEventData('price', e.target.value)}
                                            required={isExclusiveEvent}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Kuota Tiket</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            className="h-8 text-[13px]"
                                            placeholder="Cth: 100"
                                            value={eventData.ticket}
                                            onChange={e => setEventData('ticket', e.target.value)}
                                            required={isExclusiveEvent}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Ringkasan / Deskripsi Event</label>
                                <Textarea
                                    rows={3}
                                    className="text-[13px]"
                                    placeholder="Jelaskan secara singkat mengenai acara ini..."
                                    value={eventData.summary_id}
                                    onChange={e => setEventData('summary_id', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Gambar Banner Event</label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="bg-background text-sm file:text-foreground file:bg-muted file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2"
                                    onChange={e => setEventData('image', e.target.files ? e.target.files[0] : null)}
                                />
                                {eventErrors.image && <span className="text-xs text-red-500">{eventErrors.image}</span>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={handleCancelEditEvent}>Batal</Button>
                                <Button type="submit" size="sm" disabled={processingEvent}>
                                    {processingEvent ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-1" /> Simpan</>}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* =========================================================
                    MODAL UBAH STATUS ORDER
                   ========================================================= */}
                <Dialog open={isOrderStatusModalOpen} onOpenChange={setIsOrderStatusModalOpen}>
                    <DialogContent className="w-[90%] max-w-[380px] rounded-md">
                        <DialogHeader>
                            <DialogTitle>Verifikasi Status Pesanan</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmitOrderStatus} className="space-y-4 pt-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Kode Order: <span className="font-mono font-bold">{editingOrder?.order_code}</span></label>
                                <Select value={orderData.status} onValueChange={(val: any) => setOrderData('status', val)}>
                                    <SelectTrigger className="h-8 text-[13px]">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending (Menunggu Verifikasi)</SelectItem>
                                        <SelectItem value="success">Success (Pembayaran Valid)</SelectItem>
                                        <SelectItem value="cancelled">Cancelled (Dibatalkan / Batal)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => setIsOrderStatusModalOpen(false)}>Batal</Button>
                                <Button type="submit" size="sm" disabled={processingOrder}>
                                    {processingOrder ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Updating...</> : <><Save className="w-4 h-4 mr-1" /> Update Status</>}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* =========================================================
                    MODAL TAMBAH PESANAN OFFLINE
                   ========================================================= */}
                <Dialog open={isOfflineOrderModalOpen} onOpenChange={(open) => { if (!open) { setIsOfflineOrderModalOpen(false); resetOfflineOrder(); } }}>
                    <DialogContent className="w-[90%] max-w-[500px] rounded-md">
                        <DialogHeader>
                            <DialogTitle>Catat Pesanan Tiket Offline</DialogTitle>
                        </DialogHeader>
                        <p className="text-[12px] text-muted-foreground -mt-2 pb-1">
                            Pesanan ini dicatat manual oleh admin. Status otomatis berhasil karena pembayaran diterima langsung.
                        </p>

                        <form onSubmit={handleSubmitOfflineOrder} className="space-y-4 pt-1 max-h-[72vh] overflow-y-auto no-scrollbar px-1">
                            {/* Pilih Event */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Event</label>
                                <Select
                                    value={offlineOrderData.event_id}
                                    onValueChange={val => setOfflineOrderData('event_id', val)}
                                >
                                    <SelectTrigger className="h-8 text-[13px]">
                                        <SelectValue placeholder="Pilih event yang akan dipesan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events
                                            .filter(ev => ev.status === 'published')
                                            .map(ev => (
                                                <SelectItem key={ev.id} value={ev.id.toString()}>
                                                    {ev.title_id} — {new Date(ev.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                {offlineOrderErrors.event_id && <span className="text-xs text-destructive">{offlineOrderErrors.event_id}</span>}
                            </div>

                            {/* Info Pemesan */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nama Pemesan</label>
                                    <Input
                                        className="h-8 text-[13px]"
                                        placeholder="Nama lengkap"
                                        value={offlineOrderData.name}
                                        onChange={e => setOfflineOrderData('name', e.target.value)}
                                        required
                                    />
                                    {offlineOrderErrors.name && <span className="text-xs text-destructive">{offlineOrderErrors.name}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">No. Telepon</label>
                                    <Input
                                        className="h-8 text-[13px] font-mono"
                                        placeholder="Cth: 081234567890"
                                        value={offlineOrderData.phone}
                                        onChange={e => setOfflineOrderData('phone', e.target.value)}
                                        required
                                    />
                                    {offlineOrderErrors.phone && <span className="text-xs text-destructive">{offlineOrderErrors.phone}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <Input
                                        type="email"
                                        className="h-8 text-[13px]"
                                        placeholder="email@example.com"
                                        value={offlineOrderData.email}
                                        onChange={e => setOfflineOrderData('email', e.target.value)}
                                    />
                                    {offlineOrderErrors.email && <span className="text-xs text-destructive">{offlineOrderErrors.email}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Jumlah Tiket</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        className="h-8 text-[13px]"
                                        value={offlineOrderData.qty}
                                        onChange={e => setOfflineOrderData('qty', e.target.value)}
                                        required
                                    />
                                    {offlineOrderErrors.qty && <span className="text-xs text-destructive">{offlineOrderErrors.qty}</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                                <Input
                                    className="h-8 text-[13px]"
                                    placeholder="Cth: Cash, Transfer BCA, QRIS"
                                    value={offlineOrderData.payment_method}
                                    onChange={e => setOfflineOrderData('payment_method', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Catatan</label>
                                <Textarea
                                    rows={2}
                                    className="text-[13px] resize-none"
                                    placeholder="Catatan tambahan..."
                                    value={offlineOrderData.notes}
                                    onChange={e => setOfflineOrderData('notes', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-1">
                                <Button type="button" variant="outline" size="sm" onClick={() => { setIsOfflineOrderModalOpen(false); resetOfflineOrder(); }}>Batal</Button>
                                <Button type="submit" size="sm" disabled={processingOfflineOrder}>
                                    {processingOfflineOrder ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Menyimpan...</> : <><CheckCircle className="w-4 h-4 mr-1" /> Catat Pesanan</>}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* =========================================================
                    MODAL BANK ACCOUNT (ADD / EDIT)
                   ========================================================= */}
                <Dialog open={isBankModalOpen} onOpenChange={(open) => !open && handleCancelEditAccount()}>
                    <DialogContent className="w-[90%] max-w-[420px] rounded-md">
                        <DialogHeader>
                            <DialogTitle>{editingAccount ? 'Edit Rekening Bank' : 'Tambah Rekening Pembayaran'}</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmitAccount} className="space-y-4 pt-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Atas Nama / Bendahara</label>
                                <Select value={accountData.batch_member_id} onValueChange={val => setAccountData('batch_member_id', val)}>
                                    <SelectTrigger className="h-8 text-[13px]">
                                        <SelectValue placeholder="Pilih Anggota / Bendahara" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map(m => (
                                            <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {accountErrors.batch_member_id && <span className="text-xs text-red-500">{accountErrors.batch_member_id}</span>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tipe Akun</label>
                                    <Select value={accountData.type} onValueChange={(val: any) => setAccountData('type', val)}>
                                        <SelectTrigger className="h-8 text-[13px]">
                                            <SelectValue placeholder="Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bank">Bank Transfer</SelectItem>
                                            <SelectItem value="e-wallet">E-Wallet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nama Bank / Wallet</label>
                                    <Input
                                        className="h-8 text-[13px]"
                                        placeholder="Cth: BCA / Dana / GoPay"
                                        value={accountData.name_account}
                                        onChange={e => setAccountData('name_account', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Nomor Rekening / Akun</label>
                                <Input
                                    className="h-8 text-[13px] font-mono"
                                    placeholder="Cth: 1234567890"
                                    value={accountData.no_account}
                                    onChange={e => setAccountData('no_account', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" size="sm" onClick={handleCancelEditAccount}>Batal</Button>
                                <Button type="submit" size="sm" disabled={processingAccount}>
                                    {processingAccount ? <><Loader2 className="w-4 h-4 animate-spin mr-1" /> Menyimpan...</> : <><Save className="w-4 h-4 mr-1" /> Simpan</>}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* =========================================================
                    SHEET DETAIL PREVIEW (EVENT / ORDER)
                   ========================================================= */}
                <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
                    <SheetContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        <SheetHeader className="mb-4">
                            <SheetTitle>{viewingEvent ? 'Detail Event' : 'Detail Pesanan Tiket'}</SheetTitle>
                            <SheetDescription>
                                {viewingEvent ? 'Informasi lengkap acara & pendaftaran.' : 'Verifikasi rincian transaksi & bukti transfer.'}
                            </SheetDescription>
                        </SheetHeader>

                        {viewingEvent && (
                            <div className="space-y-4">
                                <img
                                    src={viewingEvent.image ? viewingEvent.image : '/placeholder-event.webp'}
                                    alt={viewingEvent.title_id}
                                    className="w-full h-44 rounded-lg object-cover border"
                                />
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Judul Event</h4>
                                    <p className="text-base font-semibold">{viewingEvent.title_id}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Tanggal & Waktu</h4>
                                        <p className="text-sm font-medium">{new Date(viewingEvent.date).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Harga Tiket</h4>
                                        <p className="text-sm font-semibold text-emerald-600">{formatIDR(viewingEvent.price)}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Lokasi</h4>
                                    <p className="text-sm font-medium">{viewingEvent.location_id}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Ringkasan</h4>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{viewingEvent.summary_id || '-'}</p>
                                </div>
                            </div>
                        )}

                        {viewingOrder && (
                            <div className="space-y-4">
                                <div className="p-3 bg-muted/40 rounded-lg space-y-1">
                                    <span className="text-xs text-muted-foreground">Kode Pesanan</span>
                                    <p className="text-lg font-mono font-bold text-primary">{viewingOrder.order_code}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs text-muted-foreground">Nama Pemesan</h4>
                                        <p className="text-sm font-medium">{viewingOrder.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-muted-foreground">No. WhatsApp</h4>
                                        <p className="text-sm font-medium">{viewingOrder.phone}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs text-muted-foreground">Jumlah Tiket</h4>
                                        <p className="text-sm font-medium">{viewingOrder.qty} Tiket</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-muted-foreground">Total Transfer</h4>
                                        <p className="text-sm font-semibold text-emerald-600">{formatIDR(viewingOrder.total_price)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs text-muted-foreground mb-1">Bukti Pembayaran / Transfer</h4>
                                    {viewingOrder.payment_proof ? (
                                        <a href={viewingOrder.payment_proof} target="_blank" rel="noreferrer" className="block border rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                                            <img src={viewingOrder.payment_proof} alt="Bukti Transfer" className="w-full max-h-72 object-contain bg-black/5" />
                                            <span className="block text-center text-[11px] py-1 bg-muted text-muted-foreground">Klik untuk membuka gambar penuh</span>
                                        </a>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">Tidak ada bukti pembayaran diunggah.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                {/* =========================================================
                    DELETE DIALOGS
                   ========================================================= */}
                <AlertDialog open={isDeleteEventDialogOpen} onOpenChange={setIsDeleteEventDialogOpen}>
                    <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Event</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-[14px] mt-2 mb-4 text-foreground/80">
                                Yakin ingin menghapus event ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-row justify-center gap-3">
                            <AlertDialogCancel className="w-24 border h-8 text-[13px]">Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteEvent} className="w-24 h-8 text-[13px] bg-destructive text-destructive-foreground">Hapus</AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isDeleteOrderDialogOpen} onOpenChange={setIsDeleteOrderDialogOpen}>
                    <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Pesanan</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-[14px] mt-2 mb-4 text-foreground/80">
                                Yakin ingin menghapus data transaksi ini secara permanen?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-row justify-center gap-3">
                            <AlertDialogCancel className="w-24 border h-8 text-[13px]">Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteOrder} className="w-24 h-8 text-[13px] bg-destructive text-destructive-foreground">Hapus</AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isDeleteBankDialogOpen} onOpenChange={setIsDeleteBankDialogOpen}>
                    <AlertDialogContent className="w-[90%] max-w-[360px] rounded-md p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-lg font-semibold">Hapus Rekening</AlertDialogTitle>
                            <AlertDialogDescription className="text-center text-[14px] mt-2 mb-4 text-foreground/80">
                                Yakin ingin menghapus rekening pembayaran ini?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-row justify-center gap-3">
                            <AlertDialogCancel className="w-24 border h-8 text-[13px]">Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteAccount} className="w-24 h-8 text-[13px] bg-destructive text-destructive-foreground">Hapus</AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    );
}