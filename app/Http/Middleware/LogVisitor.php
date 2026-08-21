<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Visitor;
use Carbon\Carbon;

class LogVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $ip = $request->ip();
            $today = Carbon::today()->toDateString();
            $userAgent = $request->userAgent() ?? '';
            
            // Simple device detection
            $deviceName = 'Unknown Device';
            if (preg_match('/windows/i', $userAgent)) {
                $deviceName = 'Windows';
            } elseif (preg_match('/macintosh|mac os x/i', $userAgent)) {
                $deviceName = 'Mac';
            } elseif (preg_match('/linux/i', $userAgent)) {
                $deviceName = 'Linux';
            }
            
            if (preg_match('/iphone/i', $userAgent)) {
                $deviceName = 'iPhone';
            } elseif (preg_match('/ipad/i', $userAgent)) {
                $deviceName = 'iPad';
            } elseif (preg_match('/android/i', $userAgent)) {
                $deviceName = 'Android';
            }

            // We use firstOrCreate to avoid duplicate entries for the same IP on the same day
            Visitor::firstOrCreate(
                ['ip_address' => $ip, 'visit_date' => $today],
                ['device_name' => $deviceName]
            );
        } catch (\Exception $e) {
            // Silently ignore tracking errors so they don't break the app
        }

        return $next($request);
    }
}
