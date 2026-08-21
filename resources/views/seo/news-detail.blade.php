<div class="seo-prerender-content" style="opacity: 0; position: absolute; pointer-events: none; z-index: -9999;">
    @php
        $headline = ($isEn ?? false) ? ($news->title_en ?: $news->title_id) : $news->title_id;
        $summary = ($isEn ?? false) ? ($news->summary_en ?: $news->summary_id) : $news->summary_id;
        $description = ($isEn ?? false) ? ($news->description_en ?: $news->description_id) : $news->description_id;
    @endphp

    <article>
        <h1>{{ $headline }}</h1>
        <div>
            @if($isEn ?? false)
                <span>Published on: <time datetime="{{ $news->date }}">{{ \Carbon\Carbon::parse($news->date)->translatedFormat('F d, Y') }}</time></span>
                <span>By: UKM Lises Asmarandana UMMI</span>
            @else
                <span>Dipublikasikan pada: <time datetime="{{ $news->date }}">{{ \Carbon\Carbon::parse($news->date)->translatedFormat('d F Y') }}</time></span>
                <span>Oleh: UKM Lises Asmarandana UMMI</span>
            @endif
        </div>
        
        @if(!empty($news->image))
            <div>
                <img src="{{ $news->image }}" alt="{{ $headline }}" />
            </div>
        @endif

        <div>
            <p><strong>{{ $summary }}</strong></p>
            <div>{!! $description !!}</div>
        </div>
    </article>

    <nav aria-label="Navigasi Berita">
        @if($isEn ?? false)
            <a href="{{ url('/news') }}">← Back to News List</a> | 
            <a href="{{ url('/') }}">Home</a>
        @else
            <a href="{{ url('/news') }}">← Kembali ke Daftar Berita</a> | 
            <a href="{{ url('/') }}">Beranda</a>
        @endif
    </nav>
</div>
