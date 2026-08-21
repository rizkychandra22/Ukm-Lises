<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pay_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->foreignId('event_session_id')->nullable()->constrained('event_sessions')->onDelete('cascade');
            $table->integer('qty');
            $table->decimal('total_price', 15, 2);
            $table->text('notes')->nullable();
            $table->string('payment_proof')->nullable();
            $table->foreignId('pay_account_id')->nullable()->constrained('pay_accounts')->onDelete('set null');
            $table->enum('order_method', ['online', 'offline'])->default('online');
            $table->enum('status', ['pending', 'success', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pay_orders');
    }
};
