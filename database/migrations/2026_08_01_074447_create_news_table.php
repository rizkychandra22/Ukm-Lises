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
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['Pementasan', 'Pelatihan', 'Prestasi', 'Aktivitas']);
            $table->date('date');
            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->string('slug')->unique();
            $table->text('summary_id');
            $table->text('summary_en')->nullable();
            $table->longText('description_id');
            $table->longText('description_en')->nullable();
            $table->string('image');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
