<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\BatchMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

use App\Http\Resources\BatchResource;
use App\Http\Resources\MemberResource;

class MemberApiController extends Controller
{
    /**
     * Ambil data anggota aktif untuk halaman depan
     */
    public function index(Request $request): JsonResponse
    {
        $query = BatchMember::with(['batch', 'major']);

        // Filter berdasarkan type jika ada ('Administration' / 'Demisioner')
        if ($request->has('type') && in_array($request->type, ['Administration', 'Demisioner'])) {
            $query->where('type', $request->type);
        }

        // Filter berdasarkan status ('Active' / 'Deactive')
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $members = $query->orderBy('name', 'asc')->get();
        return response()->json([
            'success' => true,
            'message' => 'Data sharing transaction successfully retrieved',
            'data'    => MemberResource::collection($members),
        ]);
    }

    /**
     * Ambil data angkatan untuk halaman depan
     */
    public function batches(): JsonResponse
    {
        $batches = Batch::orderBy('year', 'desc')->get();
        return response()->json([
            'success' => true,
            'message' => 'Data angkatan successfully retrieved',
            'data'    => BatchResource::collection($batches),
        ]);
    }
}