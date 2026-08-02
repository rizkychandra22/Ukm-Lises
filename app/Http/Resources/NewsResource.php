<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $role = $this->user?->getRoleNames()->first();
        $uploadedBy = match ($role) {
            'Developer' => 'Developer Lises Asmarandana',
            'Admin' => 'Admin Lises Asmarandana',
            default => 'Admin Lises Asmarandana',
        };

        return [
            'id' => $this->id,
            'type' => $this->type,
            'date' => $this->date,
            'title_id' => $this->title_id,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'summary_id' => $this->summary_id,
            'summary_en' => $this->summary_en,
            'description_id' => $this->description_id,
            'description_en' => $this->description_en,
            'image' => $this->image,
            'uploaded_by' => $uploadedBy,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
