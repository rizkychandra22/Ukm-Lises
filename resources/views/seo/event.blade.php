<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    @if($isEn ?? false)
        <h1>Performance Agenda, Cultural Festivals & Events — Lises Asmarandana</h1>
        <p>Discover music and dance performance schedules, cultural festivals, stage exhibitions, and book official tickets directly through the UKM Lises Asmarandana portal at Muhammadiyah Sukabumi University.</p>

        @if(isset($events) && $events->count() > 0)
            <section>
                <h2>Events & Performance Schedules</h2>
                @foreach($events as $event)
                    <article>
                        <h3>{{ $event->title_en ?: $event->title_id }}</h3>
                        <p>{{ $event->summary_en ?: $event->summary_id }}</p>
                        <ul>
                            <li>Date: <time datetime="{{ $event->date }}">{{ \Carbon\Carbon::parse($event->date)->translatedFormat('F d, Y, H:i') }} WIB</time></li>
                            <li>Location: {{ $event->location_en ?: ($event->location_id ?? 'Universitas Muhammadiyah Sukabumi') }}</li>
                            <li>Ticket Price: {{ $event->price == 0 ? 'Free / Gratis' : 'Rp ' . number_format($event->price, 0, ',', '.') }}</li>
                            <li>Status: {{ ucfirst($event->status) }}</li>
                        </ul>
                    </article>
                @endforeach
            </section>
        @else
            <p>No upcoming performance schedules published at the moment. Stay tuned for our future events.</p>
        @endif

        <nav aria-label="Related Navigation">
            <a href="{{ url('/') }}">Home</a> | 
            <a href="{{ url('/news') }}">News & Articles</a> | 
            <a href="{{ url('/gallery') }}">Event Gallery</a>
        </nav>
    @else
        <h1>Agenda Pementasan, Festival Budaya & Acara — Lises Asmarandana</h1>
        <p>Temukan jadwal pementasan musik dan tari, festival kebudayaan, pagelaran seni, serta pesan tiket resmi secara langsung melalui portal UKM Lises Asmarandana Universitas Muhammadiyah Sukabumi.</p>

        @if(isset($events) && $events->count() > 0)
            <section>
                <h2>Daftar Acara & Pementasan</h2>
                @foreach($events as $event)
                    <article>
                        <h3>{{ $event->title_id }}</h3>
                        <p>{{ $event->summary_id }}</p>
                        <ul>
                            <li>Tanggal: <time datetime="{{ $event->date }}">{{ \Carbon\Carbon::parse($event->date)->translatedFormat('d F Y, H:i') }} WIB</time></li>
                            <li>Lokasi: {{ $event->location_id ?? 'Universitas Muhammadiyah Sukabumi' }}</li>
                            <li>Harga Tiket: {{ $event->price == 0 ? 'Gratis / Free' : 'Rp ' . number_format($event->price, 0, ',', '.') }}</li>
                            <li>Status: {{ ucfirst($event->status) }}</li>
                        </ul>
                    </article>
                @endforeach
            </section>
        @else
            <p>Belum ada jadwal pementasan mendatang yang dipublikasikan saat ini. Nantikan kabar acara kami selanjutnya.</p>
        @endif

        <nav aria-label="Navigasi Terkait">
            <a href="{{ url('/') }}">Beranda</a> | 
            <a href="{{ url('/news') }}">Berita & Artikel</a> | 
            <a href="{{ url('/gallery') }}">Galeri Foto Acara</a>
        </nav>
    @endif
</div>
