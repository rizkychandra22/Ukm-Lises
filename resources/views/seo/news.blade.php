<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    @if($isEn ?? false)
        <h1>News, Achievements & Articles — UKM Lises Asmarandana</h1>
        <p>Follow the latest updates, cultural event coverage, student achievements, and articles on traditional dance and music from UKM Lises Asmarandana Universitas Muhammadiyah Sukabumi.</p>

        @if(isset($news) && $news->count() > 0)
            <section>
                <h2>Latest News & Articles</h2>
                @foreach($news as $article)
                    <article>
                        <h2><a href="{{ url('/news/' . $article->slug) }}">{{ $article->title_en ?: $article->title_id }}</a></h2>
                        <p>{{ $article->summary_en ?: $article->summary_id }}</p>
                        <time datetime="{{ $article->date }}">{{ \Carbon\Carbon::parse($article->date)->translatedFormat('F d, Y') }}</time>
                    </article>
                @endforeach
            </section>
        @endif

        <nav aria-label="Related Navigation">
            <a href="{{ url('/') }}">Home</a> | 
            <a href="{{ url('/event') }}">Upcoming Events</a> | 
            <a href="{{ url('/gallery') }}">Photo Gallery</a>
        </nav>
    @else
        <h1>Kumpulan Berita, Prestasi & Artikel — UKM Lises Asmarandana</h1>
        <p>Ikuti berita terbaru, liputan acara pementasan budaya, prestasi mahasiswa, dan artikel seputar kesenian tari dan musik tradisional dari UKM Lises Asmarandana Universitas Muhammadiyah Sukabumi.</p>

        @if(isset($news) && $news->count() > 0)
            <section>
                <h2>Daftar Artikel & Berita Terkini</h2>
                @foreach($news as $article)
                    <article>
                        <h2><a href="{{ url('/news/' . $article->slug) }}">{{ $article->title_id }}</a></h2>
                        <p>{{ $article->summary_id }}</p>
                        <time datetime="{{ $article->date }}">{{ \Carbon\Carbon::parse($article->date)->translatedFormat('d F Y') }}</time>
                    </article>
                @endforeach
            </section>
        @endif

        <nav aria-label="Navigasi Terkait">
            <a href="{{ url('/') }}">Beranda</a> | 
            <a href="{{ url('/event') }}">Acara Mendatang</a> | 
            <a href="{{ url('/gallery') }}">Galeri Foto</a>
        </nav>
    @endif
</div>
