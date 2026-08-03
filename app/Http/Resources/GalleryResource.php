<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title_id' => $this->title_id,
            'title_en' => $this->title_en,
            'desc_id' => $this->desc_id,
            'desc_en' => $this->desc_en,
            'image' => $this->image,
            'is_active' => $this->is_active,
            'is_index' => $this->is_index,
        ];
    }
}
