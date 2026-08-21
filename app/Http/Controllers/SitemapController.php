<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Event;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = rtrim(url('/'), '/');

        // Static public pages
        $staticPages = [
            [
                'url'        => '/',
                'priority'   => '1.0',
                'changefreq' => 'daily',
                'lastmod'    => now()->toIso8601String(),
            ],
            [
                'url'        => '/about',
                'priority'   => '0.8',
                'changefreq' => 'monthly',
                'lastmod'    => now()->startOfMonth()->toIso8601String(),
            ],
            [
                'url'        => '/member',
                'priority'   => '0.8',
                'changefreq' => 'weekly',
                'lastmod'    => now()->toIso8601String(),
            ],
            [
                'url'        => '/event',
                'priority'   => '0.9',
                'changefreq' => 'daily',
                'lastmod'    => now()->toIso8601String(),
            ],
            [
                'url'        => '/news',
                'priority'   => '0.9',
                'changefreq' => 'daily',
                'lastmod'    => now()->toIso8601String(),
            ],
            [
                'url'        => '/gallery',
                'priority'   => '0.7',
                'changefreq' => 'weekly',
                'lastmod'    => now()->toIso8601String(),
            ],
            [
                'url'        => '/contact',
                'priority'   => '0.7',
                'changefreq' => 'monthly',
                'lastmod'    => now()->startOfMonth()->toIso8601String(),
            ],
        ];

        // Dynamic news pages
        $newsPages = News::select('slug', 'updated_at', 'date')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($news) {
                return [
                    'url'        => '/news/' . $news->slug,
                    'priority'   => '0.8',
                    'changefreq' => 'weekly',
                    'lastmod'    => ($news->updated_at ?? now())->toIso8601String(),
                ];
            })
            ->toArray();

        $allPages = array_merge($staticPages, $newsPages);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";

        foreach ($allPages as $page) {
            $loc = $baseUrl . $page['url'];
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$loc}</loc>\n";
            $xml .= "    <lastmod>{$page['lastmod']}</lastmod>\n";
            $xml .= "    <changefreq>{$page['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$page['priority']}</priority>\n";
            $xml .= "    <xhtml:link rel=\"alternate\" hreflang=\"id\" href=\"{$loc}\" />\n";
            $xml .= "    <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"{$loc}\" />\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
