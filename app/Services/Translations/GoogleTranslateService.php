<?php

namespace App\Services\Translations;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Throwable;

class GoogleTranslateService
{
    protected GoogleTranslate $translator;

    public function __construct()
    {
        $this->translator = new GoogleTranslate();
        $this->translator->setOptions(['timeout' => 5]);
    }

    /**
     * Terjemahkan teks dari Bahasa Indonesia ke Inggris (dengan Caching)
     */
    public function toEnglish(?string $text): ?string
    {
        if (blank($text)) {
            return null;
        }

        $cacheKey = 'translation_id_en_' . md5($text);

        return Cache::remember($cacheKey, now()->addDays(30), function () use ($text) {
            try {
                return $this->translator
                    ->setSource('id')
                    ->setTarget('en')
                    ->translate($text);
            } catch (Throwable $e) {
                Log::warning("Gagal menerjemahkan teks: {$e->getMessage()}", [
                    'text' => $text,
                ]);

                return $text; // Fallback ke teks asli jika error
            }
        });
    }
}