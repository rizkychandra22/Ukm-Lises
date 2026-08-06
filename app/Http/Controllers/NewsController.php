<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function __construct(
        protected \App\Services\NewsService $newsService
    ) {}

    public function index(Request $request)
    {
        $search = $request->query('search');
        $sortBy = $request->query('sortBy', 'created_at');
        $sortOrder = $request->query('sortOrder', 'desc');

        $news = \App\Models\News::with('user')
            ->when($search, function ($query, $search) {
                $query->where('title_id', 'like', "%{$search}%")
                      ->orWhere('title_en', 'like', "%{$search}%");
            })
            ->orderBy($sortBy, $sortOrder)
            ->paginate(10)
            ->withQueryString();

        return \Inertia\Inertia::render('IndexNews', [
            'news' => $news,
            'filters' => $request->only(['search', 'sortBy', 'sortOrder']),
        ]);
    }

    public function create()
    {
        return \Inertia\Inertia::render('Feature/News/Components/Form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:Pementasan,Pelatihan,Prestasi,Aktivitas',
            'date' => 'required|date',
            'title_id' => 'required|string|max:255',
            'summary_id' => 'required|string|max:1000',
            'description_id' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:10048',
        ]);

        $data['user_id'] = $request->user()->id;

        $this->newsService->createNews($data);

        return redirect()->route('news.index');
    }

    public function edit(\App\Models\News $news)
    {
        return \Inertia\Inertia::render('Feature/News/Components/Form', [
            'news' => (new \App\Http\Resources\NewsResource($news))->resolve()
        ]);
    }

    public function update(Request $request, \App\Models\News $news)
    {
        $data = $request->validate([
            'type' => 'required|in:Pementasan,Pelatihan,Prestasi,Aktivitas',
            'date' => 'required|date',
            'title_id' => 'required|string|max:255',
            'summary_id' => 'required|string|max:1000',
            'description_id' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10048',
        ]);

        $this->newsService->updateNews($news, $data);

        return redirect()->route('news.index');
    }

    public function destroy(\App\Models\News $news)
    {
        $this->newsService->deleteNews($news);

        return redirect()->route('news.index');
    }
}