<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Batch;
use App\Models\Major;
use App\Models\BatchMember;
use App\Models\User;
use App\Services\BatchService;
use App\Services\BatchMemberService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Mockery;

class ListMemberControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $normalUser;
    protected $developerUser;
    protected $batch;
    protected $major;
    protected $batchServiceMock;
    protected $batchMemberServiceMock;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'Developer']);
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'User']);

        $this->developerUser = User::create([
            'name' => 'Dev User',
            'username' => 'devuser',
            'password' => bcrypt('password')
        ]);
        $this->developerUser->assignRole('Developer');

        $this->adminUser = User::create([
            'name' => 'Admin User',
            'username' => 'adminuser',
            'password' => bcrypt('password')
        ]);
        $this->adminUser->assignRole('Admin');

        $this->normalUser = User::create([
            'name' => 'Normal User',
            'username' => 'normaluser',
            'password' => bcrypt('password')
        ]);
        $this->normalUser->assignRole('User');

        $this->major = Major::create([
            'faculty_id' => 'Seni',
            'faculty_en' => 'Arts',
            'name_id' => 'Musik',
            'name_en' => 'Music',
            'degree' => 'S1'
        ]);

        $this->batch = Batch::create([
            'year' => '2023',
            'name_id' => 'Angkatan 2023',
            'name_en' => 'Class of 2023',
            'status' => 'Active',
            'user_id' => $this->normalUser->id
        ]);

        // Mock the services to isolate controller tests
        $this->batchServiceMock = Mockery::mock(BatchService::class);
        $this->batchMemberServiceMock = Mockery::mock(BatchMemberService::class);

        $this->app->instance(BatchService::class, $this->batchServiceMock);
        $this->app->instance(BatchMemberService::class, $this->batchMemberServiceMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_index_page_requires_auth_and_roles()
    {
        // Guests cannot access dashboard
        $response = $this->get('/dashboard/list-member');
        $response->assertRedirect('/auth/login');

        // Authenticated user with appropriate role can access
        $this->actingAs($this->adminUser);
        $response = $this->get('/dashboard/list-member');
        $response->assertStatus(200);
    }

    // ==========================================
    // BATCH CRUD AUTHORIZATION TESTS (BOLA)
    // ==========================================

    public function test_store_batch_allowed_for_admin()
    {
        $this->actingAs($this->adminUser);

        $this->batchServiceMock
            ->shouldReceive('createBatch')
            ->once()
            ->andReturn(new Batch());

        $response = $this->post('/dashboard/list-member/batches', [
            'year' => '2024',
            'name_id' => 'Angkatan 2024',
            'status' => 'Active'
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    }

    public function test_store_batch_denied_for_normal_user()
    {
        $this->actingAs($this->normalUser);

        $response = $this->post('/dashboard/list-member/batches', [
            'year' => '2024',
            'name_id' => 'Angkatan 2024',
            'status' => 'Active'
        ]);

        $response->assertStatus(403);
    }

    public function test_update_batch_allowed_for_admin()
    {
        $this->actingAs($this->adminUser);

        $this->batchServiceMock
            ->shouldReceive('updateBatch')
            ->once()
            ->andReturn($this->batch);

        $response = $this->put("/dashboard/list-member/batches/{$this->batch->id}", [
            'year' => '2023',
            'name_id' => 'Updated Name',
            'status' => 'Active',
            'username' => 'updated_username',
            'password' => 'updated_password'
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    }

    public function test_update_batch_denied_for_normal_user()
    {
        $this->actingAs($this->normalUser);

        $response = $this->put("/dashboard/list-member/batches/{$this->batch->id}", [
            'year' => '2023',
            'name_id' => 'Updated Name',
            'status' => 'Active'
        ]);

        $response->assertStatus(403);
    }

    public function test_destroy_batch_allowed_for_admin()
    {
        $this->actingAs($this->adminUser);

        $this->batchServiceMock
            ->shouldReceive('deleteBatch')
            ->once();

        $response = $this->delete("/dashboard/list-member/batches/{$this->batch->id}");

        $response->assertRedirect();
    }

    public function test_destroy_batch_denied_for_normal_user()
    {
        $this->actingAs($this->normalUser);

        $response = $this->delete("/dashboard/list-member/batches/{$this->batch->id}");

        $response->assertStatus(403);
    }

    // ==========================================
    // MEMBER CRUD AUTHORIZATION TESTS
    // ==========================================

    public function test_store_member_allowed_for_normal_user_on_their_own_batch()
    {
        $this->actingAs($this->normalUser);

        $this->batchMemberServiceMock
            ->shouldReceive('createMember')
            ->once()
            ->andReturn(new BatchMember());

        $response = $this->post('/dashboard/list-member/members', [
            'batch_id' => $this->batch->id, // Matching normalUser's batch
            'major_id' => $this->major->id,
            'name' => 'New Member',
            'type' => 'Pengurus',
            'status' => 'Active'
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    }

    public function test_store_member_denied_for_normal_user_on_other_batch()
    {
        $this->actingAs($this->normalUser);

        $otherUser = User::create([
            'name' => 'Other User',
            'username' => 'otheruser',
            'password' => bcrypt('password')
        ]);
        $otherBatch = Batch::create([
            'year' => '2022',
            'name_id' => 'Other Batch',
            'name_en' => 'Other Batch EN',
            'status' => 'Active',
            'user_id' => $otherUser->id
        ]);

        $response = $this->post('/dashboard/list-member/members', [
            'batch_id' => $otherBatch->id, // Not matching normalUser's batch
            'major_id' => $this->major->id,
            'name' => 'New Member',
            'type' => 'Pengurus',
            'status' => 'Active'
        ]);

        $response->assertStatus(403);
    }
}
