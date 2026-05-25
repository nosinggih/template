/* ==========================================================================
   BLUEPRINT ARSITEKTUR DASHBOARD TEMPLATE (VIBE CODING)
   Core Client-Side Interactivity (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Inisialisasi Tema (Dark/Light Mode)
    initTheme();

    // 1. Inisialisasi Kontrol Sidebar Mobile
    initSidebarMobile();

    // 2. Inisialisasi Lucide Icons (jika CDN tersedia)
    initLucideIcons();

    // 3. Demo Form Validasi
    initDemoFormValidation();

    // 4. Inisialisasi Dropdowns
    initDropdowns();

    // 5. Inisialisasi Datatable Interaktif
    initInteractiveDatatable();
});

/**
 * Mengontrol logika buka/tutup sidebar pada resolusi layar mobile
 */
function initSidebarMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    let overlay = document.querySelector('.sidebar-overlay');

    // Jika komponen sidebar tidak ditemukan, hentikan proses
    if (!sidebar || !menuToggle) return;

    // Buat overlay secara dinamis jika belum ada di DOM
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    // Fungsi membuka sidebar
    const openSidebar = () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Kunci scroll layar utama
    };

    // Fungsi menutup sidebar
    const closeSidebar = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Aktifkan kembali scroll
    };

    // Event listener untuk tombol hamburger
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Event listener menutup saat overlay luar diklik
    overlay.addEventListener('click', closeSidebar);

    // Event listener menutup saat layar di-resize ke ukuran desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
}

/**
 * Memicu penggambaran ulang ikon Lucide jika dimuat melalui CDN
 */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Memberikan efek interaktif validasi sederhana pada form di halaman preview
 */
function initDemoFormValidation() {
    const demoForms = document.querySelectorAll('.demo-validate-form');
    
    demoForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let hasError = false;
            
            // Cari input wajib di dalam form
            const requiredInputs = form.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                const group = input.closest('.form-group');
                if (!group) return;
                
                if (!input.value.trim()) {
                    group.classList.add('has-error');
                    hasError = true;
                } else {
                    group.classList.remove('has-error');
                }
            });

            if (!hasError) {
                // Tampilkan notifikasi sukses sementara jika ada wadah alert
                const alertSuccess = form.querySelector('.alert-success-demo');
                if (alertSuccess) {
                    alertSuccess.style.display = 'flex';
                    form.reset();
                    setTimeout(() => {
                        alertSuccess.style.display = 'none';
                    }, 4000);
                } else {
                    alert('Form berhasil disubmit!');
                    form.reset();
                }
            }
        });

        // Hapus kelas error ketika user mulai mengetik
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group && group.classList.contains('has-error')) {
                    group.classList.remove('has-error');
                }
            });
        });
    });
}

/**
 * Mengontrol logika pertukaran tema Dark/Light Mode dan persisten di LocalStorage
 */
function initTheme() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const savedTheme = localStorage.getItem('vibe-theme') || 'light';

    // Cek preferensi awal
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }

    // Perbarui ikon semua tombol tema di halaman
    themeToggles.forEach(toggle => {
        const isDark = document.documentElement.classList.contains('dark-mode');
        updateThemeIcon(toggle, isDark);

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            document.documentElement.classList.toggle('dark-mode');
            const nowDark = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('vibe-theme', nowDark ? 'dark' : 'light');
            
            // Perbarui semua toggle tema yang ada
            themeToggles.forEach(btn => updateThemeIcon(btn, nowDark));
        });
    });
}

function updateThemeIcon(btn, isDark) {
    btn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Mengontrol pembukaan & penutupan dropdown notifikasi dan user profile
 */
function initDropdowns() {
    const dropdownContainers = document.querySelectorAll('.dropdown-container');

    dropdownContainers.forEach(container => {
        const trigger = container.querySelector('.user-profile, .notification-bell');
        const menu = container.querySelector('.dropdown-menu');

        if (!trigger || !menu) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Tutup semua dropdown lain terlebih dahulu
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('show');
                }
            });

            menu.classList.toggle('show');
        });
    });

    // Menutup dropdown ketika klik di mana saja di luar area kontainer dropdown
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

/**
 * Logika filter pencarian dinamis untuk komponen visual Datatable
 */
function initInteractiveDatatable() {
    const dtSearchInput = document.getElementById('dt-search');
    const dtTable = document.getElementById('dt-preview-table');
    const dtInfo = document.getElementById('dt-info-text');
    const dtLengthSelect = document.getElementById('dt-length-select');

    if (!dtSearchInput || !dtTable) return;

    const rows = dtTable.querySelectorAll('tbody tr');
    const totalEntries = rows.length;

    const filterTable = () => {
        const query = dtSearchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let match = false;

            cells.forEach(cell => {
                if (cell.textContent.toLowerCase().includes(query)) {
                    match = true;
                }
            });

            if (match) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Update info teks dinamis
        if (dtInfo) {
            if (query) {
                dtInfo.textContent = `Menampilkan ${visibleCount} dari ${totalEntries} baris yang cocok`;
            } else {
                const limit = dtLengthSelect ? dtLengthSelect.value : totalEntries;
                dtInfo.textContent = `Menampilkan 1 sampai ${Math.min(limit, totalEntries)} dari ${totalEntries} entri`;
            }
        }
    };

    // Event listener untuk mengetik pencarian
    dtSearchInput.addEventListener('input', filterTable);

    // Event listener untuk penggantian limit entri (simulasi)
    if (dtLengthSelect) {
        dtLengthSelect.addEventListener('change', () => {
            const limit = parseInt(dtLengthSelect.value);
            let shown = 0;
            
            rows.forEach((row, idx) => {
                if (idx < limit) {
                    row.style.style = ''; // Reset display
                    shown++;
                } else {
                    // Hanya sembunyikan jika tidak sedang ada filter pencarian
                    if (!dtSearchInput.value) {
                        row.style.display = 'none';
                    }
                }
            });

            if (!dtSearchInput.value && dtInfo) {
                dtInfo.textContent = `Menampilkan 1 sampai ${shown} dari ${totalEntries} entri`;
            }
        });
    }
}
