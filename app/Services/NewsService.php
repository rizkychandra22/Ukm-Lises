<?php

namespace App\Services;

use App\Models\News;
use App\Services\Storages\CloudinaryService;
use App\Services\Translations\GoogleTranslateService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class NewsService
{
    public function __construct(
        protected GoogleTranslateService $translator,
        protected CloudinaryService $cloudinary
    ) {}

    public function createNews(array $data): News
    {
        // Generate Slug
        $data['slug'] = Str::slug($data['title_id']) . '-' . uniqid();

        // Upload image
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/news');
            $data['image'] = $uploadResult['url'];
        }

        // Translate
        $data = $this->processTranslateData($data);

        return News::create($data);
    }

    public function updateNews(News $news, array $data): News
    {
        if (isset($data['title_id']) && $data['title_id'] !== $news->title_id) {
            $data['slug'] = Str::slug($data['title_id']) . '-' . uniqid();
        }

        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $oldPublicId = $this->cloudinary->getPublicIdFromUrl($news->image);

            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/news');
            $data['image'] = $uploadResult['url'];

            if (!empty($oldPublicId)) {
                $this->cloudinary->delete($oldPublicId);
            }
        } else {
            unset($data['image']);
        }

        $data = $this->processTranslateData($data);

        $news->update($data);

        return $news;
    }

    public function deleteNews(News $news): void
    {
        $publicId = $this->cloudinary->getPublicIdFromUrl($news->image);

        if (!empty($publicId)) {
            $this->cloudinary->delete($publicId);
        }
        
        $news->delete();
    }

    private function processTranslateData(array $data): array
    {
        if (!empty($data['title_id']) && empty($data['title_en'])) {
            $data['title_en'] = $this->translator->toEnglish($data['title_id']) ?? $data['title_id'];
        }

        if (!empty($data['summary_id']) && empty($data['summary_en'])) {
            $data['summary_en'] = $this->translator->toEnglish($data['summary_id']) ?? $data['summary_id'];
        }

        if (!empty($data['description_id']) && empty($data['description_en'])) {
            $data['description_en'] = $this->translator->toEnglish($data['description_id']) ?? $data['description_id'];
        }

        return $data;
    }
}
