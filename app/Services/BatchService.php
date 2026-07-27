<?php

namespace App\Services;

use App\Helpers\Translations;
use App\Models\Batch;

class BatchService
{
    public function createBatch(array $data): Batch
    {
        $data['name_en'] = Translations::toEnglish($data['name_id'] ?? null);
        return Batch::create($data);
    }

    public function updateBatch(Batch $batch, array $data): Batch
    {
        $data['name_en'] = Translations::toEnglish($data['name_id'] ?? null);
        $batch->update($data);
        return $batch;
    }
}