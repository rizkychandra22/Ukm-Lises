<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\BatchMember;
use App\Models\Major;
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
            'majors' => Major::select('id', 'faculty_id', 'faculty_en', 'name_id', 'name_en', 'degree')->get(),
            'members' => BatchMember::with(['batch', 'major'])->latest()->get(),
            'batches' => Batch::select('id', 'user_id', 'year', 'name_id', 'name_en', 'status')->orderBy('year', 'desc')->get(),
        ]);
    }

    /* =========================================================================
     *  CRUD ANGKATAN (BATCH)
     * ========================================================================= */

    public function storeBatch(Request $request)
    {
        if (!auth()->user()->hasAnyRole(['Developer', 'Admin'])) {
            abort(403, 'Hanya Developer dan Admin yang dapat mengelola data angkatan.');
        }

        $validated = $request->validate([
            'year'    => 'required|string|max:10',
            'name_id' => 'required|string|max:255',
            'status'  => 'required|in:Active,Deactive',
        ]);

        $this->batchService->createBatch($validated);

        return redirect()->back()->with('success', 'Data angkatan & akun berhasil ditambahkan!');
    }

    public function updateBatch(Request $request, Batch $batch)
    {
        if (!auth()->user()->hasAnyRole(['Developer', 'Admin'])) {
            abort(403, 'Hanya Developer dan Admin yang dapat mengelola data angkatan.');
        }

        $validated = $request->validate([
            'year'     => 'required|string|max:10',
            'name_id'  => 'required|string|max:255',
            'status'   => 'required|in:Active,Deactive',
            'username' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6',
        ]);

        $this->batchService->updateBatch($batch, $validated);

        return redirect()->back()->with('success', 'Data angkatan & akun berhasil diperbarui!');
    }

    public function destroyBatch(Batch $batch)
    {
        if (!auth()->user()->hasAnyRole(['Developer', 'Admin'])) {
            abort(403, 'Hanya Developer dan Admin yang dapat mengelola data angkatan.');
        }

        $this->batchService->deleteBatch($batch);

        return redirect()->back()->with('success', 'Data angkatan & akun berhasil dihapus!');
    }

    /* =========================================================================
     *  CRUD ANGGOTA (BATCH MEMBER)
     * ========================================================================= */

    public function storeMember(Request $request)
    {
        $validated = $request->validate([
            'batch_id'    => 'required|exists:batches,id',
            'major_id'    => 'required|exists:majors,id',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:Demisioner,Pengurus',
            'status'      => 'nullable|in:Active,Deactive',
            'periode'     => 'nullable|string|max:100',
            'position_id' => 'nullable|string|max:255',
            'whatsapp'    => 'nullable|string|max:255',
            'instagram'   => 'nullable|string|max:255',
        ]);

        $user = auth()->user();
        if ($user->hasRole('User')) {
            $userBatch = Batch::where('user_id', $user->id)->first();
            if (!$userBatch || $validated['batch_id'] != $userBatch->id) {
                abort(403, 'Anda hanya dapat mengelola data anggota dari angkatan Anda sendiri.');
            }
        }

        $this->batchMemberService->createMember($validated);

        return redirect()->back()->with('success', 'Anggota berhasil ditambahkan!');
    }

    public function updateMember(Request $request, BatchMember $batchMember)
    {
        $validated = $request->validate([
            'batch_id'    => 'required|exists:batches,id',
            'major_id'    => 'required|exists:majors,id',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'name'        => 'required|string|max:255',
            'type'        => 'required|in:Demisioner,Pengurus',
            'status'      => 'nullable|in:Active,Deactive',
            'periode'     => 'nullable|string|max:100',
            'position_id' => 'nullable|string|max:255',
            'whatsapp'    => 'nullable|string|max:255',
            'instagram'   => 'nullable|string|max:255',
        ]);

        $user = auth()->user();
        if ($user->hasRole('Admin')) {
            if (!($batchMember->type === 'Pengurus' && $batchMember->status === 'Active')) {
                abort(403, 'Admin hanya dapat mengedit anggota yang sedang menjabat dalam kepengurusan.');
            }
        }
        if ($user->hasRole('User')) {
            $userBatch = Batch::where('user_id', $user->id)->first();
            if (!$userBatch || $batchMember->batch_id != $userBatch->id || $validated['batch_id'] != $userBatch->id) {
                abort(403, 'Anda hanya dapat mengelola data anggota dari angkatan Anda sendiri.');
            }
            if ($batchMember->type === 'Pengurus' && $batchMember->status === 'Active') {
                abort(403, 'Anggota yang sedang menjabat dalam kepengurusan hanya dapat dikelola oleh Admin.');
            }
        }

        $this->batchMemberService->updateMember($batchMember, $validated);

        return redirect()->back()->with('success', 'Data anggota berhasil diperbarui!');
    }

    public function destroyMember(BatchMember $batchMember)
    {
        $user = auth()->user();
        if ($user->hasRole('Admin')) {
            if (!($batchMember->type === 'Pengurus' && $batchMember->status === 'Active')) {
                abort(403, 'Admin hanya dapat menghapus anggota yang sedang menjabat dalam kepengurusan.');
            }
        }
        if ($user->hasRole('User')) {
            $userBatch = Batch::where('user_id', $user->id)->first();
            if (!$userBatch || $batchMember->batch_id != $userBatch->id) {
                abort(403, 'Anda hanya dapat mengelola data anggota dari angkatan Anda sendiri.');
            }
            if ($batchMember->type === 'Pengurus' && $batchMember->status === 'Active') {
                abort(403, 'Anggota yang sedang menjabat dalam kepengurusan tidak dapat dihapus oleh akun angkatan.');
            }
        }

        $this->batchMemberService->deleteMember($batchMember);

        return redirect()->back()->with('success', 'Anggota berhasil dihapus!');
    }
}
