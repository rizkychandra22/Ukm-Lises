<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    <h1>Daftar Anggota, Struktur Pengurus & Angkatan — Lises Asmarandana UMMI</h1>
    <p>Informasi struktur organisasi, susunan dewan pengurus harian (DPH), anggota aktif, dan riwayat angkatan alumni / demisioner UKM Seni Musik & Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.</p>

    <section>
        <h2>Ringkasan Keanggotaan</h2>
        <ul>
            <li>Total Anggota Terdaftar: {{ $totalMembers ?? '100+' }} Mahasiswa</li>
            <li>Total Angkatan / Generasi: {{ $totalBatches ?? '10+' }} Angkatan</li>
        </ul>
    </section>

    <section>
        <h2>Divisi & Departemen</h2>
        <ul>
            <li>Badan Pengurus Harian (Ketua Umum, Sekretaris, Bendahara)</li>
            <li>Divisi Seni Musik & Karawitan Tradisional</li>
            <li>Divisi Seni Tari & Koreografi</li>
            <li>Divisi Hubungan Masyarakat & Media Kreatif</li>
            <li>Divisi Logistik, Sarana & Prasarana</li>
        </ul>
    </section>

    <nav aria-label="Navigasi Terkait">
        <a href="{{ url('/') }}">Beranda</a> | 
        <a href="{{ url('/about') }}">Profil Organisasi</a> | 
        <a href="{{ url('/contact') }}">Hubungi Kami</a>
    </nav>
</div>
