# Perubahan UI & Logika Fungsi: `main` vs `development`

> [!NOTE]
> Dokumen ini fokus pada **file yang sudah ada di `main` dan berubah di `development`** — bukan file baru. Tujuannya untuk mengidentifikasi mana yang berubah secara **visual (UI)** dan mana yang berubah secara **fungsional (logika)**.

---

## Ringkasan Cepat

| Kategori | Perubahan UI? | Perubahan Logika? | Keterangan |
|----------|:---:|:---:|------------|
| **AppSidebar.tsx** | ✅ Ya | ✅ Ya | Menu baru + icon baru |
| **Header.tsx** | ✅ Ya | ✅ Ya | Breadcrumb dinamis multi-level |
| **AppLayout.tsx** | ❌ Tidak | ❌ Tidak | Hanya rename + formatting |
| **ThemeProvider.tsx** | ❌ Tidak | ❌ Tidak | Hanya formatting (semicolons) |
| **Route.ts (Lib)** | ❌ Tidak | ❌ Tidak | Hanya formatting |
| **Dashboard.tsx** | ✅ Kecil | ❌ Tidak | Teks sambutan berubah |
| **Login.tsx** | ❌ Tidak | ❌ Tidak | Hanya formatting |
| **IndexMember.tsx** | ✅ Ya | ✅ Ya | Total refactor ke modular components |
| **main.tsx (Landing)** | ✅ Ya | ✅ Ya | Error Boundary + QueryClient |
| **api-client.ts** | ❌ Tidak | ✅ Ya | axios-retry + URL berubah |
| **HomePage.tsx** | ✅ Ya | ✅ Ya | Data dari API + skeleton loading |
| **MemberPage.tsx** | ✅ Kecil | ✅ Ya | TanStack Query hooks |
| **EventPage.tsx** | ✅ Ya | ✅ Ya | Fitur baru: ticketing system |
| **GalleryPage.tsx** | ✅ Kecil | ✅ Ya | Data dari API |
| **NewsPage.tsx** | ✅ Kecil | ✅ Ya | Data dari API |
| **NewsDetailPage.tsx** | ✅ Ya | ✅ Ya | Loading skeleton + error state |
| **EventController.php** | — | ✅ Ya | Auto-update status event |
| **web.php** | — | ✅ Ya | Route baru + fallback 404 |
| **config/app.php** | — | ✅ Ya | Timezone: UTC → Asia/Jakarta |

---

## A. Dashboard (Inertia-React-Ts)

### 1. AppSidebar.tsx — ✅ UI + ✅ Logika

**Perubahan UI:**
- Ditambah 3 menu navigasi baru di sidebar dengan icon masing-masing:
  - 📰 **Data Berita** (icon: `Newspaper`)
  - 🖼️ **Data Galeri** (icon: `ImageIcon`)
  - 🎫 **Data Event** (icon: `CalendarDays`)
- Menu-menu ini tampil sesuai role user (Developer, Admin, User)

**Perubahan Logika:**
- Penambahan item navigasi ke 3 route baru (`news.*`, `gallery.*`, `event.*`)
- Logic `hasRole()` dan `isActive()` tidak berubah secara fungsional

**Formatting saja:**
- Seluruh file di-format ulang dari indentasi 4-space ke 2-space (Prettier)
- Quote style: single quotes → double quotes

---

### 2. Header.tsx — ✅ UI + ✅ Logika

**Perubahan UI:**
- Breadcrumb sekarang mendukung **multi-level** (bertingkat), misalnya:
  - `main`: `Dashboard > Data Anggota`
  - `development`: `Dashboard > News > Create` atau `Dashboard > Events > #2`

**Perubahan Logika:**
```diff
- // main: Breadcrumb sederhana 2-level
- const segments = url.split('/').filter(Boolean);
- const lastSegment = segments[segments.length - 1];
- const pageName = formatPageName(lastSegment);

+ // development: Breadcrumb dinamis N-level
+ const pathWithoutQuery = url.split("?")[0];
+ const allSegments = pathWithoutQuery.split("/").filter(Boolean);
+ const routeSegments = allSegments[0] === "dashboard" ? allSegments.slice(1) : allSegments;
+ // Loop setiap segment untuk render breadcrumb bertingkat
```

- Ditambah `customLabels` map untuk menerjemahkan slug ke label yang readable
- Segment angka (ID) otomatis di-render sebagai `#2`, `#5`, dll.
- Query string (`?page=2`) tidak lagi ikut masuk ke breadcrumb

**Visual tetap sama:** Search bar, notification bell, theme toggle — tidak berubah.

---

### 3. AppLayout.tsx — ❌ Tidak Berubah

Hanya perubahan kosmetik:
- Nama komponen: `AdminLayout` → `DashboardLayout`
- Formatting: indentasi 4-space → 2-space

> UI dan logika layout 100% identik.

---

### 4. ThemeProvider.tsx — ❌ Tidak Berubah

Seluruh perubahan adalah **formatting saja** (Prettier):
- Menambahkan semicolons di akhir baris
- Tidak ada perubahan logika atau tampilan apapun

---

### 5. Route.ts (Lib) — ❌ Tidak Berubah

Formatting saja: single quotes → double quotes. Fungsi `route()` identik.

---

### 6. Dashboard.tsx — ✅ UI Kecil

**Perubahan UI:**
- Teks sambutan berubah untuk role User:
```diff
- // main: Teks generik
+ // development: Teks spesifik per role
+ "Halo Angkatan {user.name}, selamat datang kembali di Lises Asmarandana."
```

**Logika:** Stat cards (Total Anggota, Demisioner, Kepengurusan, Total Angkatan) — **tidak berubah** secara fungsional. Hanya di-format ulang (indentasi 2-space).

---

### 7. Login.tsx — ❌ Tidak Berubah

Seluruh perubahan adalah **formatting** (Prettier: 4-space → 2-space, single → double quotes).

> UI tampilan identik, logika captcha dan submit identik.

---

### 8. IndexMember.tsx — ✅ UI + ✅ Logika (MAJOR REFACTOR)

Ini adalah **perubahan terbesar** di seluruh proyek:

**main (1.180 baris — monolitik):**
- Semua logika CRUD Member, Batch, tabel, form modal, delete dialog — semuanya dalam 1 file
- Tipe data (`Batch`, `BatchMember`, `Major`) didefinisikan inline

**development (408 baris — modular):**
- Dipecah ke komponen terpisah:

| Komponen | Fungsi |
|----------|--------|
| `MemberTable.tsx` | Tabel anggota menggunakan TanStack Table |
| `MemberFormModal.tsx` | Form CRUD anggota |
| `MemberDeleteDialog.tsx` | Dialog hapus anggota |
| `MemberDetailSheet.tsx` | Detail anggota (slide panel) |
| `BatchTable.tsx` | Tabel angkatan |
| `BatchFormModal.tsx` | Form CRUD angkatan |
| `BatchDeleteDialog.tsx` | Dialog hapus angkatan |
| `Types.ts` | Type definitions terpisah |

**Perubahan UI:**
- Tabel sekarang menggunakan **TanStack React Table** (sorting, filtering headless)
- Kolom foto: fallback menggunakan `ui-avatars.com` (bukan initials lokal)
- Tab navigasi dan filtering dipindah ke komponen terpisah tapi **tampilannya sama**

**Perubahan Logika:**
- Data flow: IndexMember sekarang hanya sebagai **orchestrator**, passing props ke child components
- CRUD operations tetap menggunakan `useForm` dari Inertia (tidak berubah)
- Filter dan sorting sekarang dikelola oleh TanStack Table bukan manual state

---

## B. Landing Page (FrontEnd-React-Ts)

### 9. main.tsx (Entry Point) — ✅ UI + ✅ Logika

**Perubahan Logika (Signifikan):**

```diff
- // main: Render langsung
- ReactDOM.createRoot(document.getElementById("root")!).render(
-   <React.StrictMode>
-     <HelmetProvider>
-       <App />
-     </HelmetProvider>
-   </React.StrictMode>
- );

+ // development: Dibungkus ErrorBoundary + QueryClientProvider
+ <React.StrictMode>
+   <ErrorBoundary FallbackComponent={GlobalErrorFallback} onReset={() => window.location.reload()}>
+     <QueryClientProvider client={queryClient}>
+       <HelmetProvider>
+         <App />
+       </HelmetProvider>
+     </QueryClientProvider>
+   </ErrorBoundary>
+ </React.StrictMode>
```

**Perubahan UI:**
- Ditambah **GlobalErrorFallback** — tampilan error full-screen jika terjadi crash:
  - Heading: "Terjadi Kesalahan Sistem"
  - Tombol: "Muat Ulang Halaman"
  - Styling: gradient gold button, centered layout

**QueryClient Config:**
- `staleTime: 5 menit` — data di-cache selama 5 menit sebelum refetch
- `refetchOnWindowFocus: true` — otomatis refetch saat user kembali ke tab

---

### 10. api-client.ts — ✅ Logika

**Perubahan Logika:**
| Aspek | `main` | `development` |
|-------|--------|---------------|
| **Timeout** | 15.000ms | 10.000ms |
| **Retry** | Tidak ada | 2x retry dengan exponential backoff |
| **Retry Condition** | — | Network error + timeout (`ECONNABORTED`) |
| **Production URL** | `lises-asmarandana.laravel.cloud` | `lises.laravel.cloud` |
| **Dev URL** | `lises-asmarandana-dev.laravel.cloud` | `lises-dev.laravel.cloud` |

**UI:** Tidak ada perubahan visual (ini file utility).

---

### 11. HomePage.tsx — ✅ UI + ✅ Logika

**Perubahan Logika:**
```diff
- // main: Data dari hardcoded constants
- import { usePosts } from "@/constants/news";
- const posts = usePosts();

+ // development: Data dari API via TanStack Query hooks
+ import { useGallery } from "@/hooks/useGallery";
+ import { useNews } from "@/hooks/useNews";
+ const { galleries, isLoading: isGalleryLoading } = useGallery();
+ const { news, isLoading: isNewsLoading } = useNews();
```

**Perubahan UI:**
- Ditambah **Skeleton loading** saat data masih loading
- Section "Momen" / gallery: sekarang dari data API (bukan gambar static import)
- Section "Berita": sekarang dari data API (bukan hardcoded `usePosts()`)
- Hero banner: sedikit perubahan structure (tambah wrapper div, pointer-events handling)
- Ditambah icon baru di section cards: `Newspaper`, `Image`, `Camera`

---

### 12. MemberPage.tsx — ✅ UI Kecil + ✅ Logika

**Perubahan Logika:**
```diff
- // main: Fetch manual di useEffect
- const [members, setMembers] = useState([]);
- useEffect(() => { fetchData(); }, []);

+ // development: TanStack Query hooks
+ const { members, isLoading: isMembersLoading } = useMembers();
+ const { batches, isLoading: isBatchesLoading } = useBatches();
```

- Filter alumni: `m.type === "Demisioner"` → `m.batch?.status === "Deactive"` (perbaikan logika)

**UI:** Tabel dan layout tetap sama. Hanya perbedaan minor formatting.

---

### 13. EventPage.tsx — ✅ UI + ✅ Logika (MAJOR)

**Perubahan UI (+888 baris):**
- Ditambah **sistem pembelian tiket** lengkap:
  - Form pemesanan tiket (nama, email, phone, qty, catatan, bukti pembayaran)
  - Dialog E-Ticket / Boarding Pass dengan desain premium (gradient gold header, QR code, circle cutouts)
  - Tracking order dengan kode pesanan
- Event cards: ditambah badge status, remaining tickets, pricing display

**Perubahan Logika:**
- Integrasi penuh dengan API: `useEvents()`, `useOrder()` hooks
- Order submission via `POST /api/orders`
- Payment proof upload (file input)
- Order tracking via `GET /api/orders/track/{code}`

---

### 14. GalleryPage.tsx & NewsPage.tsx — ✅ UI Kecil + ✅ Logika

Kedua halaman mengalami perubahan yang sama:
- **Logika:** Migrasi dari `useEffect + axios.get()` → `useGallery()` / `useNews()` hooks (TanStack Query)
- **UI:** Ditambah loading skeleton, error states. Layout grid tetap sama.

---

### 15. NewsDetailPage.tsx — ✅ UI + ✅ Logika

**Perubahan UI:**
- Ditambah **loading skeleton** saat memuat detail berita
- Ditambah **error state** jika berita tidak ditemukan

**Perubahan Logika:**
- Migrasi ke hooks TanStack Query

---

## C. Backend (Laravel)

### 16. EventController.php — ✅ Logika

**Logika baru:**
```php
// Auto-update Event status jika melebihi 3 jam dari jadwal
Event::where('status', 'published')
    ->where('date', '<=', now()->subHours(3))
    ->update(['status' => 'completed']);

Event::where('status', 'draft')
    ->where('date', '<=', now()->subHours(3))
    ->update(['status' => 'cancelled']);
```

### 17. web.php — ✅ Logika

**Route baru:**
- Resource routes: `events`, `orders`, `accounts`, `galleries`, `news`
- Fallback route: `Route::any('{any}')` → render `NotFound` page

### 18. config/app.php — ✅ Logika

```diff
- 'timezone' => 'UTC',
+ 'timezone' => 'Asia/Jakarta',
```

### 19. Access Middleware — ✅ Logika

- Enhanced role checking untuk mendukung multi-role access

---

## D. Kesimpulan: Apa yang Benar-Benar Berubah?

### Perubahan UI yang Terlihat oleh User

| Halaman | Apa yang Terlihat Berbeda |
|---------|---------------------------|
| **Sidebar** | 3 menu navigasi baru (Berita, Galeri, Event) |
| **Header Breadcrumb** | Breadcrumb multi-level (bukan hanya 2 level) |
| **Dashboard** | Teks sambutan sedikit berbeda untuk role User |
| **Data Anggota** | Tabel menggunakan TanStack (sorting/filter lebih smooth) |
| **Landing: Home** | Gallery & berita dari API real (bukan static) + skeleton loading |
| **Landing: Event** | Sistem ticketing lengkap (form, E-Ticket, tracking) |
| **Landing: Error** | Error boundary fallback page (sebelumnya blank putih) |

### Perubahan Logika yang Tidak Terlihat tapi Penting

| Aspek | Dampak |
|-------|--------|
| **TanStack Query** | Data di-cache 5 menit, auto-refetch, retry otomatis |
| **axios-retry** | Request gagal otomatis retry 2x dengan exponential backoff |
| **Error Boundary** | Aplikasi tidak lagi blank putih saat crash — menampilkan fallback UI |
| **Auto Event Status** | Status event otomatis berubah jika melewati 3 jam dari jadwal |
| **Timezone Asia/Jakarta** | Semua operasi waktu di backend menggunakan WIB |
| **Modular Components** | IndexMember dipecah ke 8 komponen — lebih maintainable |

### Yang Hanya Formatting (Tidak Ada Perubahan Nyata)

| File | Jenis Formatting |
|------|-----------------|
| **ThemeProvider.tsx** | Semicolons ditambahkan |
| **Route.ts** | Single → double quotes |
| **Login.tsx** | 4-space → 2-space indentation |
| **AppLayout.tsx** | Rename `AdminLayout` → `DashboardLayout` + formatting |

> [!TIP]
> Sebagian besar file yang terlihat memiliki banyak baris berubah di git diff sebenarnya hanya **formatting (Prettier)**. Perubahan nyata yang harus diperhatikan saat merge adalah: **Sidebar menu**, **Header breadcrumb**, **IndexMember refactor**, **main.tsx wrapper**, dan **api-client retry logic**.
