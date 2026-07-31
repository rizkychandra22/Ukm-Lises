<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Batch;
use App\Models\Major;
use App\Models\BatchMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MemberApiTest extends TestCase
{
    use RefreshDatabase;

    protected $major;
    protected $batch;
    protected $member;

    protected function setUp(): void
    {
        parent::setUp();

        $this->major = Major::create([
            'faculty_id' => 'Seni',
            'faculty_en' => 'Arts',
            'name_id' => 'Musik',
            'name_en' => 'Music',
            'degree' => 'S1'
        ]);

        $user = User::create([
            'name' => 'Batch User',
            'username' => 'lises2023',
            'password' => bcrypt('password')
        ]);

        $this->batch = Batch::create([
            'year' => '2023',
            'name_id' => 'Angkatan 2023',
            'name_en' => 'Class of 2023',
            'status' => 'Active',
            'user_id' => $user->id
        ]);

        $this->member = BatchMember::create([
            'name' => 'Budi',
            'type' => 'Pengurus',
            'status' => 'Active',
            'periode' => '2023-2024',
            'position_id' => 'Ketua',
            'position_en' => 'President',
            'batch_id' => $this->batch->id,
            'major_id' => $this->major->id,
            'image' => 'https://cloudinary.com/avatar.jpg'
        ]);
    }

    public function test_api_members_returns_correct_structure_and_no_data_leak()
    {
        $response = $this->getJson('/api/members');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'type',
                        'status',
                        'periode',
                        'position_id',
                        'position_en',
                        'image',
                        'batch_id',
                        'major_id',
                        'batch' => [
                            'id',
                            'year',
                            'name_id',
                            'name_en',
                            'status'
                        ],
                        'major' => [
                            'id',
                            'degree',
                            'name_id',
                            'name_en',
                            'faculty_id',
                            'faculty_en'
                        ]
                    ]
                ]
            ]);

        // Assert that sensitive/internal fields like created_at, updated_at, user_id are NOT in the root data
        $responseData = $response->json('data.0');
        $this->assertArrayNotHasKey('created_at', $responseData);
        $this->assertArrayNotHasKey('updated_at', $responseData);

        // Assert that user_id is NOT leaked from batch relation
        $this->assertArrayNotHasKey('user_id', $responseData['batch']);
        $this->assertArrayNotHasKey('created_at', $responseData['batch']);
        $this->assertArrayNotHasKey('updated_at', $responseData['batch']);
    }

    public function test_api_batches_returns_correct_structure_and_no_data_leak()
    {
        $response = $this->getJson('/api/batches');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'year',
                        'name_id',
                        'name_en',
                        'status'
                    ]
                ]
            ]);

        $responseData = $response->json('data.0');
        $this->assertArrayNotHasKey('user_id', $responseData);
        $this->assertArrayNotHasKey('created_at', $responseData);
        $this->assertArrayNotHasKey('updated_at', $responseData);
    }
}
