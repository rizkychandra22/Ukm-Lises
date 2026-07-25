<?php

use App\Http\Controllers\AuthController;
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
Route::middleware(['access:Master,Admin'])->prefix('dashboard')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Route untuk Logout
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('logout');
});

// -------------------------------------------------------------
// 3. LANDING PAGE PUBLIK (PURE REACT SPA)
// -------------------------------------------------------------
// Catch-all route untuk menangani halaman publik selain auth, dashboard, & api
Route::get('/{any?}', function () {
    return view('web');
})->where('any', '^(?!auth|admin|api|dashboard).*$');