<?php

namespace Tests\Unit\Models;

use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_an_event()
    {
        $event = Event::create([
            'title_id' => 'Acara',
            'title_en' => 'Event',
            'slug' => 'acara',
            'image' => 'event.jpg',
            'summary_id' => 'Ringkasan',
            'summary_en' => 'Summary',
            'type' => 'Exclusive',
            'date' => now(),
            'location_id' => 'Jakarta',
            'location_en' => 'Jakarta',
            'price' => 0,
            'ticket' => 100,
            'status' => 'published',
        ]);

        $this->assertDatabaseHas('events', [
            'slug' => 'acara',
        ]);
    }
}
