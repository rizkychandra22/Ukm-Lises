<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Http\Resources\GalleryResource;

class ContentController extends Controller
{
    public function galleries()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get();
        return response()->json(GalleryResource::collection($galleries));
    }
}
