const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const CONTENT_FILE = path.join(PUBLIC_DIR, 'content.json');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
};

// Default content template jika content.json belum ada
const DEFAULT_CONTENT = {
    general: {
        siteTitle: "Pengajian Selasa Kliwon — Portal Resmi Dokumentasi & Presensi",
        brandName: "Pengajian Selasa Kliwon",
        brandTagline: "Arsip Dokumentasi & Presensi Jamaah",
        logoUrl: "https://lh3.googleusercontent.com/d/1AWGqg1M20PNWj8o3SypFFdq_p2oGjF2f",
        announcement: {
            enabled: true,
            badge: "PENGUMUMAN",
            text: "Selamat datang di Portal Resmi Pengajian Selasa Kliwon nJero Benteng Kraton Yogyakarta. Mari jalin ukhuwah & silaturahmi jamaah."
        }
    },
    hero: {
        bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        headline: "Arsip Kegiatan & Silaturahmi Jamaah",
        description: "Portal resmi dokumentasi foto & video kenangan pengajian, rekapitulasi presensi kehadiran jamaah, serta pusat syiar ukhuwah Islamiyah Pengajian Selasa Kliwon.",
        ctaGalleryText: "Buka Galeri Dokumentasi",
        ctaPresensiText: "Rekap Presensi Jamaah",
        ctaScheduleText: "Jadwal Acara"
    },
    nextMeeting: {
        enabled: true,
        badge: "Pengajian Selapanan Terdekat",
        dateDisplay: "Selasa Kliwon, 20 Oktober 2026",
        targetDate: "2026-10-20T19:30:00+07:00",
        location: "Kediaman Bp. Budhy Hersunarto & Sekitarnya",
        address: "Patehan Kidul, nJero Benteng Kraton, Yogyakarta",
        mapsUrl: "",
        time: "Pukul 19.30 WIB (Ba'da Isya) - Selesai",
        calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pengajian+Selasa+Kliwon&details=Pengajian+Rutin+Selapanan+Selasa+Kliwon+Jamaah+nJero+Benteng+Kraton+Yogyakarta.&dates=20261020T123000Z/20261020T153000Z",
        shareMessage: "Insya Allah Pengajian Rutin Selapanan Selasa Kliwon berikutnya dilaksanakan pada Selasa Kliwon, 20 Oktober 2026 ba'da Isya (19.30 WIB). Mari hadir menyambung tali silaturahmi jamaah nJero Benteng!"
    },
    stats: {
        totalJamaahManual: "140+",
        useAutoJamaah: true,
        totalWilayahManual: "9",
        useAutoWilayah: true,
        cycleText: "35 Hari",
        cycleSubtext: "Siklus Selapanan"
    },
    pillars: [
        {
            id: "pilar-1",
            icon: "fa-solid fa-calendar-check",
            title: "Jadwal Rutin Selapanan",
            description: "Dilaksanakan secara istiqomah setiap siklus penanggalan Jawa <b>Selasa Kliwon</b> bertempat secara bergilir di kediaman para anggota jamaah.",
            footerLabel: "Siklus Pertemuan",
            footerIcon: "fa-solid fa-clock"
        },
        {
            id: "pilar-2",
            icon: "fa-solid fa-users-rectangle",
            title: "Tujuan & Silaturahmi",
            description: "Mempererat tali persaudaraan antarwarga dan jamaah, memperdalam ilmu agama islam, serta menumbuhkan kepedulian sosial sesama.",
            footerLabel: "Ukhuwah Islamiyah",
            footerIcon: "fa-solid fa-heart"
        },
        {
            id: "pilar-3",
            icon: "fa-solid fa-book-quran",
            title: "Agenda Utama",
            description: "Pembacaan ayat suci Al-Qur'an, doa bersama, tausiyah keagamaan, serta musyawarah dan ramah tamah antarjamaah.",
            footerLabel: "Kajian & Doa Bersama",
            footerIcon: "fa-solid fa-book-open"
        }
    ],
    schedules: [
        {
            id: 1,
            roundNumber: "Putaran #1",
            status: "Terlaksana ✓",
            statusType: "completed",
            date: "15 September 2026",
            host: "Rumah Bp. Budhy H.",
            note: "Lihat Foto Kegiatan",
            actionType: "galeri"
        },
        {
            id: 2,
            roundNumber: "Putaran #2",
            status: "Berikutnya ✨",
            statusType: "active",
            date: "20 Oktober 2026",
            host: "Kediaman Bp. Budhy Hersunarto & Sekitarnya",
            note: "Pukul 19.30 WIB",
            actionType: "clock"
        },
        {
            id: 3,
            roundNumber: "Putaran #3",
            status: "Mendatang",
            statusType: "upcoming",
            date: "24 November 2026",
            host: "Kediaman Jamaah",
            note: "Siklus 35 Hari",
            actionType: "calendar"
        },
        {
            id: 4,
            roundNumber: "Putaran #4",
            status: "Mendatang",
            statusType: "upcoming",
            date: "29 Desember 2026",
            host: "Kediaman Jamaah",
            note: "Akhir Tahun 2026",
            actionType: "calendar"
        }
    ],
    galleryConfig: {
        gasApiUrl: "https://script.google.com/macros/s/AKfycbySPpw7C8ktUmQGtb6QWLhZ_QwL8TVwrht40VePuzt0FllsLPENo143Od01mGWAfyaK/exec",
        sectionTitle: "Album Kegiatan Pengajian",
        sectionSubtitle: "Pilih salah satu folder di bawah ini untuk melihat foto & video kegiatan.",
        customAlbums: []
    },
    presensiConfig: {
        sheetUrls: {
            "2026": "https://docs.google.com/spreadsheets/d/1KcpS1gOud7yqaIvPjSquYL1ExW5WCEyhcaGvrc-MP6k/export?format=csv&gid=203264463",
            "2025": "",
            "2024": ""
        },
        defaultYear: "2026"
    },
    contactAndFooter: {
        contactPerson: "Sekretariat Pengajian",
        whatsappNumber: "6281234567890",
        address: "nJero Benteng Kraton, DI Yogyakarta",
        donationInfo: {
            enabled: true,
            bank: "BSI (Bank Syariah Indonesia)",
            accountNumber: "123-456-7890",
            accountName: "Pengajian Selasa Kliwon"
        },
        copyrightText: "© 2026 Pengajian Selasa Kliwon. All rights reserved."
    },
    adminSettings: {
        adminPin: "admin123"
    }
};

function readContentFromFile() {
    try {
        if (fs.existsSync(CONTENT_FILE)) {
            const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
            return JSON.parse(raw);
        }
    } catch (err) {
        console.error('Error membaca content.json:', err.message);
    }
    return DEFAULT_CONTENT;
}

function saveContentToFile(data) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Inisialisasi jika content.json belum ada
if (!fs.existsSync(CONTENT_FILE)) {
    saveContentToFile(DEFAULT_CONTENT);
}

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = req.url.split('?')[0];
    const cleanUrl = decodeURI(parsedUrl);

    // ================= API ENDPOINTS =================
    if (cleanUrl === '/api/content') {
        if (req.method === 'GET') {
            const content = readContentFromFile();
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(content));
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                try {
                    const parsedData = JSON.parse(body);
                    if (!parsedData || typeof parsedData !== 'object') {
                        throw new Error('Data tidak valid');
                    }
                    saveContentToFile(parsedData);
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: true, message: 'Konten berhasil disimpan!' }));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: err.message }));
                }
            });
            return;
        }
    }

    if (cleanUrl === '/api/reset' && req.method === 'POST') {
        try {
            saveContentToFile(DEFAULT_CONTENT);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, message: 'Konten berhasil di-reset ke standar.', content: DEFAULT_CONTENT }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    if (cleanUrl === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const { pin } = JSON.parse(body);
                const currentContent = readContentFromFile();
                const validPin = (currentContent.adminSettings && currentContent.adminSettings.adminPin) || 'admin123';
                if (pin === validPin) {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: true, token: 'psk_auth_' + Date.now() }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ success: false, error: 'PIN / Password Admin salah!' }));
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: 'Permintaan tidak valid' }));
            }
        });
        return;
    }

    // ================= STATIC FILE SERVING =================
    let reqUrl = cleanUrl;
    if (reqUrl === '/') {
        reqUrl = '/index.html';
    }

    let filePath = path.join(PUBLIC_DIR, reqUrl);

    // Keamanan path traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Coba di subfolder pengajian-selasa-kliwon-main jika tidak ditemukan di root
            const fallbackPath = path.join(PUBLIC_DIR, 'pengajian-selasa-kliwon-main', reqUrl);
            fs.stat(fallbackPath, (fbErr, fbStats) => {
                if (!fbErr && fbStats.isFile()) {
                    serveFile(fallbackPath, res);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('404 Not Found');
                }
            });
            return;
        }

        serveFile(filePath, res);
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('500 Internal Server Error');
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server aktif berjalan di: http://localhost:${PORT}`);
    console.log(`Halaman Utama: http://localhost:${PORT}/index.html`);
    console.log(`Halaman Admin: http://localhost:${PORT}/admin.html`);
});
