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
            $table->string('email');
            $table->string('phone');
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->integer('qty');
            $table->decimal('total_price', 15, 2);
            $table->text('notes')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_proof')->nullable();
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
