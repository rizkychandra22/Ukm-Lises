<?php

namespace Database\Seeders;

use App\Models\Major;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate agar saat di-seed ulang data tetap bersih tanpa duplikat
        Major::truncate();

        $majors = [
            // Fakultas Ekonomi
            ['faculty_id' => 'Fakultas Ekonomi', 'faculty_en' => 'Faculty of Economics', 'name_id' => 'Akuntansi', 'name_en' => 'Accounting', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Ekonomi', 'faculty_en' => 'Faculty of Economics', 'name_id' => 'Manajemen Ritel', 'name_en' => 'Retail Management', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Ekonomi', 'faculty_en' => 'Faculty of Economics', 'name_id' => 'Perpajakan', 'name_en' => 'Taxation', 'degree' => 'D3'],

            // Fakultas Hukum
            ['faculty_id' => 'Fakultas Hukum', 'faculty_en' => 'Faculty of Law', 'name_id' => 'Ilmu Hukum', 'name_en' => 'Law Studies', 'degree' => 'S1'],

            // Fakultas Ilmu Sosial
            ['faculty_id' => 'Fakultas Ilmu Sosial', 'faculty_en' => 'Faculty of Social Sciences', 'name_id' => 'Administrasi Bisnis', 'name_en' => 'Business Administration', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Ilmu Sosial', 'faculty_en' => 'Faculty of Social Sciences', 'name_id' => 'Administrasi Publik', 'name_en' => 'Public Administration', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Ilmu Sosial', 'faculty_en' => 'Faculty of Social Sciences', 'name_id' => 'Sastra Inggris', 'name_en' => 'English Literature', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Ilmu Sosial', 'faculty_en' => 'Faculty of Social Sciences', 'name_id' => 'Magister Ilmu Administrasi', 'name_en' => 'Master of Administrative Science', 'degree' => 'S2'],

            // Fakultas Keguruan & Ilmu Pendidikan
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Pendidikan Bahasa dan Sastra Indonesia', 'name_en' => 'Indonesian Language and Literature Education', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Pendidikan Biologi', 'name_en' => 'Biology Education', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Pendidikan Guru PAUD', 'name_en' => 'Early Childhood Teacher Education', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Pendidikan Guru Sekolah Dasar', 'name_en' => 'Elementary School Teacher Education', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Pendidikan Jasmani Kesehatan dan Rekreasi', 'name_en' => 'Physical Education, Health and Recreation', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Pendidikan Matematika', 'name_en' => 'Mathematics Education', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Pendidikan Teknologi Informasi', 'name_en' => 'Information Technology Education', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Magister Pedagogi', 'name_en' => 'Master of Pedagogy', 'degree' => 'S2'],
            ['faculty_id' => 'Fakultas Keguruan & Ilmu Pendidikan', 'faculty_en' => 'Faculty of Teacher Training and Education', 'name_id' => 'Pendidikan Profesi Guru', 'name_en' => 'Teacher Professional Education', 'degree' => 'Profesi'],

            // Fakultas Kesehatan
            ['faculty_id' => 'Fakultas Kesehatan', 'faculty_en' => 'Faculty of Health Sciences', 'name_id' => 'D3 Keperawatan', 'name_en' => 'Diploma Nursing', 'degree' => 'D3'],
            ['faculty_id' => 'Fakultas Kesehatan', 'faculty_en' => 'Faculty of Health Sciences', 'name_id' => 'S1 Keperawatan', 'name_en' => 'Bachelor Nursing', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Kesehatan', 'faculty_en' => 'Faculty of Health Sciences', 'name_id' => 'Pendidikan Profesi Ners', 'name_en' => 'Nurse Professional Education', 'degree' => 'Profesi'],

            // Fakultas Pertanian
            ['faculty_id' => 'Fakultas Pertanian', 'faculty_en' => 'Faculty of Agriculture', 'name_id' => 'Agribisnis', 'name_en' => 'Agribusiness', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Pertanian', 'faculty_en' => 'Faculty of Agriculture', 'name_id' => 'Akuakultur', 'name_en' => 'Aquaculture', 'degree' => 'S1'],

            // Fakultas Sains & Teknologi
            ['faculty_id' => 'Fakultas Sains & Teknologi', 'faculty_en' => 'Faculty of Science & Technology', 'name_id' => 'Kimia', 'name_en' => 'Chemistry', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Sains & Teknologi', 'faculty_en' => 'Faculty of Science & Technology', 'name_id' => 'Teknik Sipil', 'name_en' => 'Civil Engineering', 'degree' => 'S1'],
            ['faculty_id' => 'Fakultas Sains & Teknologi', 'faculty_en' => 'Faculty of Science & Technology', 'name_id' => 'Teknik Informatika', 'name_en' => 'Informatics Engineering', 'degree' => 'S1'],
        ];

        foreach ($majors as $major) {
            Major::create($major);
        }
    }
}