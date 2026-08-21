<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    @if($isEn ?? false)
        <h1>Contact Us — UKM Lises Asmarandana UMMI Secretariat</h1>
        <p>Contact the board of UKM Lises Asmarandana Muhammadiyah Sukabumi University for performance collaborations, event partnerships, dance & music invitations, or new member registration inquiries.</p>

        <section>
            <h2>Secretariat Address & Location</h2>
            <address>
                <strong>UKM Center / Student Activity Building</strong><br />
                Universitas Muhammadiyah Sukabumi (UMMI)<br />
                Jl. R. Syamsudin, S.H. No. 50, Cikole, Sukabumi City<br />
                West Java 43113, Indonesia
            </address>
        </section>

        <section>
            <h2>Official Contacts</h2>
            <ul>
                <li>Email: <a href="mailto:lises@ummi.ac.id">lises@ummi.ac.id</a></li>
                <li>Instagram: <a href="https://www.instagram.com/lisesasmarandana" target="_blank" rel="noopener">@lisesasmarandana</a></li>
                <li>YouTube: <a href="https://www.youtube.com/@lisesasmarandana" target="_blank" rel="noopener">Lises Asmarandana UMMI</a></li>
            </ul>
        </section>

        <nav aria-label="Related Navigation">
            <a href="{{ url('/') }}">Home</a> | 
            <a href="{{ url('/about') }}">About Us</a> | 
            <a href="{{ url('/event') }}">Performance Schedule</a>
        </nav>
    @else
        <h1>Hubungi Kami — Sekretariat UKM Lises Asmarandana UMMI</h1>
        <p>Hubungi pengurus UKM Lises Asmarandana Universitas Muhammadiyah Sukabumi untuk kolaborasi pementasan, kerjasama acara, undangan penampilan seni tari dan musik, atau informasi pendaftaran anggota baru.</p>

        <section>
            <h2>Alamat & Lokasi Sekretariat</h2>
            <address>
                <strong>Gedung UKM / Pusat Kegiatan Mahasiswa</strong><br />
                Universitas Muhammadiyah Sukabumi (UMMI)<br />
                Jl. R. Syamsudin, S.H. No. 50, Cikole, Kec. Cikole<br />
                Kota Sukabumi, Jawa Barat 43113, Indonesia
            </address>
        </section>

        <section>
            <h2>Kontak Resmi</h2>
            <ul>
                <li>Email: <a href="mailto:lises@ummi.ac.id">lises@ummi.ac.id</a></li>
                <li>Instagram: <a href="https://www.instagram.com/lisesasmarandana" target="_blank" rel="noopener">@lisesasmarandana</a></li>
                <li>YouTube: <a href="https://www.youtube.com/@lisesasmarandana" target="_blank" rel="noopener">Lises Asmarandana UMMI</a></li>
            </ul>
        </section>

        <nav aria-label="Navigasi Terkait">
            <a href="{{ url('/') }}">Beranda</a> | 
            <a href="{{ url('/about') }}">Tentang Kami</a> | 
            <a href="{{ url('/event') }}">Jadwal Pementasan</a>
        </nav>
    @endif
</div>
