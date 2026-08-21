<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\Batch;
use App\Models\BatchMember;
use Illuminate\Http\Request;

/**
 * WebController — Server-side SEO pre-rendering for public React SPA pages.
 * 
 * Provides per-route multilingual meta tags (title, description, OG image) and injects
 * lightweight HTML into <div id="root"> so crawlers (Google, Facebook,
 * WhatsApp) can index content in Indonesian and English without executing JavaScript.
 */
class WebController extends Controller
{
    /** Base domain — used for canonical URLs and sitemap */
    private const DOMAIN = 'https://lises.ummi.ac.id';

    /**
     * Determine active locale (id or en)
     */
    private function resolveLocale(Request $request): string
    {
        $lang = $request->query('lang', $request->cookie('app_language', app()->getLocale()));
        return in_array($lang, ['en', 'id'], true) ? $lang : 'id';
    }

    /**
     * Landing / Home page
     */
    public function home(Request $request)
    {
        $locale = $this->resolveLocale($request);
        $isEn = $locale === 'en';

        $stats = [
            'members' => BatchMember::count(),
            'batches' => Batch::count(),
            'events'  => Event::count(),
        ];

        $latestNews = News::orderBy('date', 'desc')->take(3)->get();

        $preRendered = view('seo.home', compact('stats', 'latestNews', 'isEn'))->render();

        $title = $isEn
            ? 'Lises Asmarandana | Music & Dance Arts UMMI Sukabumi'
            : 'Lises Asmarandana | Seni Musik & Tari UMMI Sukabumi';

        $description = $isEn
            ? 'Official website of UKM Music and Dance Arts Lises Asmarandana Universitas Muhammadiyah Sukabumi. Preserving culture, showcasing talents.'
            : 'Situs resmi UKM Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi. Merawat budaya, memanggung talenta.';

        return view('web', [
            'title'       => $title,
            'description' => $description,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN,
            'locale'      => $locale,
            'schemas'     => $this->organizationSchema($isEn),
        ]);
    }

    /**
     * About page
     */
    public function about(Request $request)
    {
        $locale = $this->resolveLocale($request);
        $isEn = $locale === 'en';

        $preRendered = view('seo.about', compact('isEn'))->render();

        $title = $isEn
            ? 'About Us — Lises Asmarandana UMMI'
            : 'Tentang Kami — Lises Asmarandana UMMI';

        $description = $isEn
            ? 'Profile, history, vision, mission, and organizational structure of UKM Music and Dance Arts Lises Asmarandana UMMI Sukabumi.'
            : 'Profil, sejarah, visi misi, dan struktur organisasi UKM Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.';

        return view('web', [
            'title'       => $title,
            'description' => $description,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/about',
            'locale'      => $locale,
            'schemas'     => $this->organizationSchema($isEn) + $this->breadcrumbSchema($isEn ? 'About Us' : 'Tentang Kami', '/about'),
        ]);
    }

    /**
     * Gallery page
     */
    public function gallery(Request $request)
    {
        $locale = $this->resolveLocale($request);
        $isEn = $locale === 'en';

        $galleries = Gallery::orderBy('created_at', 'desc')->take(12)->get();
        $preRendered = view('seo.gallery', compact('galleries', 'isEn'))->render();

        $title = $isEn
            ? 'Documentation Gallery — Lises Asmarandana'
            : 'Galeri Dokumentasi — Lises Asmarandana';

        $description = $isEn
            ? 'Photo and video documentation of performances, training, and cultural appearances by UKM Lises Asmarandana UMMI.'
            : 'Dokumentasi foto dan video kegiatan pementasan, latihan, dan penampilan UKM Lises Asmarandana UMMI Sukabumi.';

        return view('web', [
            'title'       => $title,
            'description' => $description,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/gallery',
            'locale'      => $locale,
            'schemas'     => $this->breadcrumbSchema($isEn ? 'Gallery' : 'Galeri', '/gallery'),
        ]);
    }

    /**
     * News listing page
     */
    public function news(Request $request)
    {
        $locale = $this->resolveLocale($request);
        $isEn = $locale === 'en';

        $news = News::orderBy('date', 'desc')->take(20)->get();
        $preRendered = view('seo.news', compact('news', 'isEn'))->render();

        $title = $isEn
            ? 'News & Articles — Lises Asmarandana'
            : 'Berita & Artikel — Lises Asmarandana';

        $description = $isEn
            ? 'Latest updates, event coverage, and cultural art articles from UKM Lises Asmarandana UMMI.'
            : 'Kabar terbaru, liputan acara, dan artikel seni budaya dari UKM Lises Asmarandana UMMI.';

        return view('web', [
            'title'       => $title,
            'description' => $description,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/news',
            'locale'      => $locale,
            'schemas'     => $this->breadcrumbSchema($isEn ? 'News' : 'Berita', '/news'),
        ]);
    }

    /**
     * News detail page — critical for social sharing (WhatsApp, Facebook)
     */
    public function newsDetail(Request $request, string $slug)
    {
        $locale = $this->resolveLocale($request);
        $isEn = $locale === 'en';

        $news = News::where('slug', $slug)->first();

        if (!$news) {
            return view('web', [
                'title'       => $isEn ? 'News Not Found — Lises Asmarandana' : 'Berita Tidak Ditemukan — Lises Asmarandana',
                'description' => $isEn ? 'The requested article could not be found.' : 'Berita yang Anda cari tidak ditemukan.',
                'locale'      => $locale,
            ]);
        }

        $preRendered = view('seo.news-detail', compact('news', 'isEn'))->render();

        $headline = $isEn ? ($news->title_en ?: $news->title_id) : $news->title_id;
        $summary = $isEn ? ($news->summary_en ?: $news->summary_id) : $news->summary_id;

        return view('web', [
            'title'       => $headline . ' — Lises Asmarandana',
            'description' => $summary,
            'image'       => $news->image,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/news/' . $news->slug,
            'locale'      => $locale,
            'schemas'     => $this->articleSchema($news, $isEn),
        ]);
    }

    /**
     * Event page
     */
    public function event(Request $request)
    {
        $locale = $this->resolveLocale($request);
        $isEn = $locale === 'en';

        $events = Event::published()->orderBy('date', 'desc')->take(10)->get();
        $preRendered = view('seo.event', compact('events', 'isEn'))->render();

        $title = $isEn
            ? 'Schedule & Events — Lises Asmarandana'
            : 'Agenda & Acara — Lises Asmarandana';

        $description = $isEn
            ? 'Performance schedules, cultural festivals, and art events by UKM Lises Asmarandana Universitas Muhammadiyah Sukabumi.'
            : 'Jadwal pementasan, festival budaya, dan kegiatan seni UKM Lises Asmarandana Universitas Muhammadiyah Sukabumi.';

        return view('web', [
            'title'       => $title,
            'description' => $description,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/event',
            'locale'      => $locale,
            'schemas'     => $this->breadcrumbSchema($isEn ? 'Events' : 'Acara', '/event') + $this->eventsSchema($events, $isEn),
        ]);
    }

    /**
     * Member page
     */
    public function member(Request $request)
    {
        $locale = $this->resolveLocale($request);
        $isEn = $locale === 'en';

        $totalMembers = BatchMember::count();
        $totalBatches = Batch::count();
        $preRendered = view('seo.member', compact('totalMembers', 'totalBatches', 'isEn'))->render();

        $title = $isEn
            ? 'Members & Organization Structure — Lises Asmarandana'
            : 'Anggota & Kepengurusan — Lises Asmarandana';

        $description = $isEn
            ? 'Active member roster, executive board structure, and alumni generations of UKM Lises Asmarandana UMMI.'
            : 'Daftar anggota aktif, struktur kepengurusan, dan demisioner UKM Lises Asmarandana UMMI Sukabumi.';

        return view('web', [
            'title'       => $title,
            'description' => $description,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/member',
            'locale'      => $locale,
            'schemas'     => $this->breadcrumbSchema($isEn ? 'Members' : 'Anggota', '/member'),
        ]);
    }

    /**
     * Contact page
     */
    public function contact(Request $request)
    {
        $locale = $this->resolveLocale($request);
        $isEn = $locale === 'en';

        $preRendered = view('seo.contact', compact('isEn'))->render();

        $title = $isEn
            ? 'Contact Us — Lises Asmarandana'
            : 'Hubungi Kami — Lises Asmarandana';

        $description = $isEn
            ? 'Official contact, Secretariat location, and social media channels of UKM Lises Asmarandana UMMI Sukabumi.'
            : 'Kontak resmi, lokasi Sekretariat, dan media sosial UKM Lises Asmarandana UMMI Sukabumi.';

        return view('web', [
            'title'       => $title,
            'description' => $description,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/contact',
            'locale'      => $locale,
            'schemas'     => $this->breadcrumbSchema($isEn ? 'Contact' : 'Kontak', '/contact'),
        ]);
    }

    // ─── Schema Helpers ────────────────────────────────────────

    private function organizationSchema(bool $isEn): array
    {
        return ['organization' => [
            '@context' => 'https://schema.org',
            '@type'    => 'EducationalOrganization',
            'name'     => 'UKM Lises Asmarandana',
            'alternateName' => ['Lises Asmarandana UMMI', 'Seni Musik dan Tari UMMI'],
            'url'      => self::DOMAIN,
            'logo'     => self::DOMAIN . '/build/assets/logo-bg-light.png',
            'description' => $isEn
                ? 'Student Activity Unit of Music and Dance Arts Lises Asmarandana Muhammadiyah Sukabumi University.'
                : 'Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.',
            'sameAs'   => [
                'https://www.instagram.com/lisesasmarandana',
                'https://www.youtube.com/@lisesasmarandana',
            ],
            'address'  => [
                '@type'           => 'PostalAddress',
                'streetAddress'   => 'Jl. R. Syamsudin, S.H. No. 50',
                'addressLocality' => 'Sukabumi',
                'addressRegion'   => 'Jawa Barat',
                'postalCode'      => '43113',
                'addressCountry'  => 'ID',
            ],
            'parentOrganization' => [
                '@type' => 'CollegeOrUniversity',
                'name'  => 'Universitas Muhammadiyah Sukabumi',
                'url'   => 'https://ummi.ac.id',
            ],
        ]];
    }

    private function breadcrumbSchema(string $pageName, string $path): array
    {
        return ['breadcrumb' => [
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => [
                [
                    '@type'    => 'ListItem',
                    'position' => 1,
                    'name'     => 'Home',
                    'item'     => self::DOMAIN,
                ],
                [
                    '@type'    => 'ListItem',
                    'position' => 2,
                    'name'     => $pageName,
                    'item'     => self::DOMAIN . $path,
                ],
            ],
        ]];
    }

    private function articleSchema(News $news, bool $isEn): array
    {
        return ['article' => [
            '@context'       => 'https://schema.org',
            '@type'          => 'Article',
            'headline'       => $isEn ? ($news->title_en ?: $news->title_id) : $news->title_id,
            'description'    => $isEn ? ($news->summary_en ?: $news->summary_id) : $news->summary_id,
            'image'          => $news->image,
            'datePublished'  => $news->date,
            'dateModified'   => $news->updated_at?->toIso8601String(),
            'author'         => [
                '@type' => 'Organization',
                'name'  => 'UKM Lises Asmarandana',
            ],
            'publisher'      => [
                '@type' => 'Organization',
                'name'  => 'UKM Lises Asmarandana',
                'logo'  => [
                    '@type' => 'ImageObject',
                    'url'   => self::DOMAIN . '/build/assets/logo-bg-light.png',
                ],
            ],
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id'   => self::DOMAIN . '/news/' . $news->slug,
            ],
        ]];
    }

    private function eventsSchema($events, bool $isEn): array
    {
        if ($events->isEmpty()) return [];

        $items = $events->map(function ($event) use ($isEn) {
            return [
                '@context'    => 'https://schema.org',
                '@type'       => 'Event',
                'name'        => $isEn ? ($event->title_en ?: $event->title_id) : $event->title_id,
                'description' => $isEn ? ($event->summary_en ?: $event->summary_id) : $event->summary_id,
                'startDate'   => $event->date?->toIso8601String(),
                'eventStatus' => $event->status === 'published'
                    ? 'https://schema.org/EventScheduled'
                    : 'https://schema.org/EventPostponed',
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                'location'    => [
                    '@type'   => 'Place',
                    'name'    => ($isEn ? ($event->location_en ?: $event->location_id) : $event->location_id) ?? 'Universitas Muhammadiyah Sukabumi',
                    'address' => [
                        '@type'           => 'PostalAddress',
                        'addressLocality' => 'Sukabumi',
                        'addressCountry'  => 'ID',
                    ],
                ],
                'image'       => $event->image,
                'organizer'   => [
                    '@type' => 'Organization',
                    'name'  => 'UKM Lises Asmarandana',
                    'url'   => self::DOMAIN,
                ],
            ];
        });

        return ['events' => $items->toArray()];
    }
}
