<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
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
</div>
