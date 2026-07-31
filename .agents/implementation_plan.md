# Redesign Batch & Member Business Logic & Database Structure

## Goal & Background Context
Saat ini terjadi kendala logika bisnis saat akun Angkatan (User) melakukan input data anggota. Pada logika awal, data anggota dari akun angkatan langsung di-lock tanpa memperhitungkan apakah angkatan tersebut masih **aktif dalam kepengurusan UKM** atau **sudah demisioner/alumni**.

Perubahan ini bertujuan untuk menambahkan kolom `status` pada tabel `batches`, menggunakan enum `type` (`Demisioner`, `Pengurus`) pada `batch_members`, menyesuaikan logika input dengan checkbox/opsi (Menjabat vs Tidak Menjabat), memperbarui matriks Role Permissions, serta memelihara tata letak UI yang sudah ada tanpa ada perubahan layout.

---

## Audited Database Schema Specifications

1. **`batches.status`**: `enum('Active', 'Deactive')` (Default: `'Active'`)
   - **`Active`**: Angkatan yang saat ini sedang aktif memegang masa kepengurusan UKM.
   - **`Deactive`**: Angkatan yang sudah demisioner/alumni.

2. **`batch_members.type`**: `enum('Demisioner', 'Pengurus')`
   - **`Demisioner`**: Anggota alumni dari angkatan yang berstatus `Deactive`.
   - **`Pengurus`**: Anggota dari angkatan yang berstatus `Active`.

3. **`batch_members.status`**: `enum('Active', 'Deactive')` (Default: `'Active'`)
   - **`Active`**: Anggota pengurus yang menjabat.
   - **`Deactive`**: Anggota non-aktif / alumni / pengurus yang tidak menjabat.

---

## Input Form Mechanics (`Active` Batch Members)

Saat menginput data anggota pada **Angkatan Aktif** (`type: Pengurus`), terdapat pilihan/checkbox penentu:

1. **Opsi 1: Menjabat** (`status: Active`)
   - **Jabatan** (`position_id`): Text input manual (contoh: *Ketua Umum*, *Kadep SBD*, *Staff Kominfo*, dsb.).
   - **Periode** (`periode`): Terisi otomatis / diisi periode kepengurusan yang sedang berjalan.

2. **Opsi 2: Tidak Menjabat** (`status: Deactive`)
   - **Jabatan** (`position_id`): Select dropdown dengan pilihan:
     - **Anggota Biasa**
     - **Mahasiswa Baru**
   - **Periode** (`periode`): Terisi otomatis / diisi periode kepengurusan yang sedang berjalan.

---

## Detailed Role Permissions Matrix

### 1. Role Developer (sebelumnya *Master*)
- Full CRUD untuk Data Angkatan (**Batches**).
- Full CRUD untuk Semua Data Anggota (**Batch Members**), baik Pengurus Menjabat, Pengurus Tidak Menjabat, maupun Demisioner.

### 2. Role Admin
- Full CRUD untuk Data Angkatan (**Batches**).
- Full CRUD untuk Data Anggota **Pengurus Menjabat** (`type: Pengurus`, `status: Active`).
- **Create** & **Read-only** untuk Data Anggota **Pengurus Tidak Menjabat** (`type: Pengurus`, `status: Deactive`) dan **Demisioner** (`type: Demisioner`) (Tanpa akses Edit & Delete).

### 3. Role User Angkatan
- Full CRUD untuk Data Anggota yang termasuk ke dalam **Angkatannya sendiri** (`userBatch`), termasuk anggota angkatannya yang masuk ke dalam struktur kepengurusan.
- **Read-only** untuk data anggota angkatan lain dan data kepengurusan angkatan lain.

---

## Public Landing Page Tabs (`MemberPage.tsx`)

Tabel data anggota pada Landing Page dibagi menjadi **3 Tab Table**:
1. **Demisioner**: Data anggota dari angkatan `Deactive` (`type: Demisioner`).
2. **Kepengurusan**: Data anggota `type: Pengurus` dengan `status: Active` (Pengurus Menjabat).
3. **Anggota Baru / Non-Pengurus**: Data anggota `type: Pengurus` dengan `status: Deactive` (posisi *Anggota Biasa* / *Mahasiswa Baru*).

---

## Proposed Changes

### Database & Seeders

#### [MODIFY] [2026_07_27_035330_create_batches_table.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/database/migrations/2026_07_27_035330_create_batches_table.php)
- Edit file migrasi untuk menambahkan kolom `$table->enum('status', ['Active', 'Deactive'])->default('Active');`.

#### [MODIFY] [2026_07_27_035522_create_batch_members_table.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/database/migrations/2026_07_27_035522_create_batch_members_table.php)
- Pastikan enum `type` bertuliskan `$table->enum('type', ['Demisioner', 'Pengurus']);`.
- Pastikan enum `status` bertuliskan `$table->enum('status', ['Active', 'Deactive'])->default('Active');`.

#### [MODIFY] [AccountSeeder.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/database/seeders/AccountSeeder.php)
- Ubah penamaan role `'Master'` menjadi `'Developer'`.

---

### Backend Models, Services & Routes

#### [MODIFY] [Batch.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/app/Models/Batch.php)
- Tambahkan `status` ke properti `$fillable`.

#### [MODIFY] [BatchMember.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/app/Models/BatchMember.php)
- Pastikan enum `type` (`Demisioner`, `Pengurus`) dan `status` (`Active`, `Deactive`) sudah sesuai.

#### [MODIFY] [BatchService.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/app/Services/BatchService.php)
- Tambahkan penanganan kolom `status` saat `createBatch` dan `updateBatch`.

#### [MODIFY] [BatchMemberService.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/app/Services/BatchMemberService.php)
- Sesuaikan penanganan logika `status`, `type` (`Demisioner`, `Pengurus`), `position_id`, dan `periode` berdasarkan `batch.status`:
  - Jika `batch.status === 'Deactive'`: paksa `type = 'Demisioner'`, `status = 'Deactive'`, `position_id = null`, `position_en = null`, `periode = null`.
  - Jika `batch.status === 'Active'`: paksa `type = 'Pengurus'`.
    - Jika opsi Menjabat dipilih (`status: Active`): simpan `position_id` dari input manual teks, `periode` = periode berjalan.
    - Jika opsi Tidak Menjabat dipilih (`status: Deactive`): simpan `position_id` dari dropdown (*Anggota Biasa* / *Mahasiswa Baru*), `periode` = periode berjalan.

#### [MODIFY] [ListMemberController.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/app/Http/Controllers/ListMemberController.php)
- Perbarui validasi `status` (`in:Active,Deactive`) untuk `storeBatch` dan `updateBatch`.
- Perbarui validasi `type` menjadi `in:Demisioner,Pengurus`.

#### [MODIFY] [web.php](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/routes/web.php)
- Sesuaikan middleware dan pengecekan role `role:Developer|Admin|User`.

---

### Frontend Admin Dashboard (`Inertia-React-Ts`)

#### [MODIFY] [IndexMember.tsx](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/resources/js/Inertia-React-Ts/Pages/IndexMember.tsx)
1. **Perubahan Tipe & Role**:
   - Ganti string `'Master'` menjadi `'Developer'`.
   - Gunakan `type` enum: `'Demisioner' | 'Pengurus'`.
2. **Form Batch & Member**:
   - Pada Modal Batch: Tambahkan input Select `Status Angkatan` (`Active`/`Deactive`).
   - Pada Modal Member:
     - Jika Angkatan Aktif: Sediakan Radio/Checkbox untuk memilih **Menjabat** vs **Tidak Menjabat**.
       - Menjabat: Input teks manual Jabatan.
       - Tidak Menjabat: Dropdown Select Jabatan (*Anggota Biasa* / *Mahasiswa Baru*).

#### [MODIFY] [Dashboard.tsx](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/resources/js/Inertia-React-Ts/Pages/Dashboard.tsx) & [AppSidebar.tsx](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/resources/js/Inertia-React-Ts/Layouts/AppSidebar.tsx)
- Ganti string `'Master'` menjadi `'Developer'`.

---

### Frontend Public Landing Page (`FrontEnd-React-Ts`)

#### [MODIFY] [member.ts](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/resources/js/FrontEnd-React-Ts/src/lib/api/member.ts)
- Tambahkan properti `status?: 'Active' | 'Deactive'` pada interface `Batch` dan fungsi `normalizeBatch`.
- Perbarui type MemberType menjadi `'Demisioner' | 'Pengurus'`.

#### [MODIFY] [MemberPage.tsx](file:///d:/!%60Learn-Programmer%60/Ukm-Lises/resources/js/FrontEnd-React-Ts/src/pages/MemberPage.tsx)
- Perbarui struktur tabs menjadi 3 tabs:
  1. **Demisioner** (`type === 'Demisioner'`)
  2. **Kepengurusan** (`type === 'Pengurus'` && `status === 'Active'`)
  3. **Anggota Baru / Non-Pengurus** (`type === 'Pengurus'` && `status === 'Deactive'`)

---

## Verification Plan

### Manual Verification
1. **Migration & Seeder Fresh**: Jalankan `php artisan migrate:fresh --seed` untuk menerapkan enum `['Demisioner', 'Pengurus']` dan menyemaikan role `Developer`, `Admin`, `User`.
2. **Testing Login Role Developer**: Login dengan username `dev`, password `password`. Pastikan semua tombol CRUD tampil dan berfungsi.
3. **Testing Login Role Admin**: Login dengan username `admincore`, password `password`. Pastikan pada Tidak Menjabat/Demisioner hanya tampil tombol Create & View, tanpa Edit & Delete.
4. **Testing Login Role User Angkatan**: Login dengan akun angkatan. Pastikan tombol Edit/Delete hanya muncul pada anggota angkatannya sendiri.
5. **Testing Public Page (`MemberPage.tsx`)**: Uji 3 Tab pada Landing Page: **Demisioner**, **Kepengurusan**, dan **Anggota Baru / Non-Pengurus**.
