<?php

use App\Http\Controllers\Api\ContentController;
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

// Endpoint Content Public
Route::get('/galleries', [ContentController::class, 'galleries']);
Route::get('/news', [ContentController::class, 'news']);
Route::get('/news/{slug}', [ContentController::class, 'newsDetail']);
Route::get('/events', [ContentController::class, 'events']);

// Endpoint Tiket & Pembayaran
Route::get('/payment-accounts', [ContentController::class, 'paymentAccounts']);
Route::get('/generate-order-code', [ContentController::class, 'generateOrderCode']);
Route::post('/orders', [ContentController::class, 'storeOrder']);
Route::get('/orders/track/{order_code}', [ContentController::class, 'trackOrder']);