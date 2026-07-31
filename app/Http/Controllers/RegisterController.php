<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Batch;
use App\Models\Major;
use App\Services\BatchService;
use App\Services\BatchMemberService;

class RegisterController extends Controller
{
    protected $batchService;
    protected $batchMemberService;

    public function __construct(BatchService $batchService, BatchMemberService $batchMemberService)
    {
        $this->batchService = $batchService;
        $this->batchMemberService = $batchMemberService;
    }

    public function create()
    {
        return Inertia::render('Auth/Register', [
            'majors' => Major::select('id', 'name_id', 'faculty_id')->get()
        ]);
    }

    public function store(Request $request)
    {
        $messages = [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'major_id.required' => 'Fakultas dan Jurusan wajib dipilih.',
            'major_id.exists' => 'Jurusan tidak valid.',
            'year.required' => 'Tahun angkatan wajib diisi.',
            'year.string' => 'Tahun harus berupa angka teks.',
            'year.min' => 'Tahun angkatan harus 4 digit.',
            'year.max' => 'Tahun angkatan harus 4 digit.',
            'whatsapp.required' => 'Nomor WhatsApp wajib diisi.',
            'whatsapp.max' => 'Nomor WhatsApp maksimal 20 karakter.',
            'instagram.required' => 'Username Instagram wajib diisi.',
            'instagram.max' => 'Username Instagram maksimal 255 karakter.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
        ];

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'major_id'  => 'required|exists:majors,id',
            'year'      => 'required|string|max:4|min:4',
            'whatsapp'  => 'required|string|max:20',
            'instagram' => 'required|string|max:255',
            'image'     => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], $messages);

        $year = $validated['year'];

        // Cek apakah batch sudah ada
        $batch = Batch::where('year', $year)->first();

        if (!$batch) {
            // Buat batch otomatis jika belum ada
            $batchData = [
                'year' => $year,
                'name_id' => 'Lises ' . $year,
                'status' => 'Active',
            ];
            $batch = $this->batchService->createBatch($batchData);
        }

        // Cari periode aktif saat ini
        $activePeriode = \App\Models\BatchMember::where('status', 'Active')
            ->whereNotNull('periode')
            ->value('periode');

        // Siapkan data anggota baru
        $memberData = [
            'batch_id'    => $batch->id,
            'major_id'    => $validated['major_id'],
            'name'        => $validated['name'],
            'type'        => 'Pengurus',
            'status'      => 'Deactive', // Mahasiswa baru belum menjabat penuh
            'position_id' => 'Anggota Baru',
            'periode'     => $activePeriode,
            'instagram'   => $validated['instagram'],
            'whatsapp'    => $validated['whatsapp'],
        ];

        if ($request->hasFile('image')) {
            $memberData['image'] = $request->file('image');
        }

        $this->batchMemberService->createMember($memberData);

        $request->session()->flash('success', 'Registrasi berhasil! Selamat bergabung di Lises Asmarandana.');
        return Inertia::location(route('web'));
    }
}
