<?php

namespace Tests\Unit\Models;

use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_a_news()
    {
        $user = User::factory()->create(['username' => 'testuser' . rand(1, 1000)]);
        $news = News::create([
            'user_id' => $user->id,
            'type' => 'Pementasan',
            'date' => now(),
            'title_id' => 'Berita Utama',
            'title_en' => 'Main News',
            'slug' => 'berita-utama',
            'summary_id' => 'Ringkasan',
            'summary_en' => 'Summary',
            'description_id' => 'Isi berita',
            'description_en' => 'News content',
            'image' => 'news.jpg',
        ]);

        $this->assertDatabaseHas('news', [
            'slug' => 'berita-utama',
        ]);
    }
}
