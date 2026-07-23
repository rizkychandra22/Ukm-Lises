<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="object-src 'none'; base-uri 'self'; upgrade-insecure-requests">
    <meta name="referrer" content="no-referrer-when-downgrade">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    {{-- SEO Dasar Google --}}
    <title>{{ $title ?? 'Lises Asmarandana | Seni Musik & Tari UMMI' }}</title>
    <meta name="description" content="{{ $description ?? 'Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi. Merawat budaya, memanggung talenta.' }}">
    <meta name="keywords" content="Lises Asmarandana, UKM Seni UMMI, Seni Musik Sukabumi, Tari Tradisional UMMI, Universitas Muhammadiyah Sukabumi, UKM Kampus">
    <meta name="author" content="UKM Lises Asmarandana">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- Open Graph Meta (Preview WhatsApp, Facebook, LinkedIn, Telegram) --}}
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $title ?? 'Lises Asmarandana | Seni Musik & Tari UMMI' }}">
    <meta property="og:description" content="{{ $description ?? 'Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi. Merawat budaya, memanggung talenta.' }}">
    <meta property="og:image" content="{{ Vite::asset('!FrontEnd-React-Ts/src/assets/logo-bg-light.png') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Lises Asmarandana UMMI">

    {{-- Twitter / X Card --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title" content="{{ $title ?? 'Lises Asmarandana | Seni Musik & Tari UMMI' }}">
    <meta name="twitter:description" content="{{ $description ?? 'Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.' }}">
    <meta name="twitter:image" content="{{ Vite::asset('!FrontEnd-React-Ts/src/assets/logo-bg-light.png') }}">

    {{-- Favicon --}}
    <link rel="icon" type="image/png" href="{{ Vite::asset('!FrontEnd-React-Ts/src/assets/logo-bg-light.png') }}" />

    {{-- Preconnect Font Google (Untuk Performa) --}}
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">

    {{-- Vite Scripts --}}
    @viteReactRefresh
    @vite('!FrontEnd-React-Ts/src/main.tsx')
</head>
<body class="bg-background text-foreground antialiased">
    <div id="root"></div>
</body>
</html>