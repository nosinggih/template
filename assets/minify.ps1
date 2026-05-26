# assets/minify.ps1 - Minifikasi Aset Proyek (style.css & app.js)

# 1. Salin file asli ke folder target
Copy-Item -Path "style.css" -Destination "assets/css/style.css" -Force
Copy-Item -Path "app.js" -Destination "assets/js/app.js" -Force

Write-Host "Menyalin berkas asli ke folder assets..." -ForegroundColor Green

# 2. Minifikasi CSS
$css = Get-Content -Path "style.css" -Raw
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

Write-Host "Minifikasi style.css -> style.min.css SELESAI." -ForegroundColor Green

# 3. Minifikasi JS
$js = Get-Content -Path "app.js" -Raw
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

Write-Host "Minifikasi app.js -> app.min.js SELESAI." -ForegroundColor Green
