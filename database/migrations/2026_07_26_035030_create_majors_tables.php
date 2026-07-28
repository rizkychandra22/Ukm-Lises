<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('majors', function (Blueprint $table) {
            $table->id();
            $table->string('faculty_id'); // Nama Fakultas (ID)
            $table->string('faculty_en'); // Nama Fakultas (EN)
            $table->string('name_id');    // Nama Jurusan/Prodi (ID)
            $table->string('name_en');    // Nama Jurusan/Prodi (EN)
            $table->string('degree')->nullable(); // D3, S1, S2, Profesi
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('majors');
    }
};