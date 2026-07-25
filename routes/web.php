<?php

use Illuminate\Support\Facades\Route;

Route::middleware([\App\Http\Middleware\HandleInertiaRequests::class])->group(function () {
    Route::get('/admin/dashboard', function () {
        return inertia('Dashboard');
    });
});

Route::get('/{any?}', function () {
    return view('web');
})->where('any', '^(?!admin|api|dashboard).*$');