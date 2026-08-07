<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="object-src 'none'; base-uri 'self'; upgrade-insecure-requests">
    <meta name="referrer" content="no-referrer-when-downgrade">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    {{-- SEO & Dynamic Meta --}}
    <title>{{ $title ?? 'Lises Asmarandana | Seni Musik & Tari UMMI' }}</title>
    <meta name="description" content="{{ $description ?? 'Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi. Merawat budaya, memanggung talenta.' }}">
    <meta name="keywords" content="Lises Asmarandana, UKM Seni UMMI, Musik dan Tari Sukabumi">
    <meta name="author" content="UKM Lises Asmarandana">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- Open Graph / WhatsApp Preview --}}
    <meta property="og:type" content="{{ isset($news) ? 'article' : 'website' }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $title ?? 'Lises Asmarandana | Seni Musik & Tari UMMI' }}">
    <meta property="og:description" content="{{ $description ?? 'Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.' }}">
    
    {{-- Gambar Dinamis / Absolute URL --}}
    <meta property="og:image" content="{{ $image ?? url(Vite::asset('resources/js/FrontEnd-React-Ts/src/assets/logo-bg-light.png')) }}">
    <meta property="og:image:secure_url" content="{{ $image ?? url(Vite::asset('resources/js/FrontEnd-React-Ts/src/assets/logo-bg-light.png')) }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Lises Asmarandana UMMI">

    {{-- Twitter / X Card --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title" content="{{ $title ?? 'Lises Asmarandana | Seni Musik & Tari UMMI' }}">
    <meta name="twitter:description" content="{{ $description ?? 'Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.' }}">
    <meta name="twitter:image" content="{{ $image ?? url(Vite::asset('resources/js/FrontEnd-React-Ts/src/assets/logo-bg-light.png')) }}">

    {{-- Favicon --}}
    <link rel="icon" type="image/png" href="{{ url(Vite::asset('resources/js/FrontEnd-React-Ts/src/assets/logo-bg-light.png')) }}" />

    {{-- Preconnect Font Google --}}
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600&family=Inter:wght@400;500;600&display=swap"></noscript>

    {{-- JSON-LD Schema.org Structured Data for Google --}}
    <script type="application/ld+json">
    {
      "@@context": "https://schema.org",
      "@@type": "EducationalOrganization",
      "name": "UKM Lises Asmarandana",
      "alternateName": ["Lises Asmarandana UMMI", "Seni Musik dan Tari UMMI"],
      "url": "{{ url('/') }}",
      "logo": "{{ url(Vite::asset('resources/js/FrontEnd-React-Ts/src/assets/logo-bg-light.png')) }}",
      "description": "Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.",
      "address": {
        "@@type": "PostalAddress",
        "addressLocality": "Sukabumi",
        "addressRegion": "Jawa Barat",
        "addressCountry": "ID"
      },
      "parentOrganization": {
        "@@type": "CollegeOrUniversity",
        "name": "Universitas Muhammadiyah Sukabumi",
        "url": "https://ummi.ac.id"
      }
    }
    </script>

    {{-- Vite Scripts --}}
    @viteReactRefresh
    @vite('resources/js/FrontEnd-React-Ts/src/main.tsx')

    @if(session('success'))
      <meta id="flash-message" data-message="{{ json_encode(session('success')) }}">
      <script>
        window.flashMessage = JSON.parse(document.getElementById('flash-message').dataset.message);
      </script>
    @endif
</head>
<body class="bg-background text-foreground antialiased">
    <div id="root"></div>
</body>
</html>