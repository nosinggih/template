# Blueprint Arsitektur Dashboard Template (Vibe Coding)

Dokumen ini berisi spesifikasi arsitektur tingkat dasar untuk membangun template dashboard HTML & CSS yang bersih, modular, dan dioptimalkan khusus untuk kolaborasi bersama AI Agent (seperti Antigravity, Cursor) atau Junior Programmer. Struktur instruksi sengaja dibuat menggunakan batasan yang jelas agar mudah dipahami tanpa memerlukan keahlian mendalam.

**Filosofi Desain:** 
- Menghindari kerumitan kode (anti-bloatware)
- Mengutamakan struktur tag HTML yang sesuai fungsinya (semantik)
- Memusatkan pengaturan tampilan (warna, ukuran, dll) pada satu tempat agar AI dapat melakukan perubahan tanpa merusak susunan utama.

---

## 1. Konfigurasi Visual & Tema Utama

Seluruh warna, jarak (spacing), dan animasi wajib dikendalikan melalui variabel global di dalam berkas CSS utama. Ini memudahkan AI Agent atau programmer pemula untuk mengubah tema hanya dengan membaca satu area konfigurasi.

**Palet Warna (Dark Mode Sinematik)**
- **Latar Belakang Utama:** Gelap pekat berbasis Obsidian/Slate Core untuk kenyamanan mata.
- **Latar Belakang Panel/Kartu:** Satu tingkat lebih terang dari latar belakang utama untuk memberikan kesan ruang (kedalaman).
- **Warna Aksen Utama:** Warna solid yang mencolok (seperti Emerald Green atau Sky Blue) untuk elemen interaktif seperti tombol dan penanda.

**Variabel Kontrol Utama (Tulis ini di file CSS, di bagian `:root`)**
```css
:root {
    --bg-main: #0b0f19;
    --bg-panel: #111827;
    --border-color: #1e293b;
    --text-main: #cbd5e1;
    --text-muted: #64748b;
    --accent: #38bdf8;
    --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 2. Tata Letak Global (Struktur HTML)

Gunakan tata letak standar yang konsisten. Hindari penggunaan tag HTML bersarang (berada di dalam tag lain) yang terlalu banyak agar AI Agent tidak bingung atau salah menutup tag.

**Panduan Elemen HTML dan Fungsinya:**
- `<aside class="sidebar">`: Menu navigasi utama di sisi kiri. Posisinya tetap (fixed) di layar besar dan bisa disembunyikan pada layar HP.
- `<main class="main-content">`: Wadah besar di sisi kanan yang menampung seluruh isi halaman.
- `<header class="top-header">`: Baris atas di dalam area konten utama untuk menampilkan profil pengguna dan tombol menu HP.
- `<section class="content-body">`: **Zona Eksekusi AI**. Area bebas di mana AI Agent atau programmer bisa memasukkan form, tabel, atau grafik tanpa takut merusak menu navigasi luar.

---

## 3. Galeri Komponen Contoh (Panduan Referensi AI)

Buat satu berkas HTML contoh bernama `components-preview.html`. Berkas ini berfungsi sebagai panduan atau contoh. Ketika membuat fitur baru, Anda cukup memberikan perintah: *"Tiru komponen X yang ada di berkas referensi."*

**A. Form Input**
Setiap input form harus dibungkus dalam satu wadah yang rapi, lengkap dengan label, kotak teks, dan tempat untuk pesan error.
```html
<div class="form-group">
    <label class="form-label">Nama Lengkap</label>
    <input type="text" class="form-control" placeholder="Masukkan nama...">
    <span class="error-message">Pesan kesalahan validasi di sini</span>
</div>
```

**B. Tabel Data (Tabel di dalam Kartu)**
Tabel harus dibungkus di dalam wadah kartu dengan fitur responsif (bisa digeser ke samping) agar tata letak tidak rusak saat kolom tabel terlalu banyak.

---

## 4. Lembar Aturan Kerja (Workflow Protocol)

Gunakan aturan sederhana ini sebagai panduan utama saat memberikan tugas baru kepada pelaksana (AI / Junior Programmer):

1. **Fase Perencanaan:** Pelaksana wajib membaca dokumen arsitektur ini dan berkas `components-preview.html` sebelum menulis kode apa pun.
2. **Aturan Kelas CSS:** Dilarang membuat kelas CSS baru jika tampilannya sudah bisa menggunakan variabel global di berkas CSS utama.
3. **Batas Wilayah Kerja:** Modifikasi atau pembuatan halaman baru hanya boleh dilakukan di dalam tag `<section class="content-body">`.
4. **Prosedur Pengecekan:** Sebelum kode disimpan secara permanen, pastikan tampilan sudah dicoba di ukuran layar HP dan tidak ada elemen yang keluar dari batas layar (overflow).
