<?php

namespace App\Http\Controllers;

use App\Models\Release;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReleaseController extends Controller
{
    public function index()
    {
        $releases = Release::latest()->get();
        return Inertia::render('Dev/Release', [
            'releases' => $releases
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'version' => 'required|string|unique:releases,version',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
        ]);

        Release::create($validated);

        return redirect()->back()->with('success', 'Release berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $release = Release::findOrFail($id);
        
        $validated = $request->validate([
            'version' => 'required|string|unique:releases,version,' . $release->id,
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
        ]);

        $release->update($validated);

        return redirect()->back()->with('success', 'Release berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $release = Release::findOrFail($id);
        $release->delete();

        return redirect()->back()->with('success', 'Release berhasil dihapus.');
    }
}
