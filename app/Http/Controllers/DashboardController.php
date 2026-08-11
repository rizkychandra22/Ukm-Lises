<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Batch;
use App\Models\BatchMember;
use App\Models\Gallery;
use App\Models\News;
use App\Models\Event;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $demisionerCount = BatchMember::whereHas('batch', function ($query) {
            $query->where('status', 'Deactive');
        })->count();

        $kepengurusanCount = BatchMember::whereHas('batch', function ($query) {
            $query->where('status', 'Active');
        })->count();

        $totalAnggota = $demisionerCount + $kepengurusanCount;
        $totalAngkatan = Batch::count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_anggota' => $totalAnggota,
                'demisioner' => $demisionerCount,
                'kepengurusan' => $kepengurusanCount,
                'total_angkatan' => $totalAngkatan,
                'total_pengunjung' => 0, // Implement visitor tracking
                'total_galeri' => Gallery::count(),
                'total_berita' => News::count(),
                'total_event' => Event::count(),
            ]
        ]);
    }
}
