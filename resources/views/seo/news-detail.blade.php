<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    <article>
        <h1>{{ $news->title_id }}</h1>
        <div>
            <span>Dipublikasikan pada: <time datetime="{{ $news->date }}">{{ \Carbon\Carbon::parse($news->date)->translatedFormat('d F Y') }}</time></span>
            <span>Oleh: UKM Lises Asmarandana UMMI</span>
        </div>
        
        @if(!empty($news->image))
        <div>
            <img src="{{ $news->image }}" alt="{{ $news->title_id }}" />
        </div>
        @endif

        <div>
            <p><strong>{{ $news->summary_id }}</strong></p>
            <div>
                {!! $news->description_id !!}
            </div>
        </div>
    </article>

    <nav aria-label="Navigasi Berita">
        <a href="{{ url('/news') }}">← Kembali ke Daftar Berita</a> | 
        <a href="{{ url('/') }}">Beranda</a>
    </nav>
</div>
