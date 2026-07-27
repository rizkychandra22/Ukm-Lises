<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ListMemberController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// -------------------------------------------------------------
// 1. AUTHENTICATION ROUTES (GUEST ONLY)
// -------------------------------------------------------------
Route::middleware('guest')->group(function () {
    Route::get('/auth/login', [AuthController::class, 'index'])->name('login');
    Route::post('/auth/login', [AuthController::class, 'login']);
});

// -------------------------------------------------------------
// 2. DASHBOARD / ADMIN PANEL (AUTHENTICATED & ACCESSIBLE BY ROLES)
// -------------------------------------------------------------
Route::middleware(['access:Master,Admin,User'])->prefix('dashboard')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Route untuk Logout & Update Profile
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('logout');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');

    // ---------------------------------------------------------
    // ROUTE KELOLA ANGGOTA & ANGKATAN (LIST MEMBER)
    // ---------------------------------------------------------
    Route::prefix('list-member')->name('list-member.')->group(function () {
        // Halaman utama
        Route::get('/', [ListMemberController::class, 'index'])->name('index');

        // CRUD Angkatan (Batch)
        Route::post('/batches', [ListMemberController::class, 'storeBatch'])->name('batches.store');
        Route::put('/batches/{batch}', [ListMemberController::class, 'updateBatch'])->name('batches.update');
        Route::delete('/batches/{batch}', [ListMemberController::class, 'destroyBatch'])->name('batches.destroy');

        // CRUD Anggota (Batch Member)
        Route::post('/members', [ListMemberController::class, 'storeMember'])->name('members.store');
        Route::post('/members/{batchMember}', [ListMemberController::class, 'updateMember'])->name('members.update');
        Route::delete('/members/{batchMember}', [ListMemberController::class, 'destroyMember'])->name('members.destroy');
    });
});

// -------------------------------------------------------------
// 3. LANDING PAGE PUBLIK (PURE REACT SPA)
// -------------------------------------------------------------
// Catch-all route untuk menangani halaman publik selain auth, dashboard, & api
Route::get('/{any?}', function () {
    return view('web');
})->where('any', '^(?!auth|admin|api|dashboard).*$');