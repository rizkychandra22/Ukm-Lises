<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    @if($isEn ?? false)
        <h1>Performance Documentation Gallery — UKM Lises Asmarandana UMMI</h1>
        <p>Collection of photo and video documentation of stage performances, training routines, and cultural music and dance exhibitions from Student Activity Unit Lises Asmarandana Muhammadiyah Sukabumi University.</p>

        @if(isset($galleries) && $galleries->count() > 0)
            <section>
                <h2>Photo Collection & Stage Moments</h2>
                <ul>
                    @foreach($galleries as $gallery)
                        <li>
                            <figure>
                                <img src="{{ $gallery->image }}" alt="{{ $gallery->title_en ?: ($gallery->title_id ?? 'Documentation Lises Asmarandana') }}" loading="lazy" />
                                <figcaption>
                                    <strong>{{ $gallery->title_en ?: ($gallery->title_id ?? 'Art Documentation') }}</strong>
                                    @if(!empty($gallery->desc_en) || !empty($gallery->desc_id))
                                        <p>{{ $gallery->desc_en ?: $gallery->desc_id }}</p>
                                    @endif
                                </figcaption>
                            </figure>
                        </li>
                    @endforeach
                </ul>
            </section>
        @endif

        <nav aria-label="Related Navigation">
            <a href="{{ url('/') }}">Home</a> | 
            <a href="{{ url('/event') }}">Event Schedule</a> | 
            <a href="{{ url('/about') }}">About Us</a>
        </nav>
    @else
        <h1>Galeri Dokumentasi Pementasan — UKM Lises Asmarandana UMMI</h1>
        <p>Koleksi dokumentasi foto dan video penampilan, latihan, dan pementasan kesenian musik dan tari dari Unit Kegiatan Mahasiswa Lises Asmarandana Universitas Muhammadiyah Sukabumi.</p>

        @if(isset($galleries) && $galleries->count() > 0)
            <section>
                <h2>Koleksi Foto & Momen Pementasan</h2>
                <ul>
                    @foreach($galleries as $gallery)
                        <li>
                            <figure>
                                <img src="{{ $gallery->image }}" alt="{{ $gallery->title_id ?? 'Dokumentasi Lises Asmarandana' }}" loading="lazy" />
                                <figcaption>
                                    <strong>{{ $gallery->title_id ?? 'Dokumentasi Seni' }}</strong>
                                    @if(!empty($gallery->desc_id))
                                       <p>{{ $gallery->desc_id }}</p>
                                    @endif
                                </figcaption>
                            </figure>
                        </li>
                    @endforeach
                </ul>
            </section>
        @endif

        <nav aria-label="Navigasi Terkait">
            <a href="{{ url('/') }}">Beranda</a> | 
            <a href="{{ url('/event') }}">Jadwal Acara</a> | 
            <a href="{{ url('/about') }}">Tentang Kami</a>
        </nav>
    @endif
</div>
