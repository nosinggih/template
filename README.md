# 🚀 VibeTemplate - Premium Reusable Dashboard Template

**VibeTemplate** adalah cetak biru (*blueprint*) kerangka antarmuka (dashboard template) premium, ultra-responsif, sangat ringan (*lightweight*), dan modular yang dibangun murni menggunakan **Vanilla JS & Vanilla CSS**. Template ini dibalut dengan estetika desain modern kelas atas bergaya **Obsidian Cinematic Dark & Bright Mode** serta dihiasi oleh ilustrasi **Inline SVG yang dihidupkan sepenuhnya via CSS keyframe**.

Template ini dirancang siap pakai (*production-ready*) dan sangat mudah untuk dimigrasikan ke dalam framework backend modern seperti **Laravel (Blade & Vite)**.

---

## ✨ Fitur-Fitur Utama & Keunggulan

1. **Estetika Visual Premium & Harmonis**: Menggunakan palet warna pastel yang cerah dan nyaman dipandang mata (Aksen utama: *Sky Blue* `#1FABE1`, *Teal* `#0E7DA7`, dan *Tersier Kuning* `#FFDB07`) yang mendukung transisi tema gelap dan terang instan (*Theme flash prevention*).
2. **Kinerja Sangat Ringan (*Lightweight Performance*)**: Tanpa ketergantungan framework CSS gemuk (seperti Tailwind/Bootstrap) atau library animasi berat (seperti Lottie/GSAP). Seluruh aset di-minify secara aman dan ilustrasi SVG dianimasikan murni menggunakan **CSS Keyframes**.
3. **Komponen Interaktif Kustom (Murni Vanilla JS)**:
   - **Datatable Pegawai**: Mampu menyajikan **500 baris data dummy** berkecepatan tinggi dengan fitur pencarian instan, pengurutan kolom (*sorting*), serta pagination interaktif.
   - **Select2 Kustom**: Kolom dropdown dengan pencarian dinamis, navigasi penuh keyboard (`ArrowUp`/`ArrowDown`/`Enter`/`Escape`), dan validasi instan.
   - **Modal & Offcanvas Multi-Ukuran**: Mendukung transisi halus berkelas *glassmorphism* di berbagai ukuran mulai dari `sm` hingga `xxl` (full screen).
   - **Variasi Galeri Tabel**: Dilengkapi utilitas kelas `.table-striped`, `.table-bordered`, `.table-hover`, `.table-sm`, `.table-glass` (frosted-glass transparan mewah), serta 4 warna header (`thead`) yang modis.
4. **Halaman Status & Galeri Error Beranimasi**:
   - Halaman **Coming Soon** dengan countdown timer dinamis & form email haptic feedback.
   - Halaman **Maintenance** dengan gerigi mekanis berputar & simulasi integrasi API checker status.
   - Halaman **Error 404, 500, dan 503** dengan visual astronot melayang, server glitching, awan terputus, dan auto-retry redirect.
5. **Ramah Pengembang (Plug-and-Play)**: Seluruh file status/error dikemas secara mandiri (*self-contained*) agar sangat mudah disalin langsung ke berkas view backend.

---

## 📁 Struktur Folder Proyek (Organisasi Aset)

Proyek ini telah distandardisasi dengan penataan folder modular demi kemudahan integrasi lintas proyek:

```text
c:\laragon\www\template\
├── assets/                  # Folder Aset Proyek Terpusat
│   ├── css/
│   │   ├── style.css        # Source CSS Utama (Development)
│   │   └── style.min.css    # CSS Terkompresi (Production - Fallback)
│   ├── js/
│   │   ├── app.js           # Source Logic JS Utama (Development)
│   │   └── app.min.js       # JS Terkompresi (Production - Fallback)
│   └── minify.ps1           # Script Pembantu Minifikasi Aset (PowerShell)
├── coming-soon.html         # Halaman Coming Soon (Countdown & Newsletter)
├── dashboard.html           # Halaman Dashboard Overview (KPI Cards, Masonry, Charts)
├── datatable.html           # Halaman Datatable Pegawai (500 baris data)
├── form.html                # Halaman Formulir Interaktif (Custom Select2)
├── components-preview.html  # Halaman Galeri Komponen (Alerts, Badges, Buttons, Cards)
├── modal-preview.html       # Halaman Modal & Offcanvas (sm hingga xxl)
├── table-preview.html       # Halaman Galeri Variasi Tabel Premium
├── login.html               # Halaman Masuk (Login Screen)
├── index.html               # Gerip Utama / Landing Page & Call to Action (CTA)
├── error-404.html           # Halaman Error 404 (Not Found)
├── error-500.html           # Halaman Error 500 (Internal Server Error)
├── error-503.html           # Halaman Error 503 (Service Unavailable)
├── perencanaan.md           # Laporan Perencanaan Restrukturisasi & Laravel
└── README.md                # Laporan Dokumentasi Utama (File Ini)
```

---

## 🛠️ Panduan Penggunaan & Penerapan

### A. Penggunaan Cepat Statis (Plug-and-Play)
Cukup buka berkas [index.html](index.html) atau halaman demo lainnya secara langsung pada browser Anda. Semua tautan aset HTML telah disinkronisasikan secara dinamis membaca file terkompresi dari direktori `/assets/`:

```html
<!-- Memuat CSS Terkompresi Premium -->
<link rel="stylesheet" href="assets/css/style.min.css">

<!-- Memuat Logika Interaksi Ringan -->
<script src="assets/js/app.min.js"></script>
```

### B. Minifikasi Ulang Aset (Development Utility)
Bila Anda melakukan modifikasi kode pada `assets/css/style.css` atau `assets/js/app.js` dan ingin memperbarui berkas kompresi `.min` statisnya, jalankan build script pembantu di terminal PowerShell Anda:

```powershell
powershell -ExecutionPolicy Bypass -File assets/minify.ps1
```

---

## 🚀 Panduan Integrasi Cepat Laravel (Vite & Blade)

Untuk mengimplementasikan VibeTemplate ke dalam proyek **Laravel 10 / 11** Anda dengan compiler **Vite**:

### 1. Salin Aset Sumber
- Pindahkan berkas `assets/css/style.css` ke direktori `resources/css/style.css` di Laravel.
- Pindahkan berkas `assets/js/app.js` ke direktori `resources/js/app.js` di Laravel.

### 2. Konfigurasi Vite (`vite.config.js`)
Daftarkan file CSS dan JS agar Vite melakukan kompilasi otomatis:
```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/style.css',
                'resources/js/app.js'
            ],
            refresh: true,
        }),
    ],
});
```

### 3. Setup Layout Blade (`resources/views/layouts/app.blade.php`)
Panggil aset tersebut di dalam tag `<head>` dan sebelum penutup `</body>` menggunakan directive `@vite`:
```html
<head>
    <!-- Vite CSS -->
    @vite(['resources/css/style.css'])
</head>
<body>
    <div class="app-container">
        @include('partials.sidebar')
        <main class="main-content">
            @include('partials.header')
            <section class="content-body">
                @yield('content')
            </section>
        </main>
    </div>

    <!-- Vite JS -->
    @vite(['resources/js/app.js'])
</body>
```

---

## 🎨 Kustomisasi Warna Tema Instan

Kustomisasikan seluruh warna dashboard instan dalam satu klik dengan mengganti nilai CSS Variables di baris paling atas berkas `:root` (`style.css`):

```css
:root {
    --accent: #1FABE1;          /* Warna Primer Baru */
    --accent-hover: #0E7DA7;    /* Warna Sekunder Baru */
    --tertiary: #FFDB07;        /* Warna Tersier Baru */
}
```
Semua tombol, card glow shadow, chart line, badge status, scrollbar, focus input border, serta ornamen visual beranimasi akan langsung melaraskan skema warnanya secara real-time dan harmonis!

---
*Dibuat dengan dedikasi tinggi oleh **Nosinggih** bersama dengan kolaborasi cerdas **Antigravity AI Agent**.*
