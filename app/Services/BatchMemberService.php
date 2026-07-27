<?php

namespace App\Services;

use App\Helpers\Translations;
use App\Models\BatchMember;
use Illuminate\Support\Facades\Storage;

class BatchMemberService
{
    public function createMember(array $data): BatchMember
    {
        // 1. Upload Foto jika ada
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $data['image'] = $data['image']->store('batch-members', 'public');
        }

        // 2. Logika Status & Auto Translate berdasarkan Type
        if ($data['type'] === 'Demisioner') {
            $data['status'] = 'Deactive';
            $data['periode'] = null;
            $data['position_id'] = null;
            $data['position_en'] = null;
        } else {
            $data['status'] = 'Active';
            // Auto translate posisi jika diisi
            $data['position_en'] = Translations::toEnglish($data['position_id'] ?? null);
        }

        return BatchMember::create($data);
    }

    public function updateMember(BatchMember $member, array $data): BatchMember
    {
        // 1. Handle Foto Baru
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            if ($member->image) {
                Storage::disk('public')->delete($member->image);
            }
            $data['image'] = $data['image']->store('batch-members', 'public');
        } else {
            unset($data['image']); // Tetap pakai gambar lama
        }

        // 2. Logika Status & Auto Translate
        if ($data['type'] === 'Demisioner') {
            $data['status'] = 'Deactive';
            $data['periode'] = null;
            $data['position_id'] = null;
            $data['position_en'] = null;
        } else {
            $data['status'] = 'Active';
            $data['position_en'] = Translations::toEnglish($data['position_id'] ?? null);
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