<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Batch;
use App\Models\Major;
use App\Models\BatchMember;
use App\Models\User;
use App\Services\BatchMemberService;
use App\Services\Storages\CloudinaryService;
use App\Services\Translations\GoogleTranslateService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Mockery;

class BatchMemberServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $translateServiceMock;
    protected $cloudinaryServiceMock;
    protected $batchMemberService;
    protected $major;
    protected $activeBatch;
    protected $deactiveBatch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->translateServiceMock = Mockery::mock(GoogleTranslateService::class);
        $this->cloudinaryServiceMock = Mockery::mock(CloudinaryService::class);

        $this->app->instance(GoogleTranslateService::class, $this->translateServiceMock);
        $this->app->instance(CloudinaryService::class, $this->cloudinaryServiceMock);

        $this->batchMemberService = new BatchMemberService(
            $this->translateServiceMock,
            $this->cloudinaryServiceMock
        );

        $this->major = Major::create([
            'faculty_id' => 'Seni',
            'faculty_en' => 'Arts',
            'name_id' => 'Musik',
            'name_en' => 'Music',
            'degree' => 'S1'
        ]);

        $user1 = User::create([
            'name' => 'User Active',
            'username' => 'lises2023',
            'password' => bcrypt('password')
        ]);

        $user2 = User::create([
            'name' => 'User Deactive',
            'username' => 'lises2021',
            'password' => bcrypt('password')
        ]);

        $this->activeBatch = Batch::create([
            'year' => '2023',
            'name_id' => 'Angkatan 2023',
            'name_en' => 'Class of 2023',
            'status' => 'Active',
            'user_id' => $user1->id
        ]);

        $this->deactiveBatch = Batch::create([
            'year' => '2021',
            'name_id' => 'Angkatan 2021',
            'name_en' => 'Class of 2021',
            'status' => 'Deactive',
            'user_id' => $user2->id
        ]);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_create_member_as_pengurus_with_position()
    {
        $this->translateServiceMock
            ->shouldReceive('toEnglish')
            ->once()
            ->with('Ketua')
            ->andReturn('President');

        $data = [
            'name' => 'Budi',
            'type' => 'Pengurus',
            'status' => 'Active',
            'periode' => '2023-2024',
            'position_id' => 'Ketua',
            'batch_id' => $this->activeBatch->id,
            'major_id' => $this->major->id,
        ];

        $member = $this->batchMemberService->createMember($data);

        $this->assertInstanceOf(BatchMember::class, $member);
        $this->assertEquals('Budi', $member->name);
        $this->assertEquals('Pengurus', $member->type);
        $this->assertEquals('Active', $member->status);
        $this->assertEquals('2023-2024', $member->periode);
        $this->assertEquals('Ketua', $member->position_id);
        $this->assertEquals('President', $member->position_en);
    }

    public function test_create_member_for_deactive_batch_forces_demisioner()
    {
        $data = [
            'name' => 'Andi',
            'type' => 'Pengurus',
            'status' => 'Active',
            'periode' => '2023-2024',
            'position_id' => 'Ketua',
            'batch_id' => $this->deactiveBatch->id,
            'major_id' => $this->major->id,
        ];

        $member = $this->batchMemberService->createMember($data);

        $this->assertEquals('Demisioner', $member->type);
        $this->assertEquals('Deactive', $member->status);
        $this->assertNull($member->periode);
        $this->assertNull($member->position_id);
        $this->assertNull($member->position_en);
    }

    public function test_create_member_with_image_upload()
    {
        $file = UploadedFile::fake()->create('avatar.jpg', 100, 'image/jpeg');

        $this->cloudinaryServiceMock
            ->shouldReceive('upload')
            ->once()
            ->with($file, 'Ukm-Lises/members')
            ->andReturn([
                'url' => 'https://cloudinary.com/avatar.jpg',
                'public_id' => 'Ukm-Lises/members/avatar'
            ]);

        $data = [
            'name' => 'Caca',
            'type' => 'Pengurus',
            'status' => 'Active',
            'batch_id' => $this->activeBatch->id,
            'major_id' => $this->major->id,
            'image' => $file
        ];

        $member = $this->batchMemberService->createMember($data);
        $this->assertEquals('https://cloudinary.com/avatar.jpg', $member->image);
    }

    public function test_update_member_with_new_image_removes_old_image()
    {
        $member = BatchMember::create([
            'name' => 'Deni',
            'type' => 'Pengurus',
            'status' => 'Active',
            'batch_id' => $this->activeBatch->id,
            'major_id' => $this->major->id,
            'image' => 'https://cloudinary.com/old_avatar.jpg'
        ]);

        $newFile = UploadedFile::fake()->create('new_avatar.jpg', 100, 'image/jpeg');

        $this->cloudinaryServiceMock
            ->shouldReceive('getPublicIdFromUrl')
            ->once()
            ->with('https://cloudinary.com/old_avatar.jpg')
            ->andReturn('Ukm-Lises/members/old_avatar');

        $this->cloudinaryServiceMock
            ->shouldReceive('upload')
            ->once()
            ->with($newFile, 'Ukm-Lises/members')
            ->andReturn([
                'url' => 'https://cloudinary.com/new_avatar.jpg',
                'public_id' => 'Ukm-Lises/members/new_avatar'
            ]);

        $this->cloudinaryServiceMock
            ->shouldReceive('delete')
            ->once()
            ->with('Ukm-Lises/members/old_avatar')
            ->andReturn(true);

        $updateData = [
            'name' => 'Deni Updated',
            'type' => 'Pengurus',
            'batch_id' => $this->activeBatch->id,
            'major_id' => $this->major->id,
            'image' => $newFile
        ];

        $updatedMember = $this->batchMemberService->updateMember($member, $updateData);
        $this->assertEquals('Deni Updated', $updatedMember->name);
        $this->assertEquals('https://cloudinary.com/new_avatar.jpg', $updatedMember->image);
    }

    public function test_delete_member_removes_cloudinary_image()
    {
        $member = BatchMember::create([
            'name' => 'Eri',
            'type' => 'Pengurus',
            'status' => 'Active',
            'batch_id' => $this->activeBatch->id,
            'major_id' => $this->major->id,
            'image' => 'https://cloudinary.com/eri.jpg'
        ]);

        $this->cloudinaryServiceMock
            ->shouldReceive('getPublicIdFromUrl')
            ->once()
            ->with('https://cloudinary.com/eri.jpg')
            ->andReturn('Ukm-Lises/members/eri');

        $this->cloudinaryServiceMock
            ->shouldReceive('delete')
            ->once()
            ->with('Ukm-Lises/members/eri')
            ->andReturn(true);

        $this->batchMemberService->deleteMember($member);

        $this->assertDatabaseMissing('batch_members', ['id' => $member->id]);
    }
}
