<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
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

        // Buat kunci Rate Limiter berdasarkan input login dan IP address
        $throttleKey = Str::transliterate(Str::lower($loginInput).'|'.request()->ip());

        // Cek apakah sudah melebihi 5 kali percobaan (diblokir 30 menit)
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $minutes = ceil($seconds / 60);

            throw ValidationException::withMessages([
                'login' => ["Terlalu banyak percobaan login. Akun diblokir sementara. Silakan coba lagi dalam {$minutes} menit."],
            ]);
        }

        $attemptCredentials = [
            $fieldType => $loginInput,
            'password' => $credentials['password'],
        ];

        // Lakukan autentikasi
        if (!Auth::attempt($attemptCredentials, $credentials['remember'] ?? false)) {
            // Tambahkan hit kegagalan login dengan waktu blokir 30 menit (1800 detik)
            RateLimiter::hit($throttleKey, 1800);

            throw ValidationException::withMessages([
                'login' => ['Username atau password yang Anda masukkan salah.'],
            ]);
        }

        // Hapus catatan kegagalan jika berhasil login
        RateLimiter::clear($throttleKey);

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

    /**
     * Memperbarui profil user.
     */
    public function updateProfile(User $user, array $data): User
    {
        $user->name = $data['name'];
        $user->username = $data['username'];
        
        if (!empty($data['password'])) {
            $user->password = \Illuminate\Support\Facades\Hash::make($data['password']);
        }

        $user->save();

        return $user;
    }
}