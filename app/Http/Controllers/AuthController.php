<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function create()
    {
        return inertia('Auth/Login');
    }

    public function store(Request $request)
    {
        // Mock authentication process
        // Redirect to admin dashboard
        return redirect('/admin/dashboard');
    }
}
