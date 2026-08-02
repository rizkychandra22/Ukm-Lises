<?php

namespace App\Services;

use App\Models\Event;
use App\Services\Storages\CloudinaryService;
use App\Services\Translations\GoogleTranslateService;
use Illuminate\Http\UploadedFile;

class EventService
{
    public function __construct(
        protected GoogleTranslateService $translator,
        protected CloudinaryService $cloudinary
    ) {}

    /**
     * Membuat Event baru.
     */
    public function createEvent(array $data): Event
    {
        // 1. Upload Banner ke Cloudinary jika ada file
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/events');
            $data['image'] = $uploadResult['url']; // Simpan URL Cloudinary
        }

        // 2. Auto-translate ke Bahasa Inggris jika tidak diisi manual
        $data = $this->processEventTranslations($data);

        return Event::create($data);
    }

    /**
     * Memperbarui data Event.
     */
    public function updateEvent(Event $event, array $data): Event
    {
        // Deteksi perubahan harga
        $oldPrice = (float) $event->price;
        $newPrice = isset($data['price']) ? (float) $data['price'] : 0;
        $priceChanged = $oldPrice !== $newPrice;

        // 1. Handle jika user mengunggah foto banner baru
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            
            // Tangkap public_id dari URL foto lama sebelum tertimpa
            $oldPublicId = $this->cloudinary->getPublicIdFromUrl($event->image);

            // Upload banner baru ke Cloudinary
            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/events');
            $data['image'] = $uploadResult['url'];

            // Hapus banner lama dari Cloudinary
            if (!empty($oldPublicId)) {
                $this->cloudinary->delete($oldPublicId);
            }
        } else {
            // Jika tidak ada gambar baru, jangan ubah/hapus kolom image
            unset($data['image']);
        }

        // 2. Jika field bahasa Indonesia berubah, kosongkan field bahasa Inggris agar di-translate ulang
        if (isset($data['title_id']) && $data['title_id'] !== $event->title_id) {
            $data['title_en'] = null;
            
            // Regenerate slug jika judul berubah
            $baseSlug = \Illuminate\Support\Str::slug($data['title_id']);
            $slug = $baseSlug;
            $counter = 1;
            while (\App\Models\Event::where('slug', $slug)->where('id', '!=', $event->id)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            $data['slug'] = $slug;
        }
        if (isset($data['summary_id']) && $data['summary_id'] !== $event->summary_id) {
            $data['summary_en'] = null;
        }
        if (isset($data['location_id']) && $data['location_id'] !== $event->location_id) {
            $data['location_en'] = null;
        }

        // 3. Auto-translate ke Bahasa Inggris
        $data = $this->processEventTranslations($data);

        // 4. Update Database
        $event->update($data);

        // 5. Sinkronisasi harga pesanan jika harga event berubah
        if ($priceChanged) {
            foreach ($event->orders as $order) {
                $order->update([
                    'total_price' => $order->qty * $newPrice
                ]);
            }
        }

        return $event;
    }

    /**
     * Menghapus Event beserta file gambarnya di Cloudinary.
     */
    public function deleteEvent(Event $event): void
    {
        // 1. Ekstrak public_id dari URL image di DB
        $publicId = $this->cloudinary->getPublicIdFromUrl($event->image);

        // 2. Hapus dari Cloudinary
        if (!empty($publicId)) {
            $this->cloudinary->delete($publicId);
        }

        // 3. Hapus record Event dari Database
        $event->delete();
    }

    /**
     * Helper untuk memproses auto-translation field Event.
     */
    private function processEventTranslations(array $data): array
    {
        if (!empty($data['title_id']) && empty($data['title_en'])) {
            $data['title_en'] = $this->translator->toEnglish($data['title_id']) ?? $data['title_id'];
        }

        if (!empty($data['summary_id']) && empty($data['summary_en'])) {
            $data['summary_en'] = $this->translator->toEnglish($data['summary_id']) ?? $data['summary_id'];
        }

        if (!empty($data['location_id']) && empty($data['location_en'])) {
            $data['location_en'] = $this->translator->toEnglish($data['location_id']) ?? $data['location_id'];
        }

        return $data;
    }
}