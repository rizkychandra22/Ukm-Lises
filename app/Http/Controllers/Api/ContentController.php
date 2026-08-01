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

    public function news()
    {
        $news = \App\Models\News::with('user')->orderBy('date', 'desc')->get();
        return response()->json(\App\Http\Resources\NewsResource::collection($news));
    }

    public function newsDetail($slug)
    {
        $news = \App\Models\News::with('user')->where('slug', $slug)->firstOrFail();
        return response()->json(new \App\Http\Resources\NewsResource($news));
    }
}
