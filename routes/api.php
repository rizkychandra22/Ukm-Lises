<?php

use App\Http\Controllers\Api\MemberApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| API Routes untuk Frontend React SPA
|--------------------------------------------------------------------------
| Route di sini bisa diakses oleh Public (tanpa token) untuk ditampilkan 
| di halaman Landing Page atau halaman publik lainnya.
*/

// Endpoint Get Data Anggota & Angkatan Public
Route::get('/members', [MemberApiController::class, 'index']);
Route::get('/batches', [MemberApiController::class, 'batches']);