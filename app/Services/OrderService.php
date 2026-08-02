<?php

namespace App\Services;

use App\Models\Event;
use App\Models\PayOrder;
use App\Services\Storages\CloudinaryService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        protected CloudinaryService $cloudinary
    ) {}

    /**
     * Membuat Pesanan Tiket Baru.
     */
    public function createOrder(array $data): PayOrder
    {
        return DB::transaction(function () use ($data) {
            $event = Event::findOrFail($data['event_id']);

            // 1. Validasi Sisa Tiket
            if ($event->ticket !== null) {
                $remaining = $event->remaining_tickets;
                if ($remaining !== null && $remaining < $data['qty']) {
                    throw new \Exception('Maaf, sisa tiket yang tersedia tidak mencukupi.');
                }
            }

            // 2. Hitung Total Price
            $totalPrice = ($event->price ?? 0) * $data['qty'];

            // 3. Upload Bukti Transfer ke Cloudinary
            $proofUrl = null;
            if (isset($data['payment_proof']) && $data['payment_proof'] instanceof UploadedFile) {
                $uploadResult = $this->cloudinary->upload($data['payment_proof'], 'Ukm-Lises/events/orders');
                $proofUrl = $uploadResult['url'];
            }

            // 4. Create Order (order_code di-generate otomatis via Model Boot)
            return PayOrder::create([
                'name'           => $data['name'],
                'email'          => $data['email'],
                'phone'          => $data['phone'],
                'event_id'       => $event->id,
                'qty'            => $data['qty'],
                'total_price'    => $totalPrice,
                'notes'          => $data['notes'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
                'payment_proof'  => $proofUrl,
                'order_method'   => $data['order_method'] ?? 'online',
                'status'         => 'pending',
            ]);
        });
    }

    /**
     * Memperbarui Status Pesanan Tiket oleh Admin.
     */
    public function updateOrderStatus(PayOrder $order, string $status): PayOrder
    {
        $order->update(['status' => $status]);
        return $order;
    }

    /**
     * Menghapus Pesanan Tiket beserta bukti bayar di Cloudinary.
     */
    public function deleteOrder(PayOrder $order): void
    {
        // 1. Ekstrak public_id bukti bayar di Cloudinary
        $publicId = $this->cloudinary->getPublicIdFromUrl($order->payment_proof);

        // 2. Hapus foto dari Cloudinary
        if (!empty($publicId)) {
            $this->cloudinary->delete($publicId);
        }

        // 3. Hapus record pesanan dari Database
        $order->delete();
    }
}