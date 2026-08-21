<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Spatie\Permission\Models\Role;

use Inertia\Testing\AssertableInertia as Assert;

class DashboardControllerTest extends TestCase
{
	use RefreshDatabase;
	
	public function test_dashboard_page_can_be_accessed_by_authenticated_user()
	{
		Role::create(['name' => 'Developer']);
		
		$user = User::factory()->create(['username' => 'testuser']);
		$user->assignRole('Developer');

		config()->set('inertia.testing.ensure_pages_exist', false);

		$response = $this->actingAs($user)->get('/dashboard');

		$response->assertStatus(200);
		$response->assertInertia(fn (Assert $page) => $page
			->component('Dashboard')
		);
	}

	public function test_dashboard_page_cannot_be_accessed_by_unauthenticated_user()
	{
		$response = $this->get('/dashboard');
		$response->assertRedirect('/auth/login');
	}
}


