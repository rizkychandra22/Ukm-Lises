import { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import DashboardLayout from "@admin/Layouts/AppLayout";
import { route } from "../Lib/Route";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventItem, PayOrder, PayAccount, BatchMemberSelect, EventSession } from "./Feature/Event/Types";
import { EventTable } from "./Feature/Event/Components/EventTable";
import { SessionTable } from "./Feature/Event/Components/SessionTable";
import { SessionFormModal } from "./Feature/Event/Components/SessionFormModal";
import { EventFormModal } from "./Feature/Event/Components/EventFormModal";
import { EventDetailSheet } from "./Feature/Event/Components/EventDetailSheet";
import { EventDeleteDialog } from "./Feature/Event/Components/EventDeleteDialog";
import { OrderTable } from "./Feature/Event/Components/OrderTable";
import { OfflineOrderModal } from "./Feature/Event/Components/OfflineOrderModal";
import { OrderStatusModal } from "./Feature/Event/Components/OrderStatusModal";
import { OrderDetailSheet } from "./Feature/Event/Components/OrderDetailSheet";
import { OrderDeleteDialog } from "./Feature/Event/Components/OrderDeleteDialog";
import { AccountTable } from "./Feature/Event/Components/AccountTable";
import { AccountFormModal } from "./Feature/Event/Components/AccountFormModal";
import { AccountDeleteDialog } from "./Feature/Event/Components/AccountDeleteDialog";
import { CalendarDays } from "lucide-react";

type Props = {
  events: EventItem[];
  orders: PayOrder[];
  accounts: PayAccount[];
  sessions: EventSession[];
  members: BatchMemberSelect[];
};

export default function IndexEvent({
  events = [],
  orders = [],
  accounts = [],
  sessions = [],
  members = [],
}: Props) {
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
  const [activeSessionTab, setActiveSessionTab] = useState("session"); // 'session' or 'payment'

  // --- State Status & Method Filter ---
  const [eventStatusFilter, setEventStatusFilter] = useState<string>("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderMethodFilter, setOrderMethodFilter] = useState<string>("all");

  // --- State View Detail Sheets ---
  const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);
  const [viewingOrder, setViewingOrder] = useState<PayOrder | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  // =========================================================================
  //  EVENT MANAGEMENT STATES & HANDLERS
  // =========================================================================
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [eventDateInput, setEventDateInput] = useState("");

  const {
    data: eventData,
    setData: setEventData,
    delete: deleteEventReq,
    reset: resetEvent,
    processing: processingEvent,
    errors: eventErrors,
    post: postEvent,
    transform: transformEventData,
  } = useForm({
    title_id: "",
    title_en: "",
    image: null as File | null,
    summary_id: "",
    summary_en: "",
    type: "Non-Exclusive" as "Exclusive" | "Non-Exclusive",
    date: "",
    location_id: "",
    location_en: "",
    price: "",
    ticket: "",
    status: "published" as "draft" | "published" | "cancelled" | "completed",
    _method: "post",
  });

  const formatDateInput = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    resetEvent();
    setEventDateInput("");
    setEventData((data) => ({
      ...data,
      type: "Non-Exclusive",
      date: "",
      status: "published",
      _method: "post",
    }));
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setEventDateInput(formatDateInput(event.date));
    // Time is handled in Event Sessions now
    setEventData({
      title_id: event.title_id || "",
      title_en: event.title_en || "",
      image: null,
      summary_id: event.summary_id || "",
      summary_en: event.summary_en || "",
      type: event.type || "Non-Exclusive",
      date: formatDateInput(event.date),
      location_id: event.location_id || "",
      location_en: event.location_en || "",
      price: event.price !== null && event.price !== undefined ? event.price.toString() : "",
      ticket: event.ticket !== null && event.ticket !== undefined ? event.ticket.toString() : "",
      status: event.status || "published",
      _method: "put",
    });
    setIsEventModalOpen(true);
  };

  const handleCancelEditEvent = () => {
    setEditingEvent(null);
    setEventDateInput("");
    resetEvent();
    setIsEventModalOpen(false);
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    transformEventData((data) => ({
      ...data,
      date: eventDateInput,
      ...(data.type === "Non-Exclusive" && { price: "", ticket: "" })
    }));
    const endpoint = editingEvent ? route("events.update", editingEvent.id) : route("events.store");
    
    postEvent(endpoint, {
      preserveScroll: true,
      onSuccess: () => {
        handleCancelEditEvent();
        toast.success(
          editingEvent ? "Berhasil memperbarui data event." : "Berhasil menambahkan data event.",
        );
      },
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEventToDelete(id);
    setIsDeleteEventDialogOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      deleteEventReq(route("events.destroy", eventToDelete), {
        onSuccess: () => {
          setIsDeleteEventDialogOpen(false);
          setEventToDelete(null);
          toast.success("Berhasil menghapus data event.");
        },
      });
    }
  };

  // =========================================================================
  //  ORDER MANAGEMENT STATES & HANDLERS
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
    status: "pending" as "pending" | "success" | "cancelled",
  });

  const handleEditOrderStatus = (order: PayOrder) => {
    setEditingOrder(order);
    setOrderData("status", order.status);
    setIsOrderStatusModalOpen(true);
  };

  const handleSubmitOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    putOrder(route("orders.update-status", editingOrder.id), {
      onSuccess: () => {
        setIsOrderStatusModalOpen(false);
        setEditingOrder(null);
        toast.success("Berhasil memperbarui status pesanan tiket.");
      },
    });
  };

  const handleDeleteOrder = (id: number) => {
    setOrderToDelete(id);
    setIsDeleteOrderDialogOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      deleteOrderReq(route("orders.destroy", orderToDelete), {
        onSuccess: () => {
          setIsDeleteOrderDialogOpen(false);
          setOrderToDelete(null);
          toast.success("Berhasil menghapus data pesanan.");
        },
      });
    }
  };

  // =========================================================================
  //  OFFLINE ORDER CREATION STATES & HANDLERS
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
    event_id: "" as string,
    event_session_id: "" as string,
    name: "",
    phone: "",
    email: "",
    qty: "",
    notes: "",
    pay_account_id: "",
  });

  const handleAddOfflineOrder = () => {
    resetOfflineOrder();
    setIsOfflineOrderModalOpen(true);
  };

  const handleSubmitOfflineOrder = (e: React.FormEvent) => {
    e.preventDefault();
    postOfflineOrder(route("orders.store"), {
      onSuccess: () => {
        setIsOfflineOrderModalOpen(false);
        resetOfflineOrder();
        toast.success("Pesanan tiket offline berhasil dicatat!");
      },
    });
  };

  // =========================================================================
  //  BANK ACCOUNT STATES & HANDLERS
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
    errors: accountErrors,
  } = useForm({
    batch_member_id: "",
    type: "bank" as "bank" | "e-wallet",
    name_account: "",
    no_account: "",
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
      no_account: account.no_account,
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
      putAccount(route("accounts.update", editingAccount.id), {
        onSuccess: () => {
          handleCancelEditAccount();
          toast.success("Berhasil memperbarui data rekening.");
        },
      });
    } else {
      postAccount(route("accounts.store"), {
        onSuccess: () => {
          handleCancelEditAccount();
          toast.success("Berhasil menambahkan rekening baru.");
        },
      });
    }
  };

  const handleDeleteAccount = (id: number) => {
    setAccountToDelete(id);
    setIsDeleteBankDialogOpen(true);
  };

  const confirmDeleteAccount = () => {
    if (accountToDelete) {
      deleteAccountReq(route("accounts.destroy", accountToDelete), {
        onSuccess: () => {
          setIsDeleteBankDialogOpen(false);
          setAccountToDelete(null);
          toast.success("Berhasil menghapus data rekening.");
        },
      });
    }
  };
  // =========================================================================
  //  SESI EVENT MANAGEMENT STATES & HANDLERS
  // =========================================================================
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);

  const {
    data: sessionData,
    setData: setSessionData,
    post: postSession,
    put: putSession,
    delete: deleteSessionReq,
    reset: resetSession,
    processing: processingSession,
  } = useForm({
    event_id: "",
    name_id: "",
    start_time: "",
    end_time: "",
    ticket_allocation: "",
  });

  const handleAddSession = () => {
    setEditingSession(null);
    resetSession();
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (session: EventSession) => {
    setEditingSession(session);
    setSessionData({
      event_id: session.event_id.toString(),
      name_id: session.name_id,
      start_time: session.start_time,
      end_time: session.end_time,
      ticket_allocation: session.ticket_allocation.toString(),
    });
    setIsSessionModalOpen(true);
  };

  const handleCancelEditSession = () => {
    setEditingSession(null);
    resetSession();
    setIsSessionModalOpen(false);
  };

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      putSession(route("event-sessions.update", editingSession.id), {
        onSuccess: () => {
          handleCancelEditSession();
          toast.success("Berhasil memperbarui sesi event.");
        },
      });
    } else {
      postSession(route("event-sessions.store"), {
        onSuccess: () => {
          handleCancelEditSession();
          toast.success("Berhasil menambahkan sesi event.");
        },
      });
    }
  };

  const handleDeleteSession = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus sesi ini?")) {
      deleteSessionReq(route("event-sessions.destroy", id), {
        onSuccess: () => toast.success("Berhasil menghapus sesi event."),
      });
    }
  };

  // Format IDR Helper
  const formatIDR = (amount?: number | null) => {
    if (amount === null || amount === undefined || amount === 0) return "Gratis";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <Head title="Kelola Event & Tiket" />

      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
            <CalendarDays className="w-5 h-5 mr-3 text-primary" /> Manajemen Event & Tiket
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data Event, Verifikasi Pesanan Tiket, dan Rekening Pembayaran
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="w-full border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
            {!hasRole(["User"]) && (
                <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val)}
                className="w-full sm:w-auto relative"
              >
                <TabsList className="grid grid-cols-3 w-full sm:flex sm:w-auto h-auto p-0 bg-transparent sm:gap-6 justify-start rounded-none border-none">
                  <TabsTrigger
                    value="event"
                    className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                  >
                    Event / Acara
                  </TabsTrigger>
                  <TabsTrigger
                    value="order"
                    className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                  >
                    Order Tiket
                  </TabsTrigger>
                  <TabsTrigger
                    value="bank"
                    className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                  >
                    Sesi & Bayar
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>

        {/* Tab Content Wrapper */}
        <Tabs value={activeTab} className="w-full">
          {/* TAB CONTENT: EVENT */}
          <TabsContent value="event" className="mt-0">
            <EventTable
              events={events}
              statusFilter={eventStatusFilter}
              onStatusFilterChange={setEventStatusFilter}
              onView={(event) => {
                setViewingEvent(event);
                setIsEventDetailOpen(true);
              }}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onAdd={handleAddEvent}
              hasRole={hasRole}
              formatIDR={formatIDR}
            />
          </TabsContent>

          {/* TAB CONTENT: PESANAN TIKET (ORDER) */}
          <TabsContent value="order" className="mt-0">
            <OrderTable
              orders={orders}
              statusFilter={orderStatusFilter}
              methodFilter={orderMethodFilter}
              onStatusFilterChange={setOrderStatusFilter}
              onMethodFilterChange={setOrderMethodFilter}
              onView={(order) => {
                setViewingOrder(order);
                setIsOrderDetailOpen(true);
              }}
              onEditStatus={handleEditOrderStatus}
              onDelete={handleDeleteOrder}
              onAddOffline={handleAddOfflineOrder}
              hasRole={hasRole}
              formatIDR={formatIDR}
            />
          </TabsContent>

          {/* TAB CONTENT: SESI / BAYAR */}
          <TabsContent value="bank" className="mt-0">
            <div className="flex flex-col gap-4">
              {activeSessionTab === "session" ? (
                <SessionTable
                  sessions={sessions}
                  activeSessionTab={activeSessionTab}
                  setActiveSessionTab={setActiveSessionTab}
                  onAdd={handleAddSession}
                  onEdit={handleEditSession}
                  onDelete={handleDeleteSession}
                />
              ) : (
                <AccountTable
                  accounts={accounts}
                  activeSessionTab={activeSessionTab}
                  setActiveSessionTab={setActiveSessionTab}
                  onEdit={handleEditAccount}
                  onDelete={handleDeleteAccount}
                  onAdd={handleAddAccount}
                  hasRole={hasRole}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- MODALS & SHEETS --- */}

      <SessionFormModal
        isOpen={isSessionModalOpen}
        editingSession={editingSession}
        sessionData={sessionData}
        events={events}
        sessions={sessions}
        processingSession={processingSession}
        setSessionData={setSessionData}
        onSubmit={handleSubmitSession}
        onCancel={handleCancelEditSession}
      />

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isEventModalOpen}
        editingEvent={editingEvent}
        eventData={eventData}
        eventDateInput={eventDateInput}
        eventErrors={eventErrors}
        processingEvent={processingEvent}
        setEventData={setEventData}
        setEventDateInput={setEventDateInput}
        onSubmit={handleSubmitEvent}
        onCancel={handleCancelEditEvent}
      />

      {/* Event Detail Sheet */}
      <EventDetailSheet
        isOpen={isEventDetailOpen}
        event={viewingEvent}
        onClose={() => {
          setIsEventDetailOpen(false);
          setViewingEvent(null);
        }}
        formatIDR={formatIDR}
      />

      {/* Event Delete Dialog */}
      <EventDeleteDialog
        isOpen={isDeleteEventDialogOpen}
        onOpenChange={setIsDeleteEventDialogOpen}
        onConfirm={confirmDeleteEvent}
      />

      {/* Offline Order Modal */}
      <OfflineOrderModal
        isOpen={isOfflineOrderModalOpen}
        events={events}
        sessions={sessions}
        accounts={accounts}
        offlineOrderData={offlineOrderData}
        offlineOrderErrors={offlineOrderErrors}
        processingOfflineOrder={processingOfflineOrder}
        setOfflineOrderData={setOfflineOrderData}
        onSubmit={handleSubmitOfflineOrder}
        onCancel={() => setIsOfflineOrderModalOpen(false)}
      />

      {/* Order Status Verification Modal */}
      <OrderStatusModal
        isOpen={isOrderStatusModalOpen}
        editingOrder={editingOrder}
        status={orderData.status}
        processingOrder={processingOrder}
        onStatusChange={(val) => setOrderData("status", val)}
        onSubmit={handleSubmitOrderStatus}
        onCancel={() => setIsOrderStatusModalOpen(false)}
      />

      {/* Order Detail & Proof Sheet */}
      <OrderDetailSheet
        isOpen={isOrderDetailOpen}
        order={viewingOrder}
        onClose={() => {
          setIsOrderDetailOpen(false);
          setViewingOrder(null);
        }}
        formatIDR={formatIDR}
      />

      {/* Order Delete Dialog */}
      <OrderDeleteDialog
        isOpen={isDeleteOrderDialogOpen}
        onOpenChange={setIsDeleteOrderDialogOpen}
        onConfirm={confirmDeleteOrder}
      />

      {/* Bank Account Form Modal */}
      <AccountFormModal
        isOpen={isBankModalOpen}
        editingAccount={editingAccount}
        members={members}
        accountData={accountData}
        accountErrors={accountErrors}
        processingAccount={processingAccount}
        setAccountData={setAccountData}
        onSubmit={handleSubmitAccount}
        onCancel={handleCancelEditAccount}
      />

      {/* Bank Account Delete Dialog */}
      <AccountDeleteDialog
        isOpen={isDeleteBankDialogOpen}
        onOpenChange={setIsDeleteBankDialogOpen}
        onConfirm={confirmDeleteAccount}
      />
    </DashboardLayout>
  );
}
