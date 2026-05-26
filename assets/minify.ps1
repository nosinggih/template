# assets/minify.ps1 - Minifikasi Aset Proyek (style.css & app.js)

Write-Host "Membaca berkas asli dari folder assets..." -ForegroundColor Green

# 1. Minifikasi CSS
$css = Get-Content -Path "assets/css/style.css" -Raw
# Hapus semua komentar block /* ... */
$css = $css -replace '(?s)/\*.*?\*/', ''
# Hapus spasi di sekitar kurung dan titik koma
$css = $css -replace '\s*([\{\};:,])\s*', '$1'
# Hapus baris baru dan tab
$css = $css -replace '[\r\n\t]+', ''
# Bersihkan spasi ganda
$css = $css -replace '\s+', ' '
# Tulis hasil
Set-Content -Path "assets/css/style.min.css" -Value $css.Trim()

Write-Host "Minifikasi assets/css/style.css -> style.min.css SELESAI." -ForegroundColor Green

# 2. Minifikasi JS
$js = Get-Content -Path "assets/js/app.js" -Raw
# Hapus komentar block /* ... */
$js = $js -replace '(?s)/\*.*?\*/', ''
# Hapus komentar baris tunggal yang berada di awal baris (tidak merusak URL http:// atau https://)
$js = $js -replace '(?m)^\s*//.*$', ''
# Hapus tab dan spasi berlebih
$js = $js -replace '\t+', ''
$js = $js -replace ' +', ' '
# Simpan baris baru demi keamanan sintaksis tanpa compiler, namun hapus baris-baris kosong ganda
$js = $js -replace '(\r?\n)+', "`r`n"
# Tulis hasil
Set-Content -Path "assets/js/app.min.js" -Value $js.Trim()

Write-Host "Minifikasi assets/js/app.js -> app.min.js SELESAI." -ForegroundColor Green
