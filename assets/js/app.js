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

    // 6. Inisialisasi Demo Interaktif Landing Page
    initLandingPageDemo();

    // 7. Inisialisasi Fitur Baru (Select2, Datatable Pegawai, & Demo Loading)
    initNewFeatures();
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

/**
 * Inisialisasi Demo Interaktif di Landing Page
 */
function initLandingPageDemo() {
    const tabButtons = document.querySelectorAll('.demo-tab-btn');
    const colorPickerBox = document.getElementById('demo-color-picker-box');
    const metricsTrigger = document.getElementById('demo-metrics-trigger');
    const sandboxCard = document.getElementById('interactive-sandbox-card');
    const sandboxBadge = document.getElementById('sandbox-badge');
    const cardTitle = document.getElementById('sandbox-card-title');
    const cardDesc = document.getElementById('sandbox-card-desc');
    const dynamicContent = document.getElementById('sandbox-dynamic-content');

    // Jika bukan halaman landing page, hentikan inisialisasi
    if (tabButtons.length === 0 || !sandboxCard) return;

    // Data Konten untuk masing-masing Tab
    const tabContents = {
        color: {
            badge: 'Demo Kustomisasi',
            title: 'Antarmuka Kustom Instan',
            desc: 'Gunakan tombol pemilihan warna di bawah menu pemilihan untuk mengganti variabel warna aksen secara dinamis dalam satu klik!',
            content: `
                <div class="sandbox-value" id="sandbox-stat-value">65%</div>
                <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Kemajuan Setup Tema</span>
                <div class="sandbox-bar-container">
                    <div class="sandbox-bar" id="sandbox-progress-bar" style="width: 65%;"></div>
                </div>
            `
        },
        metrics: {
            badge: 'Demo Metrik Statistik',
            title: 'Visualisasi Data Dinamis',
            desc: 'Klik tombol "Perbarui Nilai Data" di sebelah kiri untuk melihat nilai dan grafik berkembang dengan efek transisi yang menyenangkan.',
            content: `
                <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:0.5rem; height:80px; margin-top:1.5rem;">
                    <div class="metrics-bar" style="flex:1; height: 35%; background:var(--accent-glow); border:1px solid var(--accent); border-radius:4px; transition: height 0.4s ease;"></div>
                    <div class="metrics-bar" style="flex:1; height: 60%; background:var(--accent-glow); border:1px solid var(--accent); border-radius:4px; transition: height 0.4s ease;"></div>
                    <div class="metrics-bar" style="flex:1; height: 45%; background:var(--accent-glow); border:1px solid var(--accent); border-radius:4px; transition: height 0.4s ease;"></div>
                    <div class="metrics-bar" style="flex:1; height: 80%; background:linear-gradient(180deg, var(--accent) 0%, var(--accent-hover) 100%); border-radius:4px; transition: height 0.4s ease; box-shadow: var(--shadow-glow);"></div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:0.5rem; font-size:0.75rem; color:var(--text-muted); font-weight:600;">
                    <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span>
                </div>
            `
        },
        ai: {
            badge: 'Simulasi AI Vibe Coder',
            title: 'Asisten AI Agent',
            desc: 'Simulasi bagaimana AI Coding Agent (seperti Antigravity) menulis kode dan merancang antarmuka Anda secara cerdas.',
            content: `
                <div style="background:#0b0f19; padding:1rem; border-radius:var(--border-radius-sm); border:1px solid var(--border-color); font-family:monospace; font-size:0.75rem; color:#1FABE1; line-height:1.5; min-height:85px; margin-top:1rem;">
                    <div style="color:var(--text-muted);">&gt; vibe-agent --optimize --theme</div>
                    <div id="ai-simulation-text" style="color:#ffffff;">Mengoptimalkan struktur HTML...</div>
                    <div style="color:#FFDB07; font-weight:bold;">[SUKSES] Render selesai dalam 0.14s.</div>
                </div>
            `
        }
    };

    // Fungsi ganti tab
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hapus status aktif tab sebelumnya
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.getAttribute('data-tab');
            const data = tabContents[tab];

            // Terapkan data konten
            sandboxBadge.textContent = data.badge;
            cardTitle.textContent = data.title;
            cardDesc.textContent = data.desc;
            dynamicContent.innerHTML = data.content;

            // Atur keterlihatan opsi kustomisasi warna / metrik
            if (tab === 'color') {
                colorPickerBox.style.display = 'block';
                metricsTrigger.style.display = 'none';
            } else if (tab === 'metrics') {
                colorPickerBox.style.display = 'none';
                metricsTrigger.style.display = 'block';
                initMetricsDemo(); // re-init event listener
            } else {
                colorPickerBox.style.display = 'none';
                metricsTrigger.style.display = 'none';
                startAiSimulation(); // start terminal simulation
            }

            // Re-render icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    // Inisialisasi fungsionalitas Kustomisasi Warna
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const selectedColor = dot.getAttribute('data-color');
            
            // Set CSS variabel di root
            document.documentElement.style.setProperty('--accent', selectedColor);
            
            if (selectedColor === '#1FABE1') {
                document.documentElement.style.setProperty('--accent-hover', '#0E7DA7');
                document.documentElement.style.setProperty('--accent-glow', 'rgba(31, 171, 225, 0.08)');
            } else if (selectedColor === '#0E7DA7') {
                document.documentElement.style.setProperty('--accent-hover', '#0a5d7c');
                document.documentElement.style.setProperty('--accent-glow', 'rgba(14, 125, 167, 0.08)');
            } else if (selectedColor === '#FFDB07') {
                document.documentElement.style.setProperty('--accent-hover', '#e6c200');
                document.documentElement.style.setProperty('--accent-glow', 'rgba(255, 219, 7, 0.15)');
            }

            // Sync progress bar
            const progressBar = document.getElementById('sandbox-progress-bar');
            if (progressBar) {
                progressBar.style.background = selectedColor;
            }
        });
    });

    // Inisialisasi fungsionalitas Metrik Statistik
    function initMetricsDemo() {
        const btnUpdate = document.getElementById('btn-update-metrics');
        if (!btnUpdate) return;

        btnUpdate.addEventListener('click', () => {
            const bars = document.querySelectorAll('.metrics-bar');
            bars.forEach(bar => {
                const randomHeight = Math.floor(Math.random() * 80) + 15; // 15% - 95%
                bar.style.height = `${randomHeight}%`;
            });
        });
    }

    // Inisialisasi Terminal AI simulation
    let aiInterval = null;
    function startAiSimulation() {
        if (aiInterval) clearInterval(aiInterval);
        const textEl = document.getElementById('ai-simulation-text');
        if (!textEl) return;

        const messages = [
            'Mengoptimalkan struktur HTML...',
            'Mengharmonisasikan palet warna pastel...',
            'Membangun responsivitas UI mobile...',
            'Menghubungkan asisten Vibe Engine...',
            'Berhasil menyelaraskan visual dashboard!'
        ];

        let index = 0;
        textEl.textContent = messages[index];
        
        aiInterval = setInterval(() => {
            index = (index + 1) % messages.length;
            textEl.textContent = messages[index];
        }, 1800);
    }
}

/**
 * Inisialisasi Fitur Baru: Datatable Pegawai, Select2 Kustom, dan Global Loading Bar
 */
function initNewFeatures() {
    // 1. Jalankan inisialisasi Global Loading Bar
    initGlobalLoadingTrigger();

    // 2. Jalankan inisialisasi Select2 Kustom (jika elemen tersedia di halaman)
    initCustomSelect2();

    // 3. Jalankan inisialisasi Datatable Pegawai 500 Baris (jika elemen tersedia di halaman)
    initEmployeeDatatable();
}

/**
 * Pemicu Simulasi Global Loading Bar dinamis
 */
function initGlobalLoadingTrigger() {
    const btnDemoDatatable = document.getElementById('btn-demo-loading');
    const btnDemoForm = document.getElementById('btn-form-loading');

    const handleDemoLoading = () => {
        // Simulasikan pemuatan selama 1.5 detik
        triggerGlobalLoading(1500, () => {
            // Callback setelah loading selesai
            if (btnDemoDatatable) {
                // Segarkan datatable secara acak/ulang jika di halaman datatable
                if (typeof refreshDatatableData === 'function') {
                    refreshDatatableData();
                }
            }
        });
    };

    if (btnDemoDatatable) {
        btnDemoDatatable.addEventListener('click', handleDemoLoading);
        // Jalankan loading bar secara otomatis saat halaman datatable dibuka pertama kali
        setTimeout(() => {
            triggerGlobalLoading(1200);
        }, 100);
    }

    if (btnDemoForm) {
        btnDemoForm.addEventListener('click', () => {
            triggerGlobalLoading(1500);
        });
        // Jalankan loading bar otomatis di form page
        setTimeout(() => {
            triggerGlobalLoading(1000);
        }, 100);
    }
}

/**
 * Menampilkan Global Loading Bar di bawah header dan menghapusnya seutuhnya dari DOM saat selesai.
 * @param {number} duration - Durasi loading dalam milidetik (misal 1500)
 * @param {function} callback - Fungsi callback setelah loading selesai
 */
function triggerGlobalLoading(duration = 1500, callback = null) {
    const header = document.querySelector('.top-header');
    if (!header) return;

    // Pastikan tidak ada loading bar ganda
    let loadingBar = document.querySelector('.global-loading-bar');
    if (loadingBar) {
        loadingBar.remove();
    }

    // 1. Buat elemen DOM Loading Bar secara dinamis
    loadingBar = document.createElement('div');
    loadingBar.className = 'global-loading-bar';
    
    const progress = document.createElement('div');
    progress.className = 'loading-progress';
    loadingBar.appendChild(progress);

    // Sisipkan loading bar tepat setelah top-header
    header.parentNode.insertBefore(loadingBar, header.nextSibling);

    // 2. Animasikan kemunculan (fade in) & progress
    setTimeout(() => {
        loadingBar.classList.add('active');
        progress.style.width = '30%'; // loncat pertama
    }, 10);

    setTimeout(() => {
        progress.style.width = '70%'; // loncat kedua
    }, duration * 0.4);

    setTimeout(() => {
        progress.style.width = '100%'; // penuh
    }, duration - 250);

    // 3. Efek memudar dan penghapusan total dari DOM
    setTimeout(() => {
        loadingBar.classList.remove('active');
        setTimeout(() => {
            loadingBar.remove(); // Hapus seutuhnya dari DOM
            if (typeof callback === 'function') callback();
        }, 300); // Tunggu transisi memudar CSS selesai (0.3s)
    }, duration);
}

/**
 * Komponen Dropdown Select2 Kustom menggunakan Vanilla JS & CSS
 */
function initCustomSelect2() {
    const container = document.getElementById('select-country-container');
    const trigger = document.getElementById('select-country-trigger');
    const dropdown = document.getElementById('select-country-dropdown');
    const searchInput = dropdown ? dropdown.querySelector('.vibe-select-search') : null;
    const optionsList = document.getElementById('select-country-options');
    const valueText = trigger ? trigger.querySelector('.vibe-select-value-text') : null;
    const hiddenInput = document.getElementById('country-hidden-input');

    if (!container || !trigger || !dropdown || !optionsList) return;

    // Dummy Daftar Negara (20+ Opsi)
    const countries = [
        { code: 'ID', name: 'Indonesia' },
        { code: 'MY', name: 'Malaysia' },
        { code: 'SG', name: 'Singapore' },
        { code: 'TH', name: 'Thailand' },
        { code: 'VN', name: 'Vietnam' },
        { code: 'PH', name: 'Philippines' },
        { code: 'JP', name: 'Japan' },
        { code: 'KR', name: 'South Korea' },
        { code: 'CN', name: 'China' },
        { code: 'AU', name: 'Australia' },
        { code: 'IN', name: 'India' },
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
        { code: 'NL', name: 'Netherlands' },
        { code: 'CA', name: 'Canada' },
        { code: 'BR', name: 'Brazil' },
        { code: 'ZA', name: 'South Africa' },
        { code: 'SA', name: 'Saudi Arabia' },
        { code: 'AE', name: 'United Arab Emirates' }
    ];

    let highlightedIndex = -1;
    let filteredCountries = [...countries];

    // Fungsi Render Opsi
    const renderOptions = () => {
        optionsList.innerHTML = '';
        if (filteredCountries.length === 0) {
            optionsList.innerHTML = `<li class="vibe-select-no-results">Tidak ada hasil cocok</li>`;
            return;
        }

        filteredCountries.forEach((country, index) => {
            const li = document.createElement('li');
            li.className = 'vibe-select-option';
            li.setAttribute('data-value', country.code);
            li.innerHTML = `
                <span>${country.name}</span>
                <span class="vibe-select-option-meta" style="color:var(--text-muted); font-size:0.75rem;">${country.code}</span>
            `;

            // Tandai jika terpilih
            if (hiddenInput && hiddenInput.value === country.code) {
                li.classList.add('selected');
            }

            // Tandai jika disorot keyboard
            if (index === highlightedIndex) {
                li.classList.add('highlighted');
            }

            // Event Klik Opsi
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                selectOption(country);
            });

            optionsList.appendChild(li);
        });
    };

    // Fungsi Pilih Opsi
    const selectOption = (country) => {
        if (valueText) {
            valueText.textContent = country.name;
            valueText.style.color = 'var(--text-heading)';
            valueText.style.fontWeight = '600';
        }
        if (hiddenInput) {
            hiddenInput.value = country.code;
            // trigger input event for live validations
            hiddenInput.dispatchEvent(new Event('input'));
        }
        
        // Hapus kelas error jika ada
        const formGroup = container.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('has-error');
        }

        closeDropdown();
    };

    // Fungsi Buka Dropdown
    const openDropdown = () => {
        container.classList.add('open');
        highlightedIndex = -1;
        renderOptions();
        
        // Fokuskan input pencarian
        if (searchInput) {
            setTimeout(() => {
                searchInput.value = '';
                searchInput.focus();
                filterOptions('');
            }, 50);
        }
    };

    // Fungsi Tutup Dropdown
    const closeDropdown = () => {
        container.classList.remove('open');
        if (searchInput) searchInput.blur();
    };

    // Filter Pencarian
    const filterOptions = (query) => {
        const cleanedQuery = query.toLowerCase().trim();
        filteredCountries = countries.filter(c => 
            c.name.toLowerCase().includes(cleanedQuery) || 
            c.code.toLowerCase().includes(cleanedQuery)
        );
        highlightedIndex = -1;
        renderOptions();
    };

    // Event Listeners
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (container.classList.contains('open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterOptions(e.target.value);
        });

        // Navigasi Keyboard
        searchInput.addEventListener('keydown', (e) => {
            const options = optionsList.querySelectorAll('.vibe-select-option');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (options.length === 0) return;
                highlightedIndex = (highlightedIndex + 1) % filteredCountries.length;
                renderOptions();
                scrollToHighlighted();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (options.length === 0) return;
                highlightedIndex = (highlightedIndex - 1 + filteredCountries.length) % filteredCountries.length;
                renderOptions();
                scrollToHighlighted();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
                    selectOption(filteredCountries[highlightedIndex]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown();
            }
        });
    }

    // Scroll otomatis opsi keyboard
    const scrollToHighlighted = () => {
        const activeOption = optionsList.querySelector('.vibe-select-option.highlighted');
        if (activeOption) {
            optionsList.scrollTop = activeOption.offsetTop - (optionsList.clientHeight / 2);
        }
    };

    // Klik di luar dropdown untuk menutup
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            closeDropdown();
        }
    });

    // Reset Form Listener
    const form = container.closest('form');
    if (form) {
        form.addEventListener('reset', () => {
            setTimeout(() => {
                if (valueText) {
                    valueText.textContent = 'Cari & pilih negara...';
                    valueText.style.color = 'var(--text-muted)';
                    valueText.style.fontWeight = '500';
                }
                if (hiddenInput) hiddenInput.value = '';
                closeDropdown();
            }, 10);
        });
    }
}

let employeeData = []; // Shared data state in memory

/**
 * Logika dan manajemen data Datatable Pegawai 500 Baris
 */
function initEmployeeDatatable() {
    const tableBody = document.getElementById('employee-tbody');
    if (!tableBody) return; // Exit if not on the page

    // 1. Bangun 500 Baris Data Tiruan Secara Terprogram (jika belum pernah dijana)
    if (employeeData.length === 0) {
        // Cek LocalStorage terlebih dahulu agar persistensi data terjamin
        const localData = localStorage.getItem('vibe-employee-data');
        if (localData) {
            employeeData = JSON.parse(localData);
        } else {
            employeeData = generate500Employees();
            localStorage.setItem('vibe-employee-data', JSON.stringify(employeeData));
        }
    }

    // State Datatable
    let state = {
        currentPage: 1,
        pageSize: 25,
        searchQuery: '',
        sortBy: 'name',
        sortDirection: 'asc' // asc or desc
    };

    // Element Controls
    const searchInput = document.getElementById('dt-search');
    const pageSizeSelect = document.getElementById('dt-pageSize');
    const paginationContainer = document.getElementById('dt-pagination');
    const infoText = document.getElementById('dt-info');
    const headers = document.querySelectorAll('#employee-table th.sortable');

    // 2. Fungsi Filter, Sort, dan Render
    const renderTable = () => {
        // 2.1. Filter Pencarian kata kunci
        let filtered = employeeData.filter(emp => {
            const query = state.searchQuery.toLowerCase().trim();
            if (!query) return true;
            return emp.name.toLowerCase().includes(query) ||
                   emp.email.toLowerCase().includes(query) ||
                   emp.phone.toLowerCase().includes(query) ||
                   emp.address.toLowerCase().includes(query);
        });

        // 2.2. Pengurutan Data (Sorting)
        filtered.sort((a, b) => {
            let valA = a[state.sortBy].toLowerCase();
            let valB = b[state.sortBy].toLowerCase();
            
            if (valA < valB) return state.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return state.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // 2.3. Pagination Logic
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / state.pageSize) || 1;

        // Cegah halaman aktif melebihi total halaman setelah filter
        if (state.currentPage > totalPages) {
            state.currentPage = totalPages;
        }

        const startIndex = (state.currentPage - 1) * state.pageSize;
        const endIndex = Math.min(startIndex + state.pageSize, totalItems);
        const paginatedItems = filtered.slice(startIndex, endIndex);

        // 2.4. Render Rows to DOM
        tableBody.innerHTML = '';
        if (paginatedItems.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">Tidak ada pegawai yang cocok dengan kriteria pencarian</td></tr>`;
            infoText.textContent = `Menampilkan 0 sampai 0 dari 0 entri`;
            paginationContainer.innerHTML = '';
            return;
        }

        paginatedItems.forEach(emp => {
            const tr = document.createElement('tr');
            tr.id = `emp-row-${emp.id}`;
            tr.innerHTML = `
                <td style="font-weight: 600; color: var(--text-heading);">${emp.name}</td>
                <td>${emp.email}</td>
                <td>${emp.phone}</td>
                <td style="font-size:0.85rem; color:var(--text-muted); max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${emp.address}">${emp.address}</td>
                <td style="text-align: center;">
                    <div style="display:inline-flex; gap:0.35rem;">
                        <button class="btn btn-secondary btn-sm btn-view-emp" data-id="${emp.id}" style="padding: 0.25rem 0.45rem; border-radius:6px;" title="Lihat Detail">
                            <i data-lucide="eye" style="width:14px; height:14px; color:var(--info);"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm btn-edit-emp" data-id="${emp.id}" style="padding: 0.25rem 0.45rem; border-radius:6px;" title="Edit Data">
                            <i data-lucide="pencil" style="width:14px; height:14px; color:var(--accent);"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm btn-delete-emp" data-id="${emp.id}" style="padding: 0.25rem 0.45rem; border-radius:6px;" title="Hapus Data">
                            <i data-lucide="trash-2" style="width:14px; height:14px; color:var(--danger);"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Update Info Footer
        infoText.textContent = `Menampilkan ${startIndex + 1} sampai ${endIndex} dari ${totalItems} entri` + (totalItems !== employeeData.length ? ` (disaring dari ${employeeData.length} total entri)` : '');

        // 2.5. Render Pagination Buttons
        renderPaginationControls(totalPages);

        // Bind Row Buttons Events
        bindRowActions();

        // Render Lucide Icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Render Paginations
    const renderPaginationControls = (totalPages) => {
        paginationContainer.innerHTML = '';

        // Tombol Previous
        const btnPrev = document.createElement('button');
        btnPrev.innerHTML = `<i data-lucide="chevron-left" style="width:14px; height:14px;"></i>`;
        btnPrev.disabled = state.currentPage === 1;
        btnPrev.addEventListener('click', () => {
            state.currentPage--;
            renderTable();
        });
        paginationContainer.appendChild(btnPrev);

        // Range halaman yang ditampilkan
        let startPage = Math.max(1, state.currentPage - 1);
        let endPage = Math.min(totalPages, startPage + 2);
        
        if (endPage - startPage < 2) {
            startPage = Math.max(1, endPage - 2);
        }

        // Halaman pertama jika terputus
        if (startPage > 1) {
            const btnFirst = document.createElement('button');
            btnFirst.textContent = '1';
            btnFirst.addEventListener('click', () => {
                state.currentPage = 1;
                renderTable();
            });
            paginationContainer.appendChild(btnFirst);

            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.style.alignSelf = 'center';
                dots.style.color = 'var(--text-muted)';
                dots.style.margin = '0 0.25rem';
                paginationContainer.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const btnPage = document.createElement('button');
            btnPage.textContent = i;
            if (i === state.currentPage) btnPage.className = 'active';
            btnPage.addEventListener('click', () => {
                state.currentPage = i;
                renderTable();
            });
            paginationContainer.appendChild(btnPage);
        }

        // Halaman terakhir jika terputus
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.style.alignSelf = 'center';
                dots.style.color = 'var(--text-muted)';
                dots.style.margin = '0 0.25rem';
                paginationContainer.appendChild(dots);
            }

            const btnLast = document.createElement('button');
            btnLast.textContent = totalPages;
            btnLast.addEventListener('click', () => {
                state.currentPage = totalPages;
                renderTable();
            });
            paginationContainer.appendChild(btnLast);
        }

        // Tombol Next
        const btnNext = document.createElement('button');
        btnNext.innerHTML = `<i data-lucide="chevron-right" style="width:14px; height:14px;"></i>`;
        btnNext.disabled = state.currentPage === totalPages;
        btnNext.addEventListener('click', () => {
            state.currentPage++;
            renderTable();
        });
        paginationContainer.appendChild(btnNext);
    };

    // Binding Actions on Buttons inside row
    const bindRowActions = () => {
        // View Action
        document.querySelectorAll('.btn-view-emp').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const emp = employeeData.find(e => e.id === id);
                if (emp) openViewModal(emp);
            });
        });

        // Edit Action
        document.querySelectorAll('.btn-edit-emp').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const emp = employeeData.find(e => e.id === id);
                if (emp) openEditModal(emp);
            });
        });

        // Delete Action
        document.querySelectorAll('.btn-delete-emp').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const emp = employeeData.find(e => e.id === id);
                if (emp) openDeleteModal(emp);
            });
        });
    };

    // Header click sorting
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const field = header.getAttribute('data-sort');
            
            // Hapus kelas asc/desc dari th lain
            headers.forEach(h => {
                if (h !== header) h.className = 'sortable';
            });

            if (state.sortBy === field) {
                state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortBy = field;
                state.sortDirection = 'asc';
            }

            header.className = `sortable ${state.sortDirection}`;
            renderTable();
        });
    });

    // Entries Page Size Select
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            state.pageSize = parseInt(e.target.value);
            state.currentPage = 1;
            renderTable();
        });
    }

    // Keyup search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            state.currentPage = 1;
            renderTable();
        });
    }

    // Global refresh data function linked to Simulasikan Load Data
    window.refreshDatatableData = () => {
        // Berikan transisi memudar tipis saat memuat data baru
        tableBody.style.opacity = '0.3';
        setTimeout(() => {
            state.currentPage = 1;
            renderTable();
            tableBody.style.opacity = '1';
        }, 300);
    };

    // First Render
    renderTable();
}

/**
 * Menghasilkan 500 Baris Dummy Data secara programmatis
 */
function generate500Employees() {
    const firstNames = ['Andi', 'Budi', 'Chandra', 'Deddy', 'Eko', 'Fajar', 'Gunawan', 'Hendra', 'Indra', 'Joko', 'Kurniawan', 'Lukman', 'Mulyono', 'Novi', 'Oki', 'Pranoto', 'Rian', 'Setyawan', 'Taufik', 'Utomo', 'Wawan', 'Yanto', 'Zainal', 'Adi', 'Bambang', 'Cahyono', 'Dwi', 'Edi', 'Farhan', 'Gilang', 'Heri', 'Irfan', 'Joni', 'Krisna', 'Latif', 'Mahmud', 'Nugroho', 'Oscar', 'Putra', 'Rendy', 'Slamet', 'Teguh', 'Umar', 'Wahyu', 'Yudi', 'Zul'];
    const lastNames = ['Wijaya', 'Santoso', 'Pratama', 'Hidayat', 'Kusuma', 'Saputra', 'Setiawan', 'Nugraha', 'Wibowo', 'Siregar', 'Lubis', 'Pane', 'Harahap', 'Ginting', 'Sembiring', 'Tarigan', 'Manurung', 'Simanjuntak', 'Sitorus', 'Tampubolon', 'Sinaga', 'Napitupulu', 'Pohan', 'Lumbantoruan', 'Marpaung', 'Marbun', 'Rajagukguk', 'Situmorang', 'Nainggolan', 'Nababan', 'Tanjung', 'Chaniago', 'Sani', 'Muda', 'Putri', 'Sari', 'Indah', 'Lestari', 'Utami', 'Dewi', 'Rahayu', 'Kartika', 'Fitri', 'Nur', 'Ayu'];
    
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'vibe.co.id', 'pegawai.net', 'telkom.co.id', 'bumn.go.id'];
    const cities = ['Jakarta Selatan', 'Bandung Kota', 'Surabaya Timur', 'Medan Baru', 'Semarang Indah', 'Yogyakarta Kota', 'Makassar Barat', 'Palembang Ulu', 'Denpasar Selatan', 'Balikpapan Baru', 'Malang Asri', 'Solo Kota', 'Bogor Raya', 'Tangerang Kota', 'Bekasi Barat'];
    const streets = ['Jl. Sudirman No.', 'Jl. Gatot Subroto No.', 'Jl. Merdeka Raya No.', 'Jl. Diponegoro No.', 'Jl. Asia Afrika No.', 'Jl. Pemuda No.', 'Jl. Pahlawan No.', 'Jl. Riau No.', 'Jl. Dago No.', 'Jl. Gajah Mada No.'];

    let items = [];
    for (let i = 1; i <= 500; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${fn} ${ln}`;
        
        const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 99) + 1}@${domains[Math.floor(Math.random() * domains.length)]}`;
        
        const phone = `08${Math.floor(Math.random() * 5) + 1}2-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
        
        const address = `${streets[Math.floor(Math.random() * streets.length)]} ${Math.floor(Math.random() * 199) + 1}, ${cities[Math.floor(Math.random() * cities.length)]}`;

        items.push({ id: i, name, email, phone, address });
    }
    return items;
}

/**
 * Logika Modal View detail
 */
function openViewModal(emp) {
    const modal = document.getElementById('modal-view');
    const body = document.getElementById('modal-view-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
            <div style="display:flex; align-items:center; gap:1rem;">
                <div style="width:56px; height:56px; border-radius:50%; background:var(--accent-glow); color:var(--accent); font-weight:800; font-size:1.5rem; display:flex; align-items:center; justify-content:center;">
                    ${emp.name.charAt(0)}
                </div>
                <div>
                    <h4 style="font-size:1.2rem; font-weight:800; color:var(--text-heading);">${emp.name}</h4>
                    <span class="badge badge-success" style="margin-top:0.25rem;">Pegawai Aktif</span>
                </div>
            </div>
            <hr style="border:none; border-top:1px solid var(--border-color);">
            <div style="display:flex; flex-direction:column; gap:0.85rem; font-size:0.9rem;">
                <div style="display:flex;"><span style="width:120px; color:var(--text-muted); font-weight:600;">ID Pegawai</span><span style="font-family:monospace; font-weight:700;">#EMP-${emp.id.toString().padStart(4, '0')}</span></div>
                <div style="display:flex;"><span style="width:120px; color:var(--text-muted); font-weight:600;">Alamat Email</span><span style="color:var(--text-heading); font-weight:500;">${emp.email}</span></div>
                <div style="display:flex;"><span style="width:120px; color:var(--text-muted); font-weight:600;">Nomor Telepon</span><span style="color:var(--text-heading); font-weight:500;">${emp.phone}</span></div>
                <div style="display:flex;"><span style="width:120px; color:var(--text-muted); font-weight:600;">Alamat Tinggal</span><span style="color:var(--text-heading); font-weight:500; line-height:1.5; max-width:280px;">${emp.address}</span></div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

/**
 * Logika Modal Edit
 */
function openEditModal(emp) {
    const modal = document.getElementById('modal-edit');
    if (!modal) return;

    document.getElementById('edit-id').value = emp.id;
    document.getElementById('edit-name').value = emp.name;
    document.getElementById('edit-email').value = emp.email;
    document.getElementById('edit-phone').value = emp.phone;
    document.getElementById('edit-address').value = emp.address;

    modal.classList.add('active');

    // Bind edit form submit
    const form = document.getElementById('form-edit-employee');
    form.onsubmit = (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-id').value);
        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;
        const phone = document.getElementById('edit-phone').value;
        const address = document.getElementById('edit-address').value;

        // Cari dan perbarui data array
        const idx = employeeData.findIndex(e => e.id === id);
        if (idx !== -1) {
            employeeData[idx] = { id, name, email, phone, address };
            localStorage.setItem('vibe-employee-data', JSON.stringify(employeeData));
            
            // Re-render row dengan efek transisi warna
            closeModal('modal-edit');
            if (window.refreshDatatableData) window.refreshDatatableData();
            
            // Berikan efek highlight baris
            setTimeout(() => {
                const tr = document.getElementById(`emp-row-${id}`);
                if (tr) {
                    tr.style.background = 'var(--accent-glow)';
                    setTimeout(() => {
                        tr.style.transition = 'background 1s ease';
                        tr.style.background = '';
                    }, 1000);
                }
            }, 400);
        }
    };
}

/**
 * Logika Modal Delete
 */
function openDeleteModal(emp) {
    const modal = document.getElementById('modal-delete');
    const label = document.getElementById('delete-name-label');
    const confirmBtn = document.getElementById('btn-confirm-delete');
    
    if (!modal || !label || !confirmBtn) return;
    label.textContent = emp.name;

    modal.classList.add('active');

    confirmBtn.onclick = () => {
        const tr = document.getElementById(`emp-row-${emp.id}`);
        if (tr) {
            // Animasi baris memudar
            tr.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            tr.style.opacity = '0';
            tr.style.transform = 'translateX(-20px)';
        }

        setTimeout(() => {
            // Hapus dari data array
            employeeData = employeeData.filter(e => e.id !== emp.id);
            localStorage.setItem('vibe-employee-data', JSON.stringify(employeeData));
            
            closeModal('modal-delete');
            if (window.refreshDatatableData) window.refreshDatatableData();
        }, 400);
    };
}

/**
 * Menutup modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/* ==========================================================================
   5. GLOBAL UI COMPONENTS: MODAL & OFFCANVAS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inject UI Backdrop if not exists
    let uiBackdrop = document.querySelector('.ui-backdrop');
    if (!uiBackdrop) {
        uiBackdrop = document.createElement('div');
        uiBackdrop.className = 'ui-backdrop';
        document.body.appendChild(uiBackdrop);
    }

    let currentOpenElement = null;

    function openUIElement(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (target) {
            target.classList.add('show');
            uiBackdrop.classList.add('show');
            document.body.style.overflow = 'hidden';
            currentOpenElement = target;
        }
    }

    function closeUIElement() {
        if (currentOpenElement) {
            currentOpenElement.classList.remove('show');
            currentOpenElement = null;
        }
        uiBackdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Handle Toggles
    document.addEventListener('click', (e) => {
        // Toggles
        const toggleBtn = e.target.closest('[data-toggle="modal"], [data-toggle="offcanvas"]');
        if (toggleBtn) {
            e.preventDefault();
            const targetSelector = toggleBtn.getAttribute('data-target');
            if (targetSelector) openUIElement(targetSelector);
            return;
        }

        // Close Buttons
        const closeBtn = e.target.closest('[data-dismiss="modal"], [data-dismiss="offcanvas"], .btn-close');
        if (closeBtn) {
            e.preventDefault();
            closeUIElement();
            return;
        }

        // Click exactly on the modal wrapper (not the dialog inside) or the backdrop
        if (e.target === uiBackdrop || e.target.classList.contains('modal')) {
            closeUIElement();
        }
    });

    // Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeUIElement();
        }
    });
});
