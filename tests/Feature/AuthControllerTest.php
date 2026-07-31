<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'Developer']);
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'User']);

        $this->user = User::create([
            'name' => 'Test User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => bcrypt('password')
        ]);

        $this->user->assignRole('Admin');
    }

    public function test_login_page_renders_successfully()
    {
        $response = $this->get('/auth/login');
        $response->assertStatus(200);
    }

    public function test_user_can_login_with_username()
    {
        $response = $this->post('/auth/login', [
            'login' => 'testuser',
            'password' => 'password'
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($this->user);
    }

    public function test_user_can_login_with_email()
    {
        $response = $this->post('/auth/login', [
            'login' => 'test@example.com',
            'password' => 'password'
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($this->user);
    }

    public function test_login_validation_fails_with_wrong_password()
    {
        $response = $this->post('/auth/login', [
            'login' => 'testuser',
            'password' => 'wrongpassword'
        ]);

        $response->assertSessionHasErrors('login');
        $this->assertGuest();
    }

    public function test_user_can_logout()
    {
        $this->actingAs($this->user);

        $response = $this->post('/dashboard/auth/logout');

        $response->assertRedirect('/auth/login');
        $this->assertGuest();
    }

    public function test_user_can_update_profile_without_password()
    {
        $this->actingAs($this->user);

        $response = $this->put('/dashboard/profile', [
            'name' => 'Updated Name',
            'username' => 'updatedusername'
        ]);

        $response->assertRedirect();
        $this->user->refresh();

        $this->assertEquals('Updated Name', $this->user->name);
        $this->assertEquals('updatedusername', $this->user->username);
    }

    public function test_user_can_update_profile_with_password()
    {
        $this->actingAs($this->user);

        $response = $this->put('/dashboard/profile', [
            'name' => 'Updated Name',
            'username' => 'updatedusername',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword'
        ]);

        $response->assertRedirect();
        $this->user->refresh();

        $this->assertTrue(Hash::check('newpassword', $this->user->password));
    }
}
