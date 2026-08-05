<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\PayAccount;
use App\Models\PayOrder;
use App\Services\OrderService;
use App\Http\Resources\GalleryResource;
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

        $events = Event::published()
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
                ];
            });

        return response()->json($events);
    }

    public function galleries()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get();
        return response()->json(GalleryResource::collection($galleries));
    }

    public function news()
    {
        $news = \App\Models\News::with('user')->orderBy('date', 'desc')->get();
        return response()->json(\App\Http\Resources\NewsResource::collection($news));
    }

    public function newsDetail($slug)
    {
        $news = \App\Models\News::with('user')->where('slug', $slug)->firstOrFail();
        return response()->json(new \App\Http\Resources\NewsResource($news));
    }

    public function paymentAccounts()
    {
        $accounts = \App\Models\PayAccount::with('batchMember')->get()->map(function ($account) {
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
        return response()->json(['order_code' => \App\Models\PayOrder::generateOrderCode()]);
    }

    public function storeOrder(Request $request, \App\Services\OrderService $orderService)
    {
        $validated = $request->validate([
            'order_code'     => ['required', 'string', 'max:50'],
            'event_id'       => ['required', 'exists:events,id'],
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255'],
            'phone'          => ['required', 'string', 'max:30'],
            'qty'            => ['required', 'integer', 'min:1'],
            'notes'          => ['nullable', 'string', 'max:500'],
            'pay_account_id' => ['nullable', 'exists:pay_accounts,id'],
            'payment_proof'  => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
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
        $order = \App\Models\PayOrder::with('event')->where('order_code', $order_code)->first();
        if (!$order) {
            return response()->json(['message' => 'Pesanan tiket tidak ditemukan.'], 404);
        }
        return response()->json($order);
    }
}
