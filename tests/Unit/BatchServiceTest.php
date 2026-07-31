<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Batch;
use App\Models\User;
use App\Services\BatchService;
use App\Services\Translations\GoogleTranslateService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Spatie\Permission\Models\Role;

class BatchServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $translateServiceMock;
    protected $batchService;

    protected function setUp(): void
    {
        parent::setUp();

        // Create the 'User' role which is assigned in the service
        Role::create(['name' => 'User']);

        $this->translateServiceMock = Mockery::mock(GoogleTranslateService::class);
        $this->app->instance(GoogleTranslateService::class, $this->translateServiceMock);
        
        $this->batchService = new BatchService($this->translateServiceMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_create_batch_success()
    {
        $this->translateServiceMock
            ->shouldReceive('toEnglish')
            ->once()
            ->with('Angkatan 2023')
            ->andReturn('Class of 2023');

        $data = [
            'year' => '2023',
            'name_id' => 'Angkatan 2023',
            'status' => 'Active'
        ];

        $batch = $this->batchService->createBatch($data);

        $this->assertInstanceOf(Batch::class, $batch);
        $this->assertEquals('2023', $batch->year);
        $this->assertEquals('Angkatan 2023', $batch->name_id);
        $this->assertEquals('Class of 2023', $batch->name_en);
        $this->assertEquals('Active', $batch->status);

        // Check if user is created and assigned to the batch
        $this->assertNotNull($batch->user_id);
        $user = User::find($batch->user_id);
        $this->assertNotNull($user);
        $this->assertEquals('Angkatan 2023', $user->name);
        $this->assertEquals('lises2023', $user->username);
        $this->assertTrue($user->hasRole('User'));
    }

    public function test_update_batch_success()
    {
        // Setup initial batch and user
        $user = User::create([
            'name' => 'Old Name',
            'username' => 'lises2022',
            'password' => bcrypt('password')
        ]);
        $batch = Batch::create([
            'year' => '2022',
            'name_id' => 'Old Name',
            'name_en' => 'Old Name EN',
            'status' => 'Active',
            'user_id' => $user->id
        ]);

        $this->translateServiceMock
            ->shouldReceive('toEnglish')
            ->once()
            ->with('New Name')
            ->andReturn('New Name EN');

        $updateData = [
            'year' => '2022',
            'name_id' => 'New Name',
            'status' => 'Deactive',
            'username' => 'lises2022new',
            'password' => 'newpassword'
        ];

        $updatedBatch = $this->batchService->updateBatch($batch, $updateData);

        $this->assertEquals('New Name', $updatedBatch->name_id);
        $this->assertEquals('New Name EN', $updatedBatch->name_en);
        $this->assertEquals('Deactive', $updatedBatch->status);

        // Check if user was updated
        $user->refresh();
        $this->assertEquals('lises2022new', $user->username);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('newpassword', $user->password));
    }

    public function test_delete_batch_success()
    {
        $user = User::create([
            'name' => 'Test',
            'username' => 'lisestest',
            'password' => bcrypt('password')
        ]);
        $batch = Batch::create([
            'year' => '2022',
            'name_id' => 'Test',
            'name_en' => 'Test EN',
            'status' => 'Active',
            'user_id' => $user->id
        ]);

        $this->batchService->deleteBatch($batch);

        $this->assertDatabaseMissing('batches', ['id' => $batch->id]);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
