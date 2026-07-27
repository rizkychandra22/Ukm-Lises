<?php

namespace App\Services;

use App\Helpers\Translations;
use App\Models\BatchMember;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BatchMemberService
{
    public function createMember(array $data): BatchMember
    {
        // Upload Foto jika ada
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $data['image'] = $data['image']->store('members', 'public');
        }

        // Logika Status & Auto Translate berdasarkan Type
        if ($data['type'] === 'Demisioner') {
            $data['status'] = 'Deactive';
            $data['prodi_en'] = Translations::toEnglish($data['prodi_id'] ?? null) ?? $data['prodi_id'];
            $data['periode'] = null;
            $data['position_id'] = null;
            $data['position_en'] = null;
        } else {
            $data['status'] = 'Active';
            $data['prodi_en'] = Translations::toEnglish($data['prodi_id'] ?? null) ?? $data['prodi_id'];
            $data['position_en'] = Translations::toEnglish($data['position_id'] ?? null) ?? $data['position_id'];
        }

        return BatchMember::create($data);
    }

    public function updateMember(BatchMember $member, array $data): BatchMember
    {
        // Handle Foto Baru
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            if ($member->image) {
                Storage::disk('public')->delete($member->image);
            }
            $data['image'] = $data['image']->store('members', 'public');
        } else {
            unset($data['image']); // Tetap pakai gambar lama
        }

        // Logika Status & Auto Translate
        if ($data['type'] === 'Demisioner') {
            $data['status'] = 'Deactive';
            $data['periode'] = null;
            $data['prodi_en'] = Translations::toEnglish($data['prodi_id'] ?? null) ?? $data['prodi_id'];
            $data['position_id'] = null;
            $data['position_en'] = null;
        } else {
            $data['status'] = 'Active';
            $data['prodi_en'] = Translations::toEnglish($data['prodi_id'] ?? null) ?? $data['prodi_id'];
            $data['position_en'] = Translations::toEnglish($data['position_id'] ?? null) ?? $data['position_id'];
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