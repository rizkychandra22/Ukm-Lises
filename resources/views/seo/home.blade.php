<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    @if($isEn ?? false)
        <h1>Student Activity Unit of Music and Dance Arts Lises Asmarandana - UMMI Sukabumi</h1>
        <p>Welcome to the official website of UKM Lises Asmarandana Muhammadiyah Sukabumi University. Preserving culture, showcasing musical talents and traditional Sundanese as well as contemporary Indonesian dance.</p>
        
        <section>
            <h2>Our Statistics & Achievements</h2>
            <ul>
                <li>Total Active Members: {{ $stats['members'] ?? '100+' }} Students</li>
                <li>Total Generations / Batches: {{ $stats['batches'] ?? '10+' }} Batches</li>
                <li>Total Events & Performances: {{ $stats['events'] ?? '20+' }} Performances</li>
            </ul>
        </section>

        <section>
            <h2>Art Divisions of Lises Asmarandana</h2>
            <div>
                <h3>Music & Traditional Karawitan Division</h3>
                <p>Mastering traditional gamelan, degung, kendang, kacapi suling, and exploring contemporary ethnic music collaborations.</p>
            </div>
            <div>
                <h3>Dance Art Division</h3>
                <p>Preserving classic Sundanese traditional dance (Jaipong, Tari Merak) alongside captivating new choreographies.</p>
            </div>
        </section>

        @if(isset($latestNews) && $latestNews->count() > 0)
            <section>
                <h2>Latest News & Articles</h2>
                @foreach($latestNews as $item)
                    <article>
                        <h3><a href="{{ url('/news/' . $item->slug) }}">{{ $item->title_en ?: $item->title_id }}</a></h3>
                        <p>{{ $item->summary_en ?: $item->summary_id }}</p>
                        <time datetime="{{ $item->date }}">{{ \Carbon\Carbon::parse($item->date)->translatedFormat('F d, Y') }}</time>
                    </article>
                @endforeach
            </section>
        @endif

        <nav aria-label="Lises Asmarandana Navigation">
            <ul>
                <li><a href="{{ url('/about') }}">About & History of Lises Asmarandana</a></li>
                <li><a href="{{ url('/gallery') }}">Photo & Video Performance Documentation</a></li>
                <li><a href="{{ url('/news') }}">News & Cultural Stories of UMMI</a></li>
                <li><a href="{{ url('/event') }}">Event Schedules & Performance Ticket Booking</a></li>
                <li><a href="{{ url('/member') }}">Members & Organization Structure</a></li>
                <li><a href="{{ url('/contact') }}">Contact Us & Secretariat Location</a></li>
            </ul>
        </nav>
    @else
        <h1>Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana - UMMI Sukabumi</h1>
        <p>Selamat datang di situs resmi UKM Lises Asmarandana Universitas Muhammadiyah Sukabumi. Merawat budaya, memanggung talenta seni tari dan musik tradisional Sunda serta kreasi Nusantara.</p>
        
        <section>
            <h2>Statistik & Prestasi Kami</h2>
            <ul>
                <li>Total Anggota Aktif: {{ $stats['members'] ?? '100+' }} Mahasiswa</li>
                <li>Total Angkatan / Batch: {{ $stats['batches'] ?? '10+' }} Angkatan</li>
                <li>Total Acara & Pementasan: {{ $stats['events'] ?? '20+' }} Pementasan</li>
            </ul>
        </section>

        <section>
            <h2>Divisi Seni Lises Asmarandana</h2>
            <div>
                <h3>Divisi Musik & Karawitan</h3>
                <p>Mendalami alat musik tradisional degung, kendang, kacapi suling, dan eksplorasi musik etnik kontemporer.</p>
            </div>
            <div>
                <h3>Divisi Seni Tari</h3>
                <p>Melestarikan tari tradisional Sunda klasik (Jaipong, Merak) serta koreografi tari kreasi baru yang memukau.</p>
            </div>
        </section>

        @if(isset($latestNews) && $latestNews->count() > 0)
            <section>
                <h2>Berita & Artikel Terbaru</h2>
                @foreach($latestNews as $item)
                    <article>
                        <h3><a href="{{ url('/news/' . $item->slug) }}">{{ $item->title_id }}</a></h3>
                        <p>{{ $item->summary_id }}</p>
                        <time datetime="{{ $item->date }}">{{ \Carbon\Carbon::parse($item->date)->translatedFormat('d F Y') }}</time>
                    </article>
                @endforeach
            </section>
        @endif

        <nav aria-label="Navigasi Halaman Lises Asmarandana">
            <ul>
                <li><a href="{{ url('/about') }}">Profil & Sejarah Lises Asmarandana</a></li>
                <li><a href="{{ url('/gallery') }}">Dokumentasi Foto & Video Pementasan</a></li>
                <li><a href="{{ url('/news') }}">Kumpulan Berita & Kabar Seni UMMI</a></li>
                <li><a href="{{ url('/event') }}">Jadwal Acara & Pemesanan Tiket Pementasan</a></li>
                <li><a href="{{ url('/member') }}">Daftar Anggota & Kepengurusan Lises</a></li>
                <li><a href="{{ url('/contact') }}">Hubungi Kami & Lokasi Sekretariat</a></li>
            </ul>
        </nav>
    @endif
</div>
