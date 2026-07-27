<?php

namespace App\Services;

use App\Models\BatchMember;
use App\Services\Storages\CloudinaryService;
use App\Services\Translations\GoogleTranslateService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BatchMemberService
{
    public function __construct(
        protected GoogleTranslateService $translator,
        protected CloudinaryService $cloudinary
    ) {}
    
    public function createMember(array $data): BatchMember
    {
        // Upload Foto jika ada
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/members');
            
            $data['image'] = $uploadResult['url'];
            $data['image_public_id'] = $uploadResult['public_id'];
        }

        // Logika Status & Auto Translate berdasarkan Type
        if ($data['type'] === 'Demisioner') {
            $data['status'] = 'Deactive';
            $data['prodi_en'] = $this->translator->toEnglish($data['prodi_id'] ?? null) ?? $data['prodi_id'];
            $data['periode'] = null;
            $data['position_id'] = null;
            $data['position_en'] = null;
        } else {
            $data['status'] = 'Active';
            $data['prodi_en'] = $this->translator->toEnglish($data['prodi_id'] ?? null) ?? $data['prodi_id'];
            $data['position_en'] = $this->translator->toEnglish($data['position_id'] ?? null) ?? $data['position_id'];
        }

        return BatchMember::create($data);
    }

    public function updateMember(BatchMember $member, array $data): BatchMember
    {
        // Handle Foto Baru
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            // Hapus foto lama dari Cloudinary jika public_id-nya ada
            if (!empty($member->image_public_id)) {
                $this->cloudinary->delete($member->image_public_id);
            }

            // Upload foto baru
            $uploadResult = $this->cloudinary->upload($data['image'], 'Ukm-Lises/members');
            $data['image'] = $uploadResult['url'];
            $data['image_public_id'] = $uploadResult['public_id'];
        } else {
            unset($data['image']); // Tetap gunakan gambar lama
        }

        // Logika Status & Auto Translate
        if ($data['type'] === 'Demisioner') {
            $data['status'] = 'Deactive';
            $data['periode'] = null;
            $data['prodi_en'] = $this->translator->toEnglish($data['prodi_id'] ?? null) ?? $data['prodi_id'];
            $data['position_id'] = null;
            $data['position_en'] = null;
        } else {
            $data['status'] = 'Active';
            $data['prodi_en'] = $this->translator->toEnglish($data['prodi_id'] ?? null) ?? $data['prodi_id'];
            $data['position_en'] = $this->translator->toEnglish($data['position_id'] ?? null) ?? $data['position_id'];
        }

        $member->update($data);
        return $member;
    }

    public function deleteMember(BatchMember $member): void
    {
        if ($member->image) {
            Storage::disk('public')->delete($member->image);
        }
        $member->delete();
    }
}