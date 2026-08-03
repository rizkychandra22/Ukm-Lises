<?php

namespace App\Services;

use App\Models\Gallery;
use App\Services\Storages\CloudinaryService;
use App\Services\Translations\GoogleTranslateService;
use Illuminate\Http\UploadedFile;

class GalleryService
{
    public function __construct(
        protected GoogleTranslateService $translator,
        protected CloudinaryService $cloudinary
    ) {}

    public function createGallery(array $data): Gallery
    {
        // 1. Upload foto jika ada
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/galleries');
            $data['image'] = $uploadResult['url'];
        }

        // 2. Logika Translate
        $data = $this->processTranslateData($data);

        return Gallery::create($data);
    }

    public function updateGallery(Gallery $gallery, array $data): Gallery
    {
        // 1. Handle jika user mengunggah foto baru
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $oldPublicId = $this->cloudinary->getPublicIdFromUrl($gallery->image);

            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/galleries');
            $data['image'] = $uploadResult['url'];

            if (!empty($oldPublicId)) {
                $this->cloudinary->delete($oldPublicId);
            }
        } else {
            unset($data['image']);
        }

        // 2. Logika Translate
        $data = $this->processTranslateData($data);

        // 3. Update Database
        $gallery->update($data);

        return $gallery;
    }

    public function deleteGallery(Gallery $gallery): void
    {
        $publicId = $this->cloudinary->getPublicIdFromUrl($gallery->image);

        if (!empty($publicId)) {
            $this->cloudinary->delete($publicId);
        }
        
        $gallery->delete();
    }

    private function processTranslateData(array $data): array
    {
        // Auto translate title
        if (!empty($data['title_id']) && empty($data['title_en'])) {
            $data['title_en'] = $this->translator->toEnglish($data['title_id']) ?? $data['title_id'];
        }

        // Auto translate deskripsi
        if (!empty($data['desc_id']) && empty($data['desc_en'])) {
            $data['desc_en'] = $this->translator->toEnglish($data['desc_id']);
        }

        return $data;
    }
}
