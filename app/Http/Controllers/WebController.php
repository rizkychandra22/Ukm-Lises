<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\Batch;
use App\Models\BatchMember;

/**
 * WebController — Server-side SEO pre-rendering for public React SPA pages.
 * 
 * Provides per-route meta tags (title, description, OG image) and injects
 * lightweight HTML into <div id="root"> so crawlers (Google, Facebook,
 * WhatsApp) can index content without executing JavaScript.
 */
class WebController extends Controller
{
    /** Base domain — used for canonical URLs and sitemap */
    private const DOMAIN = 'https://lises.ummi.ac.id';

    /**
     * Landing / Home page
     */
    public function home()
    {
        $stats = [
            'members' => BatchMember::count(),
            'batches' => Batch::count(),
            'events'  => Event::count(),
        ];

        $latestNews = News::orderBy('date', 'desc')->take(3)->get();

        $preRendered = view('seo.home', compact('stats', 'latestNews'))->render();

        return view('web', [
            'title'       => 'Lises Asmarandana | Seni Musik & Tari UMMI Sukabumi',
            'description' => 'Situs resmi UKM Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi. Merawat budaya, memanggung talenta.',
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN,
            'schemas'     => $this->organizationSchema(),
        ]);
    }

    /**
     * About page
     */
    public function about()
    {
        $preRendered = view('seo.about')->render();

        return view('web', [
            'title'       => 'Tentang Kami — Lises Asmarandana UMMI',
            'description' => 'Profil, sejarah, visi misi, dan struktur organisasi UKM Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.',
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/about',
            'schemas'     => $this->organizationSchema() + $this->breadcrumbSchema('Tentang Kami', '/about'),
        ]);
    }

    /**
     * Gallery page
     */
    public function gallery()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->take(12)->get();
        $preRendered = view('seo.gallery', compact('galleries'))->render();

        return view('web', [
            'title'       => 'Galeri Dokumentasi — Lises Asmarandana',
            'description' => 'Dokumentasi foto dan video kegiatan pementasan, latihan, dan penampilan UKM Lises Asmarandana UMMI Sukabumi.',
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/gallery',
            'schemas'     => $this->breadcrumbSchema('Galeri', '/gallery'),
        ]);
    }

    /**
     * News listing page
     */
    public function news()
    {
        $news = News::orderBy('date', 'desc')->take(20)->get();
        $preRendered = view('seo.news', compact('news'))->render();

        return view('web', [
            'title'       => 'Berita & Artikel — Lises Asmarandana',
            'description' => 'Kabar terbaru, liputan acara, dan artikel seni budaya dari UKM Lises Asmarandana UMMI.',
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/news',
            'schemas'     => $this->breadcrumbSchema('Berita', '/news'),
        ]);
    }

    /**
     * News detail page — critical for social sharing (WhatsApp, Facebook)
     */
    public function newsDetail(string $slug)
    {
        $news = News::where('slug', $slug)->first();

        if (!$news) {
            return view('web', [
                'title'       => 'Berita Tidak Ditemukan — Lises Asmarandana',
                'description' => 'Berita yang Anda cari tidak ditemukan.',
            ]);
        }

        $preRendered = view('seo.news-detail', compact('news'))->render();

        return view('web', [
            'title'       => $news->title_id . ' — Lises Asmarandana',
            'description' => $news->summary_id,
            'image'       => $news->image,
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/news/' . $news->slug,
            'schemas'     => $this->articleSchema($news),
        ]);
    }

    /**
     * Event page
     */
    public function event()
    {
        $events = Event::published()->orderBy('date', 'desc')->take(10)->get();
        $preRendered = view('seo.event', compact('events'))->render();

        return view('web', [
            'title'       => 'Agenda & Acara — Lises Asmarandana',
            'description' => 'Jadwal pementasan, festival budaya, dan kegiatan seni UKM Lises Asmarandana Universitas Muhammadiyah Sukabumi.',
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/event',
            'schemas'     => $this->breadcrumbSchema('Acara', '/event') + $this->eventsSchema($events),
        ]);
    }

    /**
     * Member page
     */
    public function member()
    {
        $totalMembers = BatchMember::count();
        $totalBatches = Batch::count();
        $preRendered = view('seo.member', compact('totalMembers', 'totalBatches'))->render();

        return view('web', [
            'title'       => 'Anggota & Kepengurusan — Lises Asmarandana',
            'description' => 'Daftar anggota aktif, struktur kepengurusan, dan demisioner UKM Lises Asmarandana UMMI Sukabumi.',
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/member',
            'schemas'     => $this->breadcrumbSchema('Anggota', '/member'),
        ]);
    }

    /**
     * Contact page
     */
    public function contact()
    {
        $preRendered = view('seo.contact')->render();

        return view('web', [
            'title'       => 'Hubungi Kami — Lises Asmarandana',
            'description' => 'Kontak resmi, lokasi Sekretariat, dan media sosial UKM Lises Asmarandana UMMI Sukabumi.',
            'preRendered' => $preRendered,
            'canonical'   => self::DOMAIN . '/contact',
            'schemas'     => $this->breadcrumbSchema('Kontak', '/contact'),
        ]);
    }

    // ─── Schema Helpers ────────────────────────────────────────

    private function organizationSchema(): array
    {
        return ['organization' => [
            '@context' => 'https://schema.org',
            '@type'    => 'EducationalOrganization',
            'name'     => 'UKM Lises Asmarandana',
            'alternateName' => ['Lises Asmarandana UMMI', 'Seni Musik dan Tari UMMI'],
            'url'      => self::DOMAIN,
            'logo'     => self::DOMAIN . '/build/assets/logo-bg-light.png',
            'description' => 'Unit Kegiatan Mahasiswa Seni Musik dan Tari Lises Asmarandana Universitas Muhammadiyah Sukabumi.',
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
                    'name'     => 'Beranda',
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

    private function articleSchema(News $news): array
    {
        return ['article' => [
            '@context'       => 'https://schema.org',
            '@type'          => 'Article',
            'headline'       => $news->title_id,
            'description'    => $news->summary_id,
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

    private function eventsSchema($events): array
    {
        if ($events->isEmpty()) return [];

        $items = $events->map(function ($event) {
            return [
                '@context'    => 'https://schema.org',
                '@type'       => 'Event',
                'name'        => $event->title_id,
                'description' => $event->summary_id,
                'startDate'   => $event->date?->toIso8601String(),
                'eventStatus' => $event->status === 'published'
                    ? 'https://schema.org/EventScheduled'
                    : 'https://schema.org/EventPostponed',
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                'location'    => [
                    '@type'   => 'Place',
                    'name'    => $event->location_id ?? 'Universitas Muhammadiyah Sukabumi',
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
