<div align="center">
  <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo">
  <br/>
  <br/>

  # 🎭 UKM Lises Asmarandana - Official Website & Portal
  
  **Platform Profil & Sistem Informasi Manajemen Anggota UKM Seni Musik & Tari Lises Asmarandana**<br/>
  *Universitas Muhammadiyah Sukabumi (UMMI)*

  <p align="center">
    <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  </p>
</div>

---

## 📖 Tentang Proyek

Website ini adalah platform resmi terintegrasi untuk **UKM Lises Asmarandana** yang berfungsi sebagai **Company Profile (Landing Page)** sekaligus **Sistem Informasi Manajemen** untuk pengurus dan anggota. 

Proyek ini menggunakan arsitektur *Hybrid* modern yang memadukan kekuatan **Laravel** di sisi *backend* dengan ekosistem **React & TypeScript** di sisi *frontend*.

### 🏗️ Arsitektur Aplikasi
Aplikasi ini dibagi menjadi dua bagian *frontend* yang berjalan pada satu aplikasi Laravel:
1. **Public Landing Page (SPA Murni)**: Menggunakan murni *React Router DOM* dan berkomunikasi dengan *backend* melalui **REST API via Axios**. Menyediakan pengalaman navigasi yang sangat cepat (*Single Page Application*) tanpa *reload* halaman.
2. **Admin Dashboard (Inertia.js)**: Menggunakan **Inertia.js** untuk menjembatani *routing* Laravel dengan komponen React secara transparan. Memudahkan manajemen data tanpa perlu membangun API terpisah untuk fitur admin.

## ✨ Fitur Utama

- 🌍 **Bilingual Support (i18n)** - Landing page mendukung multi-bahasa (Indonesia & Inggris).
- 🎨 **Modern & Responsive UI** - Dibangun dengan **Tailwind CSS** dan komponen UI dari **Shadcn UI**.
- 👥 **Manajemen Anggota Pengurus** - Sistem pengelolaan data anggota, mencakup status Kepengurusan (Aktif) dan Demisioner (Alumni).
- 🏛️ **Manajemen Angkatan (Batch)** - Pengelompokan anggota berdasarkan tahun dan nama angkatan.
- 🎟️ **Sistem Event & Ticketing** - Manajemen acara beserta penjualan tiket secara online maupun offline lengkap dengan pemantauan *status order*.
- 📰 **Portal Berita & Artikel** - Sistem manajemen publikasi berita dan artikel informatif.
- ☁️ **Cloudinary Integration** - Penyimpanan dan optimasi *image assets* secara cloud melalui integrasi Cloudinary.
- ⚡ **Fast Navigation** - Transisi instan antar halaman berkat implementasi SPA (*Single Page Application*).
- 🔒 **Secure Authentication** - Sistem login dan peran (Role) yang aman menggunakan Spatie Role Permission Laravel.

## 🛠️ Teknologi yang Digunakan

### Backend
* [**Laravel 13**](https://laravel.com/) - PHP Framework
* **PostgreSQL** - Database Relasional
* **Cloudinary API** - Cloud Image Storage Driver
* **REST API** - Endpoints untuk Landing Page SPA

### Frontend
* [**React 18**](https://reactjs.org/) - UI Library
* [**TypeScript**](https://www.typescriptlang.org/) - Static Type Checker
* [**Inertia.js**](https://inertiajs.com/) - Menghubungkan Laravel & React (Untuk Admin Dashboard)
* [**React Router DOM**](https://reactrouter.com/) - Routing untuk Landing Page SPA
* [**Axios**](https://axios-http.com/) - HTTP Client untuk pemanggilan API
* [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework
* [**Shadcn UI**](https://ui.shadcn.com/) - Reusable UI Components
* [**i18next**](https://www.i18next.com/) - Internationalization (Multi-bahasa)

---

## 🚀 Cara Menjalankan Aplikasi di Lokal (Development)

Ikuti langkah-langkah berikut untuk menjalankan *project* ini di komputer Anda:

### 1. Kebutuhan Sistem
Pastikan Anda telah menginstal:
- **PHP** >= 8.2
- **Composer**
- **Node.js** (Disarankan versi LTS terbaru) & **NPM**
- **PostgreSQL**

### 2. Instalasi Backend (Laravel)

```bash
# Kloning repositori
git clone https://github.com/rizkychandra22/Ukm-Lises.git
cd Ukm-Lises

# Instal dependensi PHP
composer install

# Salin file .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Konfigurasi Database
Buka file `.env` dan sesuaikan kredensial database Anda:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=nama_database_anda
DB_USERNAME=postgres
DB_PASSWORD=
```
Lalu jalankan migrasi dan seeder untuk data awal:
```bash
php artisan migrate --seed
```

### 4. Instalasi Frontend (React & Tailwind)
Buka terminal baru di direktori proyek yang sama, lalu jalankan:
```bash
# Instal dependensi NPM
npm install

# Jalankan Vite server untuk kompilasi asset frontend secara realtime
npm run dev
```

### 5. Jalankan Server Laravel
Kembali ke terminal pertama, jalankan lokal server Laravel:
```bash
php artisan serve
```

Aplikasi kini dapat diakses melalui: **`http://localhost:8000`**

---

## 📂 Struktur Direktori Utama Frontend

```text
resources/
└── js/
    ├── FrontEnd-React-Ts/       # Area Landing Page (Pure React SPA + Axios)
    │   ├── src/
    │   │   ├── components/      # UI Components Publik
    │   │   ├── i18n/            # Konfigurasi Multi-bahasa
    │   │   ├── pages/           # Halaman Landing Page
    │   │   └── ...
    │
    ├── Inertia-React-Ts/        # Area Admin Dashboard (Inertia + React)
    │   ├── Components/          # UI Components Admin (Shadcn Radix-UI)
    │   ├── Layouts/             # Layout Dashboard & Sidebar
    │   ├── Pages/               # Halaman Dashboard Admin
    │   └── ...
```

---

<p align="center">
  Dibuat ❤️ oleh <b>Rizky Chandra</b> untuk <b>UKM Lises Asmarandana UMMI</b>
</p>
