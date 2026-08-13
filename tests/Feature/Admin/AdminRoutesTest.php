<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Inertia\Testing\AssertableInertia as Assert;

class AdminRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'Developer']);
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'User']);
        config()->set('inertia.testing.ensure_pages_exist', false);
    }

    public function test_developer_can_access_all_developer_routes()
    {
        $user = User::factory()->create(['username' => 'testdev']);
        $user->assignRole('Developer');

        $allowed = [
            ['/dashboard', 'Dashboard'],
            ['/dashboard/list-member', 'IndexMember'],
            ['/dashboard/events', 'IndexEvent'],
            ['/dashboard/gallery', 'IndexGallery'],
            ['/dashboard/news', 'IndexNews'],
            ['/dashboard/system', 'Dev/IndexSystem'],
            ['/dashboard/system/log-visitor', 'Dev/LogVisitor'],
            ['/dashboard/system/releases', 'Dev/Release']
        ];

        foreach ($allowed as $route) {
            $response = $this->withoutExceptionHandling()->actingAs($user)->get($route[0]);
            $response->assertStatus(200);
            $response->assertInertia(fn (Assert $page) => $page->component($route[1]));
        }

        // Developer cannot access Information route
        $response = $this->withoutExceptionHandling()->actingAs($user)->get('/dashboard/information');
        $this->assertTrue(in_array($response->status(), [403, 302]));
    }

    public function test_admin_can_access_content_management_and_information()
    {
        $user = User::factory()->create(['username' => 'testadmin']);
        $user->assignRole('Admin');

        // Allowed routes
        $allowed = [
            ['/dashboard', 'Dashboard'],
            ['/dashboard/list-member', 'IndexMember'],
            ['/dashboard/events', 'IndexEvent'],
            ['/dashboard/gallery', 'IndexGallery'],
            ['/dashboard/news', 'IndexNews'],
            ['/dashboard/information', 'Information']
        ];

        foreach ($allowed as $route) {
            $response = $this->withoutExceptionHandling()->actingAs($user)->get($route[0]);
            $response->assertStatus(200);
            $response->assertInertia(fn (Assert $page) => $page->component($route[1]));
        }

        // Forbidden routes
        $forbidden = [
            '/dashboard/system',
            '/dashboard/system/log-visitor',
            '/dashboard/system/releases'
        ];

        foreach ($forbidden as $uri) {
            $response = $this->withoutExceptionHandling()->actingAs($user)->get($uri);
            $this->assertTrue(in_array($response->status(), [403, 302]));
        }
    }

    public function test_user_can_only_access_basic_dashboard_list_member_and_information()
    {
        $user = User::factory()->create(['username' => 'testuser']);
        $user->assignRole('User');

        // Allowed routes
        $allowed = [
            ['/dashboard', 'Dashboard'],
            ['/dashboard/list-member', 'IndexMember'],
            ['/dashboard/information', 'Information']
        ];

        foreach ($allowed as $route) {
            $response = $this->withoutExceptionHandling()->actingAs($user)->get($route[0]);
            $response->assertStatus(200);
            $response->assertInertia(fn (Assert $page) => $page->component($route[1]));
        }

        // Forbidden routes
        $forbidden = [
            '/dashboard/events',
            '/dashboard/gallery',
            '/dashboard/news',
            '/dashboard/system',
            '/dashboard/system/log-visitor',
            '/dashboard/system/releases'
        ];

        foreach ($forbidden as $uri) {
            $response = $this->withoutExceptionHandling()->actingAs($user)->get($uri);
            $this->assertTrue(in_array($response->status(), [403, 302]));
        }
    }
}
