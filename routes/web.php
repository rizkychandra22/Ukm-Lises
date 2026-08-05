<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\ListMemberController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SitemapController;

// -------------------------------------------------------------
// AUTHENTICATION ROUTES (GUEST ONLY)
// -------------------------------------------------------------
Route::middleware('guest')->group(function () {
    Route::get('/auth/login', [AuthController::class, 'index'])->name('login');
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::get('/member/registration', [RegisterController::class, 'create'])->name('register');
    Route::post('/member/registration', [RegisterController::class, 'store']);
});

// -------------------------------------------------------------
// DASHBOARD / ADMIN PANEL (AUTHENTICATED & ACCESSIBLE BY ROLES)
// -------------------------------------------------------------
Route::middleware(['access:Developer,Admin,User'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

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
        Route::put('/members/{batchMember}', [ListMemberController::class, 'updateMember'])->name('members.update');
        Route::delete('/members/{batchMember}', [ListMemberController::class, 'destroyMember'])->name('members.destroy');
    });
});

// ---------------------------------------------------------
// MENU WEBSITE (GALLERY, NEWS, EVENT, ORDER, BANK) - DEVELOPER & ADMIN ONLY
// ---------------------------------------------------------
Route::middleware(['access:Developer,Admin'])->prefix('dashboard')->group(function () {
    Route::resource('gallery', GalleryController::class)->except(['create', 'show', 'edit']);
    Route::resource('news', NewsController::class)->except(['show']);
    Route::get('/events', [EventController::class, 'index'])->name('events.index');

    // CRUD Event
    Route::post('/events', [EventController::class, 'storeEvent'])->name('events.store');
    Route::put('/events/{event}', [EventController::class, 'updateEvent'])->name('events.update');
    Route::delete('/events/{event}', [EventController::class, 'destroyEvent'])->name('events.destroy');

    // Manajemen Pesanan Tiket (Order)
    Route::post('/orders', [EventController::class, 'storeOrder'])->name('orders.store');
    Route::put('/orders/{order}/status', [EventController::class, 'updateOrderStatus'])->name('orders.update-status');
    Route::delete('/orders/{order}', [EventController::class, 'destroyOrder'])->name('orders.destroy');

    // Manajemen Rekening Bank / Pembayaran
    Route::post('/accounts', [EventController::class, 'storeAccount'])->name('accounts.store');
    Route::put('/accounts/{account}', [EventController::class, 'updateAccount'])->name('accounts.update');
    Route::delete('/accounts/{account}', [EventController::class, 'destroyAccount'])->name('accounts.destroy');
});

// -------------------------------------------------------------
// DASHBOARD FALLBACK ROUTE (Mencegah 404 & 405 di Dashboard)
// -------------------------------------------------------------
Route::middleware(['access:Developer,Admin,User'])->prefix('dashboard')->group(function () {
    Route::any('{any}', function () {
        return inertia('NotFound');
    })->where('any', '.*');
});

// -------------------------------------------------------------
// SITEMAP XML & LANDING PAGE PUBLIK (PURE REACT SPA)
// -------------------------------------------------------------
Route::get('/sitemap.xml', [SitemapController::class, 'index']);

// Catch-all route untuk menangani halaman publik selain auth, dashboard, & api
Route::get('/{any?}', function () {
    return view('web');
})->where('any', '^(?!auth|admin|api|dashboard|sitemap\.xml).*$')->name('web');