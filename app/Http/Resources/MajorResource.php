<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MajorResource extends JsonResource
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
            'degree' => $this->degree,
            'name_id' => $this->name_id,
            'name_en' => $this->name_en,
            'faculty_id' => $this->faculty_id,
            'faculty_en' => $this->faculty_en,
        ];
    }
}
