<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Gallery;
use App\Http\Resources\GalleryResource;

class ContentController extends Controller
{
    public function events()
    {
        $events = Event::published()
            ->orderByRaw("CASE WHEN status = 'published' THEN 0 WHEN status = 'completed' THEN 1 ELSE 2 END ASC")
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($event) {
                return [
                    'id'          => $event->id,
                    'title_id'    => $event->title_id,
                    'title_en'    => $event->title_en,
                    'slug'        => $event->slug,
                    'image'       => $event->image,
                    'summary_id'  => $event->summary_id,
                    'summary_en'  => $event->summary_en,
                    'type'        => $event->type,
                    'date'        => $event->date,
                    'location_id' => $event->location_id,
                    'location_en' => $event->location_en,
                    'price'       => $event->price,
                    'ticket'      => $event->ticket,
                    'remaining_tickets' => $event->remaining_tickets,
                    'status'      => $event->status,
                ];
            });

        return response()->json($events);
    }

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
