<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Menangani proses login user (bisa menggunakan username atau email).
     */
    public function login(array $credentials): User
    {
        $loginInput = $credentials['login'];

        // Deteksi apakah input merupakan email atau username
        $fieldType = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $attemptCredentials = [
            $fieldType => $loginInput,
            'password' => $credentials['password'],
        ];

        // Lakukan autentikasi
        if (!Auth::attempt($attemptCredentials, $credentials['remember'] ?? false)) {
            throw ValidationException::withMessages([
                'login' => ['Username/Email atau password yang Anda masukkan salah.'],
            ]);
        }

        // Regenerasi session untuk mencegah Session Fixation Attack
        request()->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();

        return $user;
    }

    /**
     * Menangani proses logout dan pembersihan session.
     */
    public function logout(): void
    {
        Auth::guard('web')->logout();

        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}