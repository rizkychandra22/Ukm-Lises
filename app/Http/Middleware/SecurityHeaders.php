<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Security headers
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        
        // Content Security Policy (Disesuaikan untuk Vite Local Dev & Google Fonts)
        $response->headers->set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 http://127.0.0.1:5173; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: http://localhost:5173 http://127.0.0.1:5173 res.cloudinary.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' ws: wss: http://localhost:5173 http://127.0.0.1:5173;");

        return $response;
    }
}
