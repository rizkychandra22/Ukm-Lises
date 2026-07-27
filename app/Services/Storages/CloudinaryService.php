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
        // SDK otomatis membaca CLOUDINARY_URL dari file .env
        $this->cloudinary = new Cloudinary();
        
        // Ambil cloud_name dari konfig SDK
        $this->cloudName = $this->cloudinary->configuration->cloud->cloudName ?? '';
    }

    /**
     * Upload Single File ke Cloudinary dengan Retry Mechanism
     *
     * @param UploadedFile $file File dari $request->file()
     * @param string $folder Folder tujuan di Cloudinary 
     * @return array{url: string, public_id: string}
     * @throws Throwable
     */
    public function upload(UploadedFile $file, string $folder = 'Ukm-Lises'): array
    {
        $options = [
            'folder' => $folder,
            'resource_type' => $this->getResourceType($file),
        ];

        // Jalankan upload dengan mekanisme retry
        $result = $this->uploadWithRetry($file->getRealPath(), $options);

        $publicId = $result['public_id'];
        $type = $result['resource_type'] ?? 'image';

        return [
            'url' => $this->generateUrl($publicId, $type),
            'public_id' => $publicId,
        ];
    }

    /**
     * Upload Multiple Files sekaligus
     *
     * @param array<UploadedFile> $files Array file dari $request->file('photos')
     * @param string $folder Folder tujuan di Cloudinary
     * @return array<array{url: string, public_id: string}>
     */
    public function uploadMultiple(array $files, string $folder = 'Ukm-Lises'): array
    {
        $uploadedResults = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile && $file->isValid()) {
                $uploadedResults[] = $this->upload($file, $folder);
            }
        }

        return $uploadedResults;
    }

    /**
     * Hapus Asset dari Cloudinary berdasarkan public_id
     */
    public function delete(string $publicId, string $resourceType = 'image'): bool
    {
        try {
            $result = $this->cloudinary->uploadApi()->destroy($publicId, [
                'resource_type' => $resourceType,
                'invalidate' => true,
            ]);

            return isset($result['result']) && $result['result'] === 'ok';
        } catch (Throwable $e) {
            return false;
        }
    }

    /**
     * Generate Direct URL tanpa hit API Admin Cloudinary (Sangat Cepat)
     */
    public function generateUrl(string $publicId, string $type = 'image', string $transforms = 'f_auto,q_auto'): string
    {
        $baseUrl = rtrim(config('cloudinary.base_url', 'https://res.cloudinary.com'), '/');
        $base = "{$baseUrl}/{$this->cloudName}";

        return match ($type) {
            'video' => "{$base}/video/upload/{$transforms}/{$publicId}",
            'raw'   => "{$base}/raw/upload/{$publicId}",
            default => "{$base}/image/upload/{$transforms}/{$publicId}",
        };
    }

    /**
     * Retry upload otomatis jika terjadi error koneksi / cURL
     */
    protected function uploadWithRetry(mixed $source, array $options): array
    {
        $maxAttempts = 4;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                set_time_limit(300); // Mencegah PHP timeout saat upload file besar

                if (is_resource($source)) {
                    @rewind($source);
                }

                $response = $this->cloudinary->uploadApi()->upload($source, $options);

                // Konversi objek Cloudinary\Api\ApiResponse menjadi Array murni PHP
                return $response->getArrayCopy();
            } catch (Throwable $e) {
                if ($attempt >= $maxAttempts || ! $this->isRetryableException($e)) {
                    throw $e;
                }

                // Exponential backoff delay: 0.4 detik, 0.8 detik, 1.6 detik
                usleep(400000 * (2 ** ($attempt - 1)));
            }
        }

        throw new \RuntimeException('Gagal mengunggah file setelah beberapa percobaan.');
    }

    /**
     * Cek apakah error merupakan gangguan koneksi sementara yang layak di-retry
     */
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

    /**
     * Deteksi tipe resource berdasarkan MimeType
     */
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