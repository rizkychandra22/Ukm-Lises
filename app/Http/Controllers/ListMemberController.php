<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\BatchMember;
use App\Services\BatchService;
use App\Services\BatchMemberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListMemberController extends Controller
{
    protected $batchService;
    protected $batchMemberService;

    public function __construct(BatchService $batchService, BatchMemberService $batchMemberService)
    {
        $this->batchService = $batchService;
        $this->batchMemberService = $batchMemberService;
    }

    /**
     * Tampilkan halaman utama (Daftar Anggota + Daftar Angkatan)
     */
    public function index()
    {
        return Inertia::render('IndexMember', [
            'members' => BatchMember::with('batch')->latest()->get(),
            'batches' => Batch::select('id', 'year', 'name_id', 'name_en')->orderBy('year', 'desc')->get(),
        ]);
    }

    /* =========================================================================
     *  CRUD ANGKATAN (BATCH)
     * ========================================================================= */

    public function storeBatch(Request $request)
    {
        $validated = $request->validate([
            'year'    => 'required|string|max:10',
            'name_id' => 'required|string|max:255',
        ]);

        $this->batchService->createBatch($validated);

        return redirect()->back()->with('success', 'Data angkatan & akun berhasil ditambahkan!');
    }

    public function updateBatch(Request $request, Batch $batch)
    {
        $validated = $request->validate([
            'year'     => 'required|string|max:10',
            'name_id'  => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6',
        ]);

        $this->batchService->updateBatch($batch, $validated);

        return redirect()->back()->with('success', 'Data angkatan & akun berhasil diperbarui!');
    }

    public function destroyBatch(Batch $batch)
    {
        $batch->delete();

        return redirect()->back()->with('success', 'Data angkatan & akun berhasil dihapus!');
    }

    /* =========================================================================
     *  CRUD ANGGOTA (BATCH MEMBER)
     * ========================================================================= */

    public function storeMember(Request $request)
    {
        $validated = $request->validate([
            'batch_id'    => 'required|exists:batches,id',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'name'        => 'required|string|max:255',
            'prodi_id'    => 'required|string|max:255',
            'type'        => 'required|in:Administration,Demisioner',
            'periode'     => 'required_if:type,Administration|nullable|string|max:100',
            'position_id' => 'required_if:type,Administration|nullable|string|max:255',
        ]);

        $this->batchMemberService->createMember($validated);

        return redirect()->back()->with('success', 'Anggota berhasil ditambahkan!');
    }

    public function updateMember(Request $request, BatchMember $batchMember)
    {
        $validated = $request->validate([
            'batch_id'    => 'required|exists:batches,id',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'name'        => 'required|string|max:255',
            'prodi_id'    => 'required|string|max:255',
            'type'        => 'required|in:Administration,Demisioner',
            'periode'     => 'required_if:type,Administration|nullable|string|max:100',
            'position_id' => 'required_if:type,Administration|nullable|string|max:255',
        ]);

        $this->batchMemberService->updateMember($batchMember, $validated);

        return redirect()->back()->with('success', 'Data anggota berhasil diperbarui!');
    }

    public function destroyMember(BatchMember $batchMember)
    {
        $this->batchMemberService->deleteMember($batchMember);

        return redirect()->back()->with('success', 'Anggota berhasil dihapus!');
    }
}
