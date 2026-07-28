<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Batch;
use App\Models\BatchMember;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $demisionerCount = BatchMember::where('type', 'Demisioner')->count();
        $kepengurusanCount = BatchMember::where('type', 'Administration')->count();
        $totalAnggota = $demisionerCount + $kepengurusanCount;
        $totalAngkatan = Batch::count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_anggota' => $totalAnggota,
                'demisioner' => $demisionerCount,
                'kepengurusan' => $kepengurusanCount,
                'total_angkatan' => $totalAngkatan
            ]
        ]);
    }
}
