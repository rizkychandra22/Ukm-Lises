<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\PayAccount;
use App\Models\PayOrder;
use App\Services\OrderService;
use App\Http\Resources\GalleryResource;
use App\Http\Resources\NewsResource;
use App\Models\Batch;
use App\Models\BatchMember;
use App\Models\News;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function events()
    {
        // Auto-update Event status jika melebihi 3 jam dari jadwal agar landing page sinkron
        Event::where('status', 'published')
            ->where('date', '<=', now()->subHours(3))
            ->update(['status' => 'completed']);

        Event::where('status', 'draft')
            ->where('date', '<=', now()->subHours(3))
            ->update(['status' => 'cancelled']);

        $events = Event::with('sessions')->published()
            ->orderByRaw("CASE WHEN status = 'published' THEN 0 WHEN status = 'completed' THEN 1 ELSE 2 END ASC")
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($event) {
                return [
                    'id'          => $event->id,
                    'title_id'    => $event->title_id,
                    'title_en'    => $event->title_en,
                    'slug'        => $event->slug,
                    'image'       => $event->image,
                    'summary_id'  => $event->summary_id,
                    'summary_en'  => $event->summary_en,
                    'type'        => $event->type,
                    'date'        => $event->date,
                    'location_id' => $event->location_id,
                    'location_en' => $event->location_en,
                    'price'       => $event->price,
                    'ticket'      => $event->ticket,
                    'remaining_tickets' => $event->remaining_tickets,
                    'status'      => $event->status,
                    'sessions'    => $event->sessions->map(function ($session) {
                        return [
                            'id' => $session->id,
                            'event_id' => $session->event_id,
                            'name' => $session->name,
                            'start_time' => $session->start_time,
                            'end_time' => $session->end_time,
                            'ticket_allocation' => $session->ticket_allocation,
                            'remaining_tickets' => $session->remaining_tickets,
                        ];
                    }),
                ];
            });

        return response()->json($events);
    }

    public function stats()
    {
        return response()->json([
            'total_members' => BatchMember::count(),
            'total_batches' => Batch::count(),
            'total_events'  => Event::count(),
        ]);
    }

    public function galleries()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get();
        return response()->json(GalleryResource::collection($galleries));
    }

    public function news()
    {
        $news = News::with('user')->orderBy('date', 'desc')->get();
        return response()->json(NewsResource::collection($news));
    }

    public function newsDetail($slug)
    {
        $news = News::with('user')->where('slug', $slug)->firstOrFail();
        return response()->json(new NewsResource($news));
    }

    public function paymentAccounts()
    {
        $accounts = PayAccount::with('batchMember')->get()->map(function ($account) {
            $account->makeHidden(['created_at', 'updated_at']);
            if ($account->batchMember) {
                $account->batchMember->makeHidden(['created_at', 'updated_at']);
            }
            return $account;
        });
        return response()->json($accounts);
    }

    public function generateOrderCode()
    {
        return response()->json(['order_code' => PayOrder::generateOrderCode()]);
    }

    public function storeOrder(Request $request, OrderService $orderService)
    {
        $validated = $request->validate([
            'order_code'       => ['required', 'string', 'max:50'],
            'event_id'         => ['required', 'exists:events,id'],
            'event_session_id' => ['nullable', 'exists:event_sessions,id'],
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'phone'            => ['required', 'string', 'max:30'],
            'qty'              => ['required', 'integer', 'min:1'],
            'notes'            => ['nullable', 'string', 'max:500'],
            'pay_account_id'   => ['nullable', 'exists:pay_accounts,id'],
            'payment_proof'    => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $validated['order_method'] = 'online';
        $validated['status'] = 'pending';

        try {
            $order = $orderService->createOrder($validated);
            return response()->json([
                'message' => 'Pesanan tiket berhasil dibuat. Silakan tunggu konfirmasi.',
                'order'   => $order
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function trackOrder($order_code)
    {
        $order = PayOrder::with(['event', 'eventSession'])->where('order_code', $order_code)->first();
        if (!$order) {
            return response()->json(['message' => 'Pesanan tiket tidak ditemukan.'], 404);
        }
        return response()->json($order);
    }
}
