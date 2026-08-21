<?php

namespace App\Http\Controllers;

use App\Models\BatchMember;
use App\Models\Event;
use App\Models\EventSession;
use App\Models\PayAccount;
use App\Models\PayOrder;
use App\Services\EventService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService,
        protected OrderService $orderService
    ) {}

    /**
     * Menampilkan Halaman Utama Dashboard Admin Event (Events, Orders, Accounts).
     */
    public function index(): Response
    {
        // Auto-update Event status jika melebihi 3 jam dari jadwal
        Event::where('status', 'published')
            ->where('date', '<=', now()->subHours(3))
            ->update(['status' => 'completed']);

        Event::where('status', 'draft')
            ->where('date', '<=', now()->subHours(3))
            ->update(['status' => 'cancelled']);

        $events = Event::latest()->get();
        $events->each->append('remaining_tickets');

        return Inertia::render('IndexEvent', [
            'events'   => $events,
            'orders'   => PayOrder::with(['event', 'eventSession', 'payAccount.batchMember'])->latest()->get(),
            'accounts' => PayAccount::with('batchMember')->get(),
            'sessions' => EventSession::with('event')->withSum(['orders' => fn($q) => $q->where('status', 'success')], 'qty')->latest()->get(),
            'members'  => BatchMember::select('id', 'name')
                ->where('type', 'Pengurus')
                ->where('status', 'Active')
                ->whereHas('batch', fn ($q) => $q->where('status', 'Active'))
                ->whereNotNull('position_id')
                ->get(),
        ]);
    }

    /* =========================================================================
     *  EVENT CRUD ACTIONS
     * ========================================================================= */

    public function storeEvent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title_id'    => ['required', 'string', 'max:255'],
            'title_en'    => ['nullable', 'string', 'max:255'],
            'image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10048'],
            'summary_id'  => ['nullable', 'string'],
            'summary_en'  => ['nullable', 'string'],
            'type'        => ['required', 'in:Exclusive,Non-Exclusive'],
            'date'        => ['required', 'date'],
            'location_id' => ['required', 'string', 'max:255'],
            'location_en' => ['nullable', 'string', 'max:255'],
            'price'       => ['nullable', 'numeric', 'min:0', 'required_if:type,Exclusive'],
            'ticket'      => ['nullable', 'integer', 'min:0', 'required_if:type,Exclusive'],
            'status'      => ['required', 'in:draft,published,cancelled,completed'],
        ], [
            'title_id.required'    => 'Judul event wajib diisi.',
            'type.required'        => 'Tipe event wajib dipilih.',
            'date.required'        => 'Tanggal & waktu event wajib diisi.',
            'location_id.required' => 'Lokasi event wajib diisi.',
            'status.required'      => 'Status event wajib dipilih.',
            'price.required_if'    => 'Harga tiket wajib diisi untuk event Exclusive.',
            'ticket.required_if'   => 'Kuota tiket wajib diisi untuk event Exclusive.',
            'image.max'            => 'Ukuran banner maksimal 2MB.',
        ]);

        $this->eventService->createEvent($validated);

        return redirect()->back()->with('success', 'Event berhasil ditambahkan!');
    }

    public function updateEvent(Request $request, Event $event): RedirectResponse
    {
        $validated = $request->validate([
            'title_id'    => ['required', 'string', 'max:255'],
            'title_en'    => ['nullable', 'string', 'max:255'],
            'image'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10048'],
            'summary_id'  => ['nullable', 'string'],
            'summary_en'  => ['nullable', 'string'],
            'type'        => ['required', 'in:Exclusive,Non-Exclusive'],
            'date'        => ['required', 'date'],
            'location_id' => ['required', 'string', 'max:255'],
            'location_en' => ['nullable', 'string', 'max:255'],
            'price'       => ['nullable', 'numeric', 'min:0', 'required_if:type,Exclusive'],
            'ticket'      => ['nullable', 'integer', 'min:0', 'required_if:type,Exclusive'],
            'status'      => ['required', 'in:draft,published,cancelled,completed'],
        ], [
            'title_id.required'    => 'Judul event wajib diisi.',
            'type.required'        => 'Tipe event wajib dipilih.',
            'date.required'        => 'Tanggal & waktu event wajib diisi.',
            'location_id.required' => 'Lokasi event wajib diisi.',
            'status.required'      => 'Status event wajib dipilih.',
            'price.required_if'    => 'Harga tiket wajib diisi untuk event Exclusive.',
            'ticket.required_if'   => 'Kuota tiket wajib diisi untuk event Exclusive.',
            'image.max'            => 'Ukuran banner maksimal 2MB.',
        ]);

        $this->eventService->updateEvent($event, $validated);

        return redirect()->back()->with('success', 'Data event berhasil diperbarui!');
    }

    public function destroyEvent(Event $event): RedirectResponse
    {
        $this->eventService->deleteEvent($event);

        return redirect()->back()->with('success', 'Event berhasil dihapus!');
    }

    /* =========================================================================
     *  TICKET ORDER ACTIONS
     * ========================================================================= */

    /**
     * Membuat pesanan tiket baru secara OFFLINE oleh Admin.
     * Status otomatis 'success' karena pembayaran langsung di tempat.
     */
    public function storeOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_id'         => ['required', 'exists:events,id'],
            'event_session_id' => ['nullable', 'exists:event_sessions,id'],
            'name'             => ['required', 'string', 'max:255'],
            'phone'            => ['required', 'string', 'max:30'],
            'email'            => ['nullable', 'email', 'max:255'],
            'qty'              => ['required', 'integer', 'min:1'],
            'notes'            => ['nullable', 'string', 'max:500'],
            'pay_account_id'   => ['nullable', 'exists:pay_accounts,id'],
        ], [
            'event_id.required'  => 'Event wajib dipilih.',
            'event_id.exists'    => 'Event yang dipilih tidak ditemukan.',
            'name.required'      => 'Nama pemesan wajib diisi.',
            'phone.required'     => 'Nomor telepon wajib diisi.',
            'qty.required'       => 'Jumlah tiket wajib diisi.',
            'qty.min'            => 'Jumlah tiket minimal 1.',
        ]);

        // Tandai sebagai offline & langsung success (bayar di tempat)
        $validated['order_method'] = 'offline';
        $validated['status']       = 'success';

        $this->orderService->createOrder($validated);

        return redirect()->back()->with('success', 'Pesanan tiket offline berhasil dicatat!');
    }

    public function updateOrderStatus(Request $request, PayOrder $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,success,cancelled'],
        ], [
            'status.required' => 'Status pesanan wajib dipilih.',
        ]);

        $this->orderService->updateOrderStatus($order, $validated['status']);

        return redirect()->back()->with('success', 'Status pesanan tiket berhasil diperbarui!');
    }

    public function destroyOrder(PayOrder $order): RedirectResponse
    {
        $this->orderService->deleteOrder($order);

        return redirect()->back()->with('success', 'Data pesanan tiket berhasil dihapus!');
    }

    /* =========================================================================
     *  PAYMENT ACCOUNT ACTIONS
     * ========================================================================= */

    public function storeAccount(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'batch_member_id' => ['required', 'exists:batch_members,id'],
            'type'            => ['required', 'in:bank,e-wallet'],
            'name_account'    => ['required', 'string', 'max:255'],
            'no_account'      => ['required', 'string', 'max:255'],
        ], [
            'batch_member_id.required' => 'Pemilik / bendahara rekening wajib dipilih.',
            'type.required'            => 'Tipe akun pembayaran wajib dipilih.',
            'name_account.required'    => 'Nama akun/bank wajib diisi.',
            'no_account.required'      => 'Nomor rekening/e-wallet wajib diisi.',
        ]);

        PayAccount::create($validated);

        return redirect()->back()->with('success', 'Rekening pembayaran berhasil ditambahkan!');
    }

    public function updateAccount(Request $request, PayAccount $account): RedirectResponse
    {
        $validated = $request->validate([
            'batch_member_id' => ['required', 'exists:batch_members,id'],
            'type'            => ['required', 'in:bank,e-wallet'],
            'name_account'    => ['required', 'string', 'max:255'],
            'no_account'      => ['required', 'string', 'max:255'],
        ], [
            'batch_member_id.required' => 'Pemilik / bendahara rekening wajib dipilih.',
            'type.required'            => 'Tipe akun pembayaran wajib dipilih.',
            'name_account.required'    => 'Nama akun/bank wajib diisi.',
            'no_account.required'      => 'Nomor rekening/e-wallet wajib diisi.',
        ]);

        $account->update($validated);

        return redirect()->back()->with('success', 'Rekening pembayaran berhasil diperbarui!');
    }

    public function destroyAccount(PayAccount $account): RedirectResponse
    {
        $account->delete();

        return redirect()->back()->with('success', 'Rekening pembayaran berhasil dihapus!');
    }
}