<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Access
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Cek apakah user sudah login
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Sesi login Anda telah berakhir. Silakan login kembali.');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Cek apakah user memiliki salah satu dari role yang diizinkan
        if ($user->hasAnyRole($roles)) {
            return $next($request);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Jika tidak punya akses Redirect tanpa Logout
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Anda tidak memiliki hak akses untuk melakukan tindakan ini.'
            ], 403);
        }
        
        // Redirect balik ke Login dengan pesan error
        return redirect()->route('login')->with('error', 'Akun Anda tidak memiliki hak akses ke area Dashboard.');
    }
}