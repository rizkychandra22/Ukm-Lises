<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gallery;
use Inertia\Inertia;
use App\Services\GalleryService;
use App\Http\Resources\GalleryResource;

class GalleryController extends Controller
{
    public function __construct(
        protected GalleryService $galleryService
    ) {}

    public function index()
    {
        $galleries = Gallery::latest()->paginate(10);
        return Inertia::render('IndexGallery', [
            'galleries' => GalleryResource::collection($galleries)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title_id' => 'required|string|max:255',
            'desc_id' => 'nullable|string',
            'image' => 'required|image|max:10048', // 2MB limit
            'is_active' => 'boolean',
            'is_index' => 'boolean',
        ]);

        if ($request->is_active) {
            $activeCount = Gallery::where('is_active', true)->count();
            if ($activeCount >= 3) {
                return back()->withErrors(['is_active' => 'Maksimal 3 gambar yang bisa aktif sebagai slide.']);
            }
        }

        if ($request->is_index) {
            Gallery::where('is_index', true)->update(['is_index' => false]);
        }

        $data = $request->only(['title_id', 'desc_id', 'is_active', 'is_index']);
        
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $this->galleryService->createGallery($data);

        return back()->with('success', 'Galeri berhasil ditambahkan!');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $request->validate([
            'title_id' => 'required|string|max:255',
            'desc_id' => 'nullable|string',
            'image' => 'nullable|image|max:10048', // 2MB limit
            'is_active' => 'boolean',
            'is_index' => 'boolean',
        ]);

        if ($request->is_active && !$gallery->is_active) {
            $activeCount = Gallery::where('is_active', true)->count();
            if ($activeCount >= 3) {
                return back()->withErrors(['is_active' => 'Maksimal 3 gambar yang bisa aktif sebagai slide.']);
            }
        }

        if ($request->is_index && !$gallery->is_index) {
            Gallery::where('is_index', true)->update(['is_index' => false]);
        }

        $data = $request->only(['title_id', 'desc_id', 'is_active', 'is_index']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image');
        }

        $this->galleryService->updateGallery($gallery, $data);

        return back()->with('success', 'Galeri berhasil diperbarui!');
    }

    public function destroy(Gallery $gallery)
    {
        $this->galleryService->deleteGallery($gallery);

        return back()->with('success', 'Galeri berhasil dihapus!');
    }
}
