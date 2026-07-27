<?php

namespace App\Services\Storages;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use Throwable;

class CloudinaryService
{
    protected Cloudinary $cloudinary;
    protected string $cloudName;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary();
        $this->cloudName = $this->cloudinary->configuration->cloud->cloudName ?? '';
    }

    /**
     * Upload Single File ke Cloudinary
     */
    public function upload(UploadedFile $file, string $folder = 'Ukm-Lises'): array
    {
        $options = [
            'folder' => $folder,
            'resource_type' => $this->getResourceType($file),
        ];

        $result = $this->uploadWithRetry($file->getRealPath(), $options);

        $randomId = pathinfo($result['public_id'], PATHINFO_BASENAME);
        $publicId = trim($folder, '/') . '/' . $randomId;
        $type = $result['resource_type'] ?? 'image';

        return [
            'url' => $this->generateUrl($publicId, $type),
            'public_id' => $publicId,
        ];
    }

    /**
     * Hapus Asset dari Cloudinary berdasarkan public_id
     */
    public function delete(string $publicId, string $resourceType = 'image'): bool
    {
        try {
            $cleanPublicId = preg_replace('/\.[^.]+$/', '', $publicId);

            $result = $this->cloudinary->uploadApi()->destroy($cleanPublicId, [
                'resource_type' => $resourceType,
                'invalidate'    => true,
            ]);

            return isset($result['result']) && $result['result'] === 'ok';
        } catch (Throwable $e) {
            return false;
        }
    }

    /**
     * Ekstrak public_id dari URL Cloudinary
     */
    public function getPublicIdFromUrl(?string $url): ?string
    {
        if (empty($url) || !str_contains($url, config('cloudinary.base_url'))) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH);
        
        if (!$path) {
            return null;
        }

        // Mengambil path folder + filename setelah /upload/ (mengabaikan versi v123456)
        if (preg_match('/\/upload\/(?:[^\/]+\/)?(?:v\d+\/)?(.+)$/', $path, $matches)) {
            return preg_replace('/\.[^.]+$/', '', $matches[1]);
        }

        return null;
    }

    public function generateUrl(string $publicId, string $type = 'image', string $transforms = 'f_auto,q_auto'): string
    {
        $baseUrl = rtrim(config('cloudinary.base_url'), '/');
        $base = "{$baseUrl}/{$this->cloudName}";

        return match ($type) {
            'video' => "{$base}/video/upload/{$transforms}/{$publicId}",
            'raw'   => "{$base}/raw/upload/{$publicId}",
            default => "{$base}/image/upload/{$transforms}/{$publicId}",
        };
    }

    protected function uploadWithRetry(mixed $source, array $options): array
    {
        $maxAttempts = 4;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                set_time_limit(300);

                if (is_resource($source)) {
                    @rewind($source);
                }

                $response = $this->cloudinary->uploadApi()->upload($source, $options);

                return $response->getArrayCopy();
            } catch (Throwable $e) {
                if ($attempt >= $maxAttempts || ! $this->isRetryableException($e)) {
                    throw $e;
                }

                usleep(400000 * (2 ** ($attempt - 1)));
            }
        }

        throw new \RuntimeException('Gagal mengunggah file setelah beberapa percobaan.');
    }

    protected function isRetryableException(Throwable $e): bool
    {
        $message = strtolower($e->getMessage());

        return str_contains($message, 'curl error 56')
            || str_contains($message, 'connection was reset')
            || str_contains($message, 'recv failure')
            || str_contains($message, 'curl error 28')
            || str_contains($message, 'operation timed out')
            || str_contains($message, 'ssl connection timeout')
            || str_contains($message, 'failed to connect');
    }

    protected function getResourceType(UploadedFile $file): string
    {
        $mime = $file->getMimeType();

        if (str_starts_with($mime, 'video/')) {
            return 'video';
        }

        if (str_starts_with($mime, 'image/')) {
            return 'image';
        }

        return 'raw';
    }
}