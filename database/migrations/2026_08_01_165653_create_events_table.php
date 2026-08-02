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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->text('summary_id')->nullable();
            $table->text('summary_en')->nullable();
            $table->enum('type', ['Exclusive', 'Non-Exclusive']);
            $table->dateTime('date');
            $table->string('location_id');
            $table->string('location_en')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->integer('ticket')->nullable();
            $table->enum('status', ['draft', 'published', 'cancelled', 'completed'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
