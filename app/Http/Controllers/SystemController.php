<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SystemController extends Controller
{
    /**
     * Display the IT System dashboard.
     */
    public function index()
    {
        // 1. Get Environment Info
        $envInfo = [
            'app_name' => config('app.name'),
            'environment' => config('app.env'),
            'debug_mode' => config('app.debug'),
            'php_version' => phpversion(),
            'laravel_version' => app()->version(),
            'os' => php_uname('s') . ' ' . php_uname('r'),
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'timezone' => config('app.timezone'),
        ];

        // 2. Get Disk Usage
        $diskPath = base_path();
        $diskTotal = disk_total_space($diskPath);
        $diskFree = disk_free_space($diskPath);
        $diskUsed = $diskTotal - $diskFree;
        $diskUsagePercent = $diskTotal > 0 ? round(($diskUsed / $diskTotal) * 100, 2) : 0;

        $diskInfo = [
            'total' => $this->formatBytes($diskTotal),
            'used' => $this->formatBytes($diskUsed),
            'free' => $this->formatBytes($diskFree),
            'usage_percent' => $diskUsagePercent
        ];

        // 3. Database Info (PostgreSQL)
        $dbInfo = [
            'connection' => config('database.default'),
            'status' => 'Disconnected',
            'active_connections' => 0,
            'database_name' => config('database.connections.' . config('database.default') . '.database')
        ];

        try {
            DB::connection()->getPdo();
            $dbInfo['status'] = 'Connected';
            
            if (config('database.default') === 'pgsql') {
                $connections = DB::select("SELECT count(*) as count FROM pg_stat_activity");
                $dbInfo['active_connections'] = $connections[0]->count ?? 0;
            }
        } catch (\Exception $e) {
            $dbInfo['status'] = 'Error: ' . $e->getMessage();
        }

        // 4. Memory/CPU (Best effort, varies by OS)
        $sysInfo = [
            'memory_usage' => $this->formatBytes(memory_get_usage(true)),
            'memory_peak' => $this->formatBytes(memory_get_peak_usage(true)),
        ];

        // 5. Read recent logs
        $logs = [];
        $logFile = storage_path('logs/laravel.log');
        if (File::exists($logFile)) {
            // Read last 100 lines efficiently
            $lines = $this->tail($logFile, 100);
            $logs = $lines ? explode("\n", trim($lines)) : [];
            $logs = array_reverse($logs); // Newest first
        }

        return Inertia::render('IndexSystem', [
            'envInfo' => $envInfo,
            'diskInfo' => $diskInfo,
            'dbInfo' => $dbInfo,
            'sysInfo' => $sysInfo,
            'logs' => $logs
        ]);
    }

    /**
     * Execute artisan cache commands
     */
    public function clearCache(Request $request)
    {
        $type = $request->input('type');

        try {
            switch ($type) {
                case 'optimize':
                    Artisan::call('optimize:clear');
                    $message = 'Semua cache (Config, Route, View) berhasil dibersihkan.';
                    break;
                case 'config':
                    Artisan::call('config:clear');
                    $message = 'Config cache berhasil dibersihkan.';
                    break;
                case 'route':
                    Artisan::call('route:clear');
                    $message = 'Route cache berhasil dibersihkan.';
                    break;
                case 'view':
                    Artisan::call('view:clear');
                    $message = 'View cache berhasil dibersihkan.';
                    break;
                default:
                    return back()->with('error', 'Tipe cache tidak valid.');
            }

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membersihkan cache: ' . $e->getMessage());
        }
    }

    /**
     * Read the last N lines of a file
     */
    private function tail($filepath, $lines = 1)
    {
        $f = @fopen($filepath, "rb");
        if ($f === false) return false;
        
        $cursor = -1;
        fseek($f, $cursor, SEEK_END);
        $char = fgetc($f);
        
        $line = '';
        while ($char === "\n" || $char === "\r") {
            fseek($f, --$cursor, SEEK_END);
            $char = fgetc($f);
        }
        
        while ($lines > 0) {
            if (fseek($f, $cursor--, SEEK_END) === -1) {
                rewind($f);
                $line = fread($f, filesize($filepath) - ftell($f)) . $line;
                break;
            }
            $char = fgetc($f);
            if ($char === "\n") {
                $lines--;
            }
            $line = $char . $line;
        }
        fclose($f);
        return $line;
    }

    /**
     * Helper to format bytes to human readable format
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
