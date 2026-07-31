<div align="center">
  <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo">
  <br/>
  
  # 🎭 UKM Lises Asmarandana - Official Website & Portal
  
  **Platform Profil & Sistem Informasi Manajemen Anggota UKM Seni Musik & Tari Lises Asmarandana**<br/>
  *Universitas Muhammadiyah Sukabumi (UMMI)*

  <p align="center">
    <img src="https://img.shields.io/badge/Version-1.4.0-blue.svg" alt="Version 1.4.0">
    <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React-18.x-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-316192?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>

  <p align="center">
    <a href="#-tentang-proyek">Tentang Proyek</a> •
    <a href="#-fitur-unggulan">Fitur Unggulan</a> •
    <a href="#-arsitektur-aplikasi">Arsitektur</a> •
    <a href="#-teknologi">Teknologi</a> •
    <a href="#-panduan-instalasi">Instalasi</a>
  </p>
</div>

---

## 📖 Tentang Proyek

**UKM Lises Asmarandana Web Portal** adalah platform resmi terintegrasi yang dirancang khusus untuk memenuhi kebutuhan organisasi seni musik dan tari di lingkungan perguruan tinggi. Website ini berfungsi ganda sebagai **Company Profile (Landing Page)** yang elegan untuk publik, sekaligus **Sistem Informasi Manajemen (Admin Dashboard)** yang andal untuk pengurus dan anggota internal.

Dikembangkan dengan pendekatan *Hybrid Architecture* modern, aplikasi ini memaksimalkan kekuatan backend **Laravel** dan reaktivitas ekosistem **React & TypeScript** di sisi frontend.

---

## ✨ Fitur Unggulan

- 🌍 **Bilingual Support (i18n)** — Landing page mendukung multi-bahasa (Indonesia & Inggris) secara dinamis.
- 🚀 **SEO Optimized** — Penambahan metadata dinamis (`<SEOHead />`) di setiap halaman publik untuk pencarian mesin telusur yang optimal.
- 🎨 **Modern & Premium UI/UX** — Antarmuka elegan dan responsif dibangun dengan **Tailwind CSS** dan **Shadcn UI** dengan estetika premium (Glassmorphism, gradients, micro-animations).
- 👥 **Manajemen Anggota & Pengurus** — Sistem tata kelola data anggota komprehensif, dari status *Kepengurusan* hingga *Demisioner*.
- 🖼️ **Cloudinary Media Management** — Integrasi penyimpanan cloud untuk penanganan gambar dan aset media yang efisien tanpa membebani server lokal.
- ⚡ **Lightning Fast Navigation** — Transisi antarmuka tanpa *reload* ala *Single Page Application* (SPA).
- 🔒 **Role-based Access Control (RBAC)** — Autentikasi dan pembatasan hak akses aman menggunakan *Spatie Permission*.
- 🧪 **Automated Testing** — Didukung oleh integrasi *Unit Test* dan CI/CD pipeline menggunakan **PHPUnit/Pest** (Backend) dan **Vitest** (Frontend).

---

## 🏗️ Arsitektur Aplikasi

Proyek ini mendemonstrasikan implementasi arsitektur frontend ganda di atas satu backend Laravel:

1. **Public Landing Page (Pure SPA)** 
   Menggunakan *React Router DOM* standar yang berkomunikasi dengan *backend* via **REST API (Axios)**. Memberikan pengalaman interaktif maksimal bagi pengunjung situs.
2. **Admin Dashboard (Inertia.js)** 
   Menggunakan **Inertia.js** untuk menjembatani *routing* Laravel dengan komponen React secara *seamless*, tanpa memerlukan perancangan API terpisah untuk pengelolaan data internal.

---

## 🛠️ Teknologi

<details>
<summary><b>💻 Backend Engine</b></summary>

- [**Laravel**](https://laravel.com/) - Kerangka kerja PHP tangguh
- **PostgreSQL** - Basis data relasional berskala besar
- **Spatie Permission** - Sistem otorisasi RBAC
- **Cloudinary SDK** - Manajemen penyimpanan aset awan
- **PHPUnit / Pest** - Kerangka kerja pengujian (Testing)
</details>

<details>
<summary><b>🎨 Frontend Ecosystem</b></summary>

- [**React 18**](https://reactjs.org/) - Perpustakaan UI interaktif
- [**TypeScript**](https://www.typescriptlang.org/) - Pengetikan statis untuk keamanan kode
- [**Inertia.js**](https://inertiajs.com/) - Adaptor monolith modern
- [**React Router DOM**](https://reactrouter.com/) - Manajemen rute SPA
- [**Tailwind CSS**](https://tailwindcss.com/) & [**Shadcn UI**](https://ui.shadcn.com/) - Sistem desain fungsional dan estetis
- [**i18next**](https://www.i18next.com/) - Lokalisasi aplikasi
- [**Vitest**](https://vitest.dev/) - Pengujian komponen sisi klien
</details>

---

## 🚀 Panduan Instalasi (Development)

Siapkan lingkungan lokal Anda dengan mengikuti panduan singkat ini:

### 1. Kebutuhan Sistem
- **PHP** >= 8.2
- **Node.js** (LTS) & **NPM**
- **Composer**
- **PostgreSQL**

### 2. Konfigurasi Repositori
```bash
# 1. Kloning repositori
git clone https://github.com/rizkychandra22/Ukm-Lises.git
cd Ukm-Lises

# 2. Instal dependensi PHP (Backend)
composer install

# 3. Instal dependensi NPM (Frontend)
npm install

# 4. Siapkan Environment Variables
cp .env.example .env
php artisan key:generate
```

### 3. Konfigurasi Database & Cloudinary
Buka file `.env` dan atur kredensial berikut:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=lises_db
DB_USERNAME=postgres
DB_PASSWORD=passwordmu

# Konfigurasi Cloudinary
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```
Setelah itu, lakukan migrasi dan seeding data awal:
```bash
php artisan migrate --seed
```

### 4. Menjalankan Server
Gunakan dua terminal terpisah untuk menjalankan aplikasi:

**Terminal 1 (Vite Development Server):**
```bash
npm run dev
```

**Terminal 2 (Laravel Development Server):**
```bash
php artisan serve
```
Aplikasi Publik & Dashboard kini dapat diakses di: **`http://localhost:8000`**

---

## 🧪 Pengujian (Testing)

Proyek ini dilengkapi dengan skenario pengujian otomatis untuk menjaga keandalan kode.

**Backend Tests (PHPUnit):**
```bash
php artisan test
```

**Frontend Tests (Vitest):**
```bash
npm run test
```

---

<p align="center">
  Dibuat dengan ❤️ dan dedikasi oleh <b>Rizky Chandra</b> untuk <b>UKM Lises Asmarandana UMMI</b>.<br/>
  <i>Copyright © 2026. All rights reserved.</i>
</p>
