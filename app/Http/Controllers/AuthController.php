<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Inject AuthService melalui Constructor.
     */
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Menampilkan halaman Form Login (Admin Inertia).
     */
    public function index(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Memproses autentikasi pengguna.
     */
    public function login(Request $request): RedirectResponse
    {
        // Validasi input awal
        $credentials = $request->validate([
            'login'    => ['required', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ], [
            'login.required'    => 'Username atau Email wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ]);

        // Eksekusi bisnis logika di AuthService
        $this->authService->login($credentials);

        // Redirect ke dashboard setelah login berhasil
        return redirect()->intended('/dashboard')->with('success', 'Anda berhasil masuk');
    }

    /**
     * Memproses logout pengguna.
     */
    public function logout(): RedirectResponse
    {
        $this->authService->logout();

        return redirect()->route('login')->with('success', 'Anda berhasil keluar');
    }
}