<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    @if($isEn ?? false)
        <h1>Member Directory, Board Structure & Generations — Lises Asmarandana UMMI</h1>
        <p>Organizational structure information, executive daily board roster, active student members, and alumni batch history of UKM Music & Dance Arts Lises Asmarandana Muhammadiyah Sukabumi University.</p>

        <section>
            <h2>Membership Summary</h2>
            <ul>
                <li>Total Registered Members: {{ $totalMembers ?? '100+' }} Students</li>
                <li>Total Generations / Batches: {{ $totalBatches ?? '10+' }} Batches</li>
            </ul>
        </section>

        <section>
            <h2>Divisions & Departments</h2>
            <ul>
                <li>Daily Executive Board (President, Secretary, Treasurer)</li>
                <li>Traditional Music & Karawitan Division</li>
                <li>Dance & Choreography Art Division</li>
                <li>Public Relations & Creative Media Division</li>
                <li>Logistics & Infrastructure Division</li>
            </ul>
        </section>

        <nav aria-label="Related Navigation">
            <a href="{{ url('/') }}">Home</a> | 
            <a href="{{ url('/about') }}">Organization Profile</a> | 
            <a href="{{ url('/contact') }}">Contact Us</a>
        </nav>
    @else
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
    @endif
</div>
