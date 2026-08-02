# Perbaikan & Penyesuaian CRUD Event Dashboard

Hasil review menyeluruh terhadap halaman `/dashboard/events` dan perbandingannya dengan halaman CRUD lain (Data Anggota, Data Berita, Data Galeri).

## User Review Required

> [!IMPORTANT]
> **Double Toast**: Sama seperti masalah di Berita tadi, semua CRUD di EventController saat ini juga mengirim **flash message** via `->with('success', '...')`. Karena `app.tsx` sudah punya global flash handler, maka setiap aksi akan memunculkan **2 toast** (satu dari `onSuccess` callback di frontend, satu dari flash di backend). Saya akan menghapus semua `->with('success', '...')` di `EventController.php` agar konsisten dengan fix yang sudah diterapkan di Berita.

> [!WARNING]
> **Bug Kritis: Pesanan Offline selalu berstatus `pending`** — Saat ini `OrderService::createOrder()` line 55 **hardcode** `'status' => 'pending'`, padahal controller sudah menyiapkan `$validated['status'] = 'success'` untuk pesanan offline. Artinya pesanan offline yang seharusnya langsung sukses, justru tercatat sebagai pending.

## Temuan & Perubahan yang Direncanakan

---

### Backend — EventController & OrderService

#### [MODIFY] [EventController.php](file:///d:/%21%60Learn-Programmer%60/Ukm-Lises/app/Http/Controllers/EventController.php)

| # | Masalah | Perbaikan |
|---|---------|-----------|
| 1 | Double toast — semua method return `->with('success', '...')` | Hapus `->with('success', ...)` dari semua redirect (selaraskan dengan NewsController yang sudah di-fix) |
| 2 | `remaining_tickets` tidak tersedia di frontend karena `Event` model tidak punya `$appends` | Tambahkan `->append('remaining_tickets')` di query `index()` |

#### [MODIFY] [OrderService.php](file:///d:/%21%60Learn-Programmer%60/Ukm-Lises/app/Services/OrderService.php)

| # | Masalah | Perbaikan |
|---|---------|-----------|
| 1 | **Bug**: `'status' => 'pending'` hardcoded — pesanan offline seharusnya `'success'` | Ubah menjadi `'status' => $data['status'] ?? 'pending'` agar controller bisa mengoverride |
| 2 | `$data['email']` tanpa null-safe — crash jika email kosong (offline order) | Ubah menjadi `$data['email'] ?? null` |

---

### Frontend — IndexEvent.tsx

#### [MODIFY] [IndexEvent.tsx](file:///d:/%21%60Learn-Programmer%60/Ukm-Lises/resources/js/Inertia-React-Ts/Pages/IndexEvent.tsx)

| # | Masalah | Perbaikan |
|---|---------|-----------|
| 1 | `handleSubmitEvent` → `setEventData` dipanggil lalu langsung `postEvent` pada frame yang sama. **State belum ter-update** saat `postEvent` dijalankan, sehingga `date` yang terkirim masih kosong/salah. | Refactor: buat object `FormData` secara manual lalu kirim langsung tanpa mengandalkan React state update sinkron. Atau gunakan `setTimeout` / efek. |
| 2 | Submit edit event → `setEventData('_method', 'put')` dipanggil tepat sebelum `postEvent`, tapi state belum flush. Walaupun pada `handleEditEvent` sudah diset `_method: 'put'`, ini bisa menyebabkan race condition. | Hapus `setEventData('_method', ...)` di `handleSubmitEvent` — cukup andalkan nilai yang sudah diset di `handleAddEvent` / `handleEditEvent`. |

> [!NOTE]
> Secara UI & styling, Anda sudah melakukan pekerjaan yang sangat baik — styling table, badges, modals, form, dan delete dialogs sudah **selaras** dengan halaman CRUD lain (Member, Gallery, News). Tidak ada perbedaan visual signifikan yang perlu diperbaiki.

---

## Ringkasan Perubahan

| File | Aksi |
|------|------|
| `EventController.php` | Hapus flash message, tambah `append('remaining_tickets')` |
| `OrderService.php` | Fix status hardcode + null-safe email |
| `IndexEvent.tsx` | Fix race condition pada submit form (date & _method) |

## Verification Plan

### Automated Tests
```bash
php artisan test
```

### Manual Verification
- Buat event baru (Non-Exclusive & Exclusive) → pastikan tersimpan, toast hanya 1×
- Edit event → pastikan data tanggal/waktu terisi ulang dengan benar
- Hapus event → pastikan toast hanya 1×
- Buat pesanan offline → pastikan status langsung `success`, bukan `pending`
- Buat rekening bank → pastikan tersimpan
- Cek kolom "Tiket" di tabel → pastikan menampilkan sisa/total yang benar
