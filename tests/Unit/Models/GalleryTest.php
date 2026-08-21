<?php

namespace Tests\Unit\Models;

use App\Models\Gallery;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GalleryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_a_gallery()
    {
        $user = User::factory()->create(['username' => 'testuser' . rand(1,1000)]);
        $gallery = Gallery::create([
            'user_id' => $user->id,
            'title_id' => 'Galeri',
            'title_en' => 'Gallery',
            'image' => 'gallery.jpg',
        ]);

        $this->assertDatabaseHas('galleries', [
            'title_id' => 'Galeri',
        ]);
    }
}

