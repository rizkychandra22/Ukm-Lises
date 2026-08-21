<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Release;

class InformationController extends Controller
{
    public function index()
    {
        $nodeVersion = 'Unknown';
        try {
            $nodeVersion = trim(shell_exec('node -v 2>nul')) ?: 'Unknown';
        } catch (\Exception $e) {}

        $envInfo = [
            'php_version' => phpversion(),
            'node_version' => $nodeVersion,
            'laravel_version' => app()->version(),
            'os' => php_uname('s') . ' ' . php_uname('r'),
            'server' => str_replace(' (Development Server)', '', $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'),
            'timezone' => config('app.timezone'),
        ];

        $dbInfo = [
            'connection' => config('database.default')
        ];

        $releases = Release::orderBy('created_at', 'desc')->get();

        return Inertia::render('Information', [
            'envInfo' => $envInfo,
            'dbInfo' => $dbInfo,
            'releases' => $releases,
        ]);
    }
}
