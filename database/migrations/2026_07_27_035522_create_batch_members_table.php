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
        Schema::create('batch_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batch_id')->constrained()->onDelete('cascade');
            $table->foreignId('major_id')->constrained()->onDelete('cascade');
            $table->string('image')->nullable();
            $table->string('name');
            $table->enum('type', ['Administration', 'Demisioner']);
            $table->enum('status', ['Active', 'Deactive']);
            $table->string('periode')->nullable();
            $table->string('position_id')->nullable();
            $table->string('position_en')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_members');
    }
};
