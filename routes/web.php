<?php

use Illuminate\Support\Facades\Route;

Route::middleware([\App\Http\Middleware\HandleInertiaRequests::class])->group(function () {
    Route::get('/auth/login', [\App\Http\Controllers\AuthController::class, 'create'])->name('login');
    Route::post('/auth/login', [\App\Http\Controllers\AuthController::class, 'store']);
    
    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    });
});

Route::get('/{any?}', function () {
    return view('web');
})->where('any', '^(?!auth|admin|api|dashboard).*$');