<?php

namespace Tests\Feature\Api;

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_news_list()
    {
        $user = User::factory()->create(['username' => 'testuser' . rand(1, 1000)]);
        News::create([
            'user_id' => $user->id,
            'type' => 'Pementasan',
            'date' => now(),
            'title_id' => 'Berita API',
            'title_en' => 'API News',
            'slug' => 'berita-api',
            'summary_id' => 'Ringkasan',
            'summary_en' => 'Summary',
            'description_id' => 'Isi berita',
            'description_en' => 'News content',
            'image' => 'news.jpg',
            'status' => 'published',
        ]);

        $response = $this->getJson('/api/news');
        $response->assertStatus(200);
    }
}
