<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = url('/');
        $routes = [
            '/',
            '/about',
            '/members',
            '/event',
            '/news',
            '/gallery',
            '/contact',
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";

        foreach ($routes as $route) {
            $loc = rtrim($baseUrl, '/') . ($route === '/' ? '' : $route);
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$loc}</loc>\n";
            $xml .= "    <changefreq>weekly</changefreq>\n";
            $xml .= "    <priority>" . ($route === '/' ? '1.0' : '0.8') . "</priority>\n";
            $xml .= "    <xhtml:link rel=\"alternate\" hreflang=\"id\" href=\"{$loc}\" />\n";
            $xml .= "    <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"{$loc}\" />\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
