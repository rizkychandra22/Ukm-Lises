<?php

namespace App\Services;

use App\Models\BatchMember;
use App\Services\Storages\CloudinaryService;
use App\Services\Translations\GoogleTranslateService;
use Illuminate\Http\UploadedFile;

class BatchMemberService
{
    public function __construct(
        protected GoogleTranslateService $translator,
        protected CloudinaryService $cloudinary
    ) {}

    public function createMember(array $data): BatchMember
    {
        // 1. Upload foto jika ada
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/members');
            $data['image'] = $uploadResult['url']; // Hanya simpan URL
        }

        // 2. Logika Status & Auto Translate
        if (($data['type'] ?? null) === 'Demisioner') {
            $data['status'] = 'Deactive';
            $data['periode'] = null;
            $data['position_id'] = null;
            $data['position_en'] = null;
        } else {
            $data['status'] = 'Active';
            $data['position_en'] = $this->translator->toEnglish($data['position_id'] ?? null) ?? ($data['position_id'] ?? null);
        }

        return BatchMember::create($data);
    }

    public function updateMember(BatchMember $member, array $data): BatchMember
    {
        // 1. Handle jika user mengunggah foto baru
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {

            // Tangkap public_id dari URL foto lama sebelum tertimpa
            $oldPublicId = $this->cloudinary->getPublicIdFromUrl($member->image);

            // Upload foto baru ke Cloudinary
            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/members');
            $data['image'] = $uploadResult['url']; // Hanya simpan URL baru

            // Hapus foto lama di Cloudinary berdasarkan public_id yang diekstrak dari URL lama
            if (!empty($oldPublicId)) {
                $this->cloudinary->delete($oldPublicId);
            }
        } else {
            // Jika tidak ada foto baru, jangan ubah kolom image
            unset($data['image']);
        }

        // 2. Logika Status & Auto Translate
        if (($data['type'] ?? null) === 'Demisioner') {
            $data['status'] = 'Deactive';
            $data['periode'] = null;
            $data['position_id'] = null;
            $data['position_en'] = null;
        } else {
            $data['status'] = 'Active';
            $data['position_en'] = $this->translator->toEnglish($data['position_id'] ?? null) ?? ($data['position_id'] ?? null);
        }

        // 3. Update Database
        $member->update($data);

        return $member;
    }

    public function deleteMember(BatchMember $member): void
    {
        // 1. Ekstrak public_id dari URL image yang tersimpan di DB
        $publicId = $this->cloudinary->getPublicIdFromUrl($member->image);

        // 2. Hapus dari Cloudinary jika public_id ditemukan
        if (!empty($publicId)) {
            $this->cloudinary->delete($publicId);
        }

        // 3. Hapus record dari Database
        $member->delete();
    }
}