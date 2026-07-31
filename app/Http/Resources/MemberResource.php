<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
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
            'name' => $this->name,
            'type' => $this->type,
            'status' => $this->status,
            'periode' => $this->periode,
            'position_id' => $this->position_id,
            'position_en' => $this->position_en,
            'image' => $this->image,
            'whatsapp' => $this->whatsapp,
            'instagram' => $this->instagram,
            'batch_id' => $this->batch_id,
            'major_id' => $this->major_id,
            'batch' => new BatchResource($this->whenLoaded('batch')),
            'major' => new MajorResource($this->whenLoaded('major')),
        ];
    }
}
