import { SiteSettings, Lawyer, BranchOffice, Article, MenuItem, CaseConsultation } from '../types';

export const initialSiteSettings: SiteSettings = {
  siteTitle: "LBH GP ANSOR WILAYAH BANTEN",
  siteTagline: "Suara Kebenaran, Jalan Keadilan",
  siteLogoUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80",
  heroBannerUrl: "https://images.unsplash.com/photo-1453733197781-e0de24707c66?w=1600&auto=format&fit=crop&q=80",
  centerpieceLogoUrl: "/images/lbh_ansor_logo.jpg",
  heroHeading: "Suara Kebenaran, Jalan Keadilan",
  heroSubheading: "Jangan biarkan masalah hukum membungkam suara Anda. Bersama kami, setiap suara punya jalan menuju keadilan. Memberikan pendampingan hukum yang adil, terpercaya, dan berpihak pada kebenaran bagi seluruh lapisan masyarakat di Banten.",
  hotlineWhatsapp: "6281519555391",
  officialEmail: "lbhansorbanten@gmail.com",
  headquartersAddress: "Jl. Jagarayu, Dalung, Kec. Cipocok Jaya, Kota Serang, Banten 42127",
  footerAbout: "LBH Ansor Banten hadir sebagai sahabat hukum yang siap berdiri bersama masyarakat, memastikan keadilan tidak hanya menjadi kata-kata, tetapi nyata dirasakan. Berpihak pada rakyat kecil dengan pendampingan hukum profesional, terjangkau, dan berlandaskan moral & amanah.",
  facebookUrl: "https://facebook.com/lbhansorbanten",
  instagramUrl: "https://instagram.com/lbhansor_banten",
  youtubeUrl: "https://youtube.com/@ansorbanten",
  twitterUrl: "https://twitter.com/ansorbanten",
  adminPin: "ansor1934",
  vercelPostgresUrl: ""
};

export const initialMenuItems: MenuItem[] = [
  { id: "menu-1", label: "Beranda", href: "#beranda", isExternal: false, isVisible: true, order: 1 },
  { id: "menu-2", label: "Konsultasi Online", href: "#konsultasi", isExternal: false, isVisible: true, order: 2 },
  { id: "menu-struktur", label: "Struktur Organisasi", href: "#struktur-organisasi", isExternal: false, isVisible: true, order: 3 },
  { id: "menu-5", label: "Artikel & Berita", href: "#artikel", isExternal: false, isVisible: true, order: 4 },
  { id: "menu-6", label: "Cek Status Kasus", href: "#cek-status", isExternal: false, isVisible: true, order: 5 },
];

export const initialLawyers: Lawyer[] = [
  {
    id: "law-rojak",
    name: "Rojak, S.H.",
    title: "S.H.",
    role: "Ketua LBH Ansor Banten",
    regency: "Kota Serang",
    specialization: ["Hukum Pidana", "Advokasi Kebijakan Publik", "Perlindungan Hak Sipil"],
    photoUrl: "/images/rojak_ketua.jpg",
    experienceYears: 15,
    barNumber: "PERADI/0821-BANTEN",
    isAvailable: true,
    phone: "6281519555391"
  },
  {
    id: "law-mulhat",
    name: "Mulhat, S.H., M.H.",
    title: "S.H., M.H.",
    role: "Sekretaris LBH Ansor Banten",
    regency: "Kota Serang",
    specialization: ["Hukum Bisnis & UMKM", "Hukum Keimigrasian & Migran", "Hukum Perdata"],
    photoUrl: "/images/mulhat_sekretaris.jpg",
    experienceYears: 13,
    barNumber: "PERADI/1109-BANTEN",
    isAvailable: true,
    phone: "6281519555391"
  },
  {
    id: "law-dede",
    name: "Dede Maulana Pasial, S.H., M.H.",
    title: "S.H., M.H.",
    role: "Bendahara LBH Ansor Banten",
    regency: "Kota Serang",
    specialization: ["Hukum Ketenagakerjaan", "Sengketa Properti & Tanah", "Mediasi Perdata"],
    photoUrl: "/images/dede_bendahara.jpg",
    experienceYears: 11,
    barNumber: "PERADI/0554-BANTEN",
    isAvailable: true,
    phone: "6281519555391"
  },
  {
    id: "law-2",
    name: "Ahmad Baihaqi, S.H.",
    title: "S.H.",
    role: "Divisi Advokasi Agraria & Lingkungan Hidup",
    regency: "Kabupaten Lebak",
    specialization: ["Sengketa Tanah / Agraria", "Hukum Adat & Lingkungan", "Mediasi Pertanahan"],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
    experienceYears: 10,
    barNumber: "PERADI/1109-LEBAK",
    isAvailable: true,
    phone: "6281312345678"
  },
  {
    id: "law-3",
    name: "Hj. Nurul Hidayati, S.H., M.Kn.",
    title: "S.H., M.Kn.",
    role: "Divisi Perlindungan Perempuan & Anak",
    regency: "Kota Tangerang Selatan",
    specialization: ["Penghapusan KDRT", "Hukum Keluarga & Waris", "Perlindungan Anak"],
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    experienceYears: 11,
    barNumber: "PERADI/0554-TANGSEL",
    isAvailable: true,
    phone: "6281598765432"
  },
  {
    id: "law-5",
    name: "Fajar Sidik Ramdani, S.H.",
    title: "S.H.",
    role: "Advokat Cyber Law & Pemberantasan Pinjol",
    regency: "Kabupaten Pandeglang",
    specialization: ["UU ITE & Kejahatan Siber", "Pemberantasan Pinjol Ilegal", "Hukum Pidana"],
    photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    experienceYears: 8,
    barNumber: "PERADI/0991-PDG",
    isAvailable: true,
    phone: "6285299887766"
  }
];

export const initialBranches: BranchOffice[] = [
  {
    id: "branch-1",
    name: "Kantor Wilayah LBH Ansor Banten (Pusat)",
    regency: "Kota Serang",
    address: "Jl. Jagarayu, Dalung, Kec. Cipocok Jaya, Kota Serang, Banten 42127",
    phone: "+62 815-1955-5391",
    operationalHours: "Senin - Jumat: 09.00 - 16.00 WIB (Hotline WA Siaga 24 Jam)",
    latitude: -6.1352257,
    longitude: 106.1439055,
    googleMapsUrl: "https://www.google.com/maps/place/Jl.+Jagarayu,+Kota+Serang,+Banten/@-6.1352257,106.1439055,17z/data=!3m1!4b1!4m6!3m5!1s0x2e418ac565ebea4b:0x989e252db402e8f!8m2!3d-6.1352257!4d106.1439055!16s%2Fg%2F11cknfc31m"
  },
  {
    id: "branch-2",
    name: "Posko Bantuan Hukum PC LBH Ansor Kota Cilegon",
    regency: "Kota Cilegon",
    address: "Komp. BBS II Blok E No. 12, Ciwandan, Kota Cilegon, Banten",
    phone: "0877-1122-3344",
    operationalHours: "Senin - Sabtu: 09.00 - 17.00 WIB",
    latitude: -6.0175,
    longitude: 106.0538,
    googleMapsUrl: "https://maps.google.com/?q=-6.0175,106.0538"
  },
  {
    id: "branch-3",
    name: "Posko Bantuan Hukum PC LBH Ansor Kab. Pandeglang",
    regency: "Kabupaten Pandeglang",
    address: "Jl. Mayor Widagdo No. 8, Pagadungan, Kec. Karangtanjung, Kab. Pandeglang, Banten",
    phone: "0852-9988-7766",
    operationalHours: "Senin - Jumat: 09.00 - 16.30 WIB",
    latitude: -6.3086,
    longitude: 106.1064,
    googleMapsUrl: "https://maps.google.com/?q=-6.3086,106.1064"
  },
  {
    id: "branch-4",
    name: "Posko Bantuan Hukum PC LBH Ansor Kab. Lebak",
    regency: "Kabupaten Lebak",
    address: "Jl. Pahlawan No. 45, Muara Ciujung Timur, Kec. Rangkasbitung, Kab. Lebak, Banten",
    phone: "0813-1234-5678",
    operationalHours: "Senin - Sabtu: 08.30 - 16.00 WIB",
    latitude: -6.3639,
    longitude: 106.2503,
    googleMapsUrl: "https://maps.google.com/?q=-6.3639,106.2503"
  },
  {
    id: "branch-5",
    name: "Posko Bantuan Hukum PC LBH Ansor Kab. Tangerang",
    regency: "Kabupaten Tangerang",
    address: "Pusat Pemerintahan Kab. Tangerang, Jl. KH. Syekh Nawawi No. 15, Tigaraksa, Tangerang",
    phone: "0812-3456-7890",
    operationalHours: "Senin - Jumat: 09.00 - 17.00 WIB",
    latitude: -6.2625,
    longitude: 106.4839,
    googleMapsUrl: "https://maps.google.com/?q=-6.2625,106.4839"
  },
  {
    id: "branch-6",
    name: "Posko Bantuan Hukum PC LBH Ansor Kota Tangerang",
    regency: "Kota Tangerang",
    address: "Komp. Ruko Moderland Blok B No. 04, Cipondoh / Babakan, Kota Tangerang",
    phone: "0818-8765-4321",
    operationalHours: "Senin - Sabtu: 09.00 - 18.00 WIB",
    latitude: -6.1783,
    longitude: 106.6319,
    googleMapsUrl: "https://maps.google.com/?q=-6.1783,106.6319"
  },
  {
    id: "branch-7",
    name: "Posko Bantuan Hukum PC LBH Ansor Kota Tangerang Selatan",
    regency: "Kota Tangerang Selatan",
    address: "Jl. Surya Kencana No. 28, Pamulang Barat, Kec. Pamulang, Kota Tangerang Selatan",
    phone: "0815-9876-5432",
    operationalHours: "Senin - Jumat: 09.00 - 17.00 WIB",
    latitude: -6.3429,
    longitude: 106.7383,
    googleMapsUrl: "https://maps.google.com/?q=-6.3429,106.7383"
  },
  {
    id: "branch-8",
    name: "Posko Bantuan Hukum PC LBH Ansor Kab. Serang",
    regency: "Kabupaten Serang",
    address: "Jl. Raya Jakarta - Serang Km. 72, Citerep, Kec. Ciruas, Kab. Serang, Banten",
    phone: "0896-5544-3322",
    operationalHours: "Senin - Jumat: 09.00 - 16.00 WIB",
    latitude: -6.1156,
    longitude: 106.2167,
    googleMapsUrl: "https://maps.google.com/?q=-6.1156,106.2167"
  }
];

export const initialArticles: Article[] = [
  {
    id: "art-1",
    slug: "syarat-dan-tata-cara-memperoleh-bantuan-hukum-gratis-di-banten",
    title: "Syarat dan Tata Cara Memperoleh Bantuan Hukum Gratis (Pro Bono) di Banten",
    category: "Edukasi Hukum",
    summary: "Panduan lengkap bagi masyarakat tidak mampu di Provinsi Banten untuk mengakses layanan bantuan hukum gratis berdasarkan UU No. 16 Tahun 2011 melalui LBH GP Ansor Banten.",
    content: `Akses terhadap keadilan adalah hak konstitusional setiap warga negara Indonesia yang dijamin oleh UUD 1945 Pasal 28D ayat (1) dan Undang-Undang Nomor 16 Tahun 2011 tentang Bantuan Hukum.

Bagi masyarakat di wilayah Provinsi Banten (Serang, Cilegon, Pandeglang, Lebak, hingga Tangerang Raya) yang sedang berhadapan dengan masalah hukum namun terkendala secara ekonomi, LBH Gerakan Pemuda Ansor Wilayah Banten menyediakan pendampingan cuma-cuma (pro bono).

### Syarat Administrasi Pemohon Bantuan Hukum:
1. **Identitas Diri**: Fotokopi KTP dan Kartu Keluarga (KK) pemohon yang berdomisili di Banten.
2. **Keterangan Tidak Mampu**: Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan/Desa setempat, atau Kartu Indonesia Sehat (KIS)/Kartu Indonesia Pintar (KIP)/PKH.
3. **Uraian Pokok Masalah**: Kronologi singkat kronologis perkara hukum (pidana, perdata, atau tata usaha negara) beserta dokumen pendukung yang dimiliki.
4. **Surat Kuasa Khusus**: Diberikan kepada advokat/paralegal LBH Ansor setelah verifikasi berkas disetujui.

### Alur Pelayanan di LBH Ansor Banten:
- **Langkah 1**: Mengisi formulir konsultasi online di website resmi LBH Ansor Banten atau datang langsung ke posko terdekat.
- **Langkah 2**: Telaah berkas oleh tim advokat dalam waktu 1x24 jam untuk memvalidasi syarat formil dan materiil.
- **Langkah 3**: Penerbitan Nomor Tiket Perkara dan penunjukan Advokat Pendamping.
- **Langkah 4**: Proses pendampingan baik mediasi non-litigasi maupun pendampingan di kepolisian, kejaksaan, dan pengadilan negeri.

LBH GP Ansor berkomitmen tidak memungut biaya sepeser pun untuk masyarakat miskin yang memenuhi kriteria pro bono.`,
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80",
    author: "Tubagus M. Fahrurrozi, S.H., M.H.",
    authorRole: "Direktur Wilayah LBH Ansor Banten",
    publishedAt: "2025-05-18",
    readTimeMinutes: 4,
    tags: ["Bantuan Hukum", "Pro Bono", "UU 16/2011", "Serang Banten"]
  },
  {
    id: "art-2",
    slug: "mengatasi-sengketa-tanah-girik-dan-akta-jual-beli-di-wilayah-banten",
    title: "Langkah Hukum Mengatasi Sengketa Tanah Girik dan AJB Ganda di Wilayah Banten",
    category: "Agraria & Pertanahan",
    summary: "Kerap terjadinya tumpang tindih kepemilikan tanah di Banten memerlukan pemahaman yuridis mengenai kekuatan hukum girik, leter C, sertifikat hak milik (SHM), dan pembuktian di pengadilan.",
    content: `Provinsi Banten merupakan salah satu wilayah dengan dinamika sengketa tanah yang tinggi, terutama terkait tanah adat, girik, leter C, hingga tumpang tindih Akta Jual Beli (AJB) dan Sertifikat Hak Milik (SHM).

### Mengapa Sengketa Tanah Sering Terjadi?
1. **Peralihan Hak yang Belum Bersertifikat**: Masih banyaknya warga yang mempercayai bukti kepemilikan turun-temurun berupa girik atau bukti bayar PBB, padahal PBB bukan bukti kepemilikan hak atas tanah melainkan bukti pembayaran pajak.
2. **AJB Ganda**: Penjualan objek tanah oleh oknum yang sama kepada lebih dari satu pihak melalui perantara oknum desa atau calo tanah.
3. **Klaim Mafia Tanah**: Pemalsuan warkah tanah dan manipulasi pengukuran batas tanah.

### Langkah Preventif & Tindakan Hukum:
- **Pengecekan di Kantor Pertanahan (BPN)**: Selalu lakukan validasi dan plotting batas tanah melalui BPN kabupaten/kota setempat.
- **Upaya Mediasi Melalui Kantor Desa / Posko LBH**: Mediasi kekeluargaan dengan menghadirkan saksi batas dan riwayat asal-usul tanah (warkah desa).
- **Gugatan Pembatalan Sertifikat atau Perbuatan Melawan Hukum (PMH)**: Jika jalur damai buntu, gugatan ke Pengadilan Negeri atau Pengadilan Tata Usaha Negara (PTUN) dapat diajukan didampingi oleh advokat LBH Ansor.

LBH Ansor Banten secara rutin mengadvokasi para petani dan masyarakat adat di Lebak dan Pandeglang yang terancam penggusuran sepihak.`,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80",
    author: "Ahmad Baihaqi, S.H.",
    authorRole: "Kadiv Advokasi Agraria LBH Ansor Banten",
    publishedAt: "2025-05-10",
    readTimeMinutes: 6,
    tags: ["Agraria", "Sengketa Tanah", "BPN", "Hukum Pertanahan"]
  },
  {
    id: "art-3",
    slug: "perlindungan-hukum-pekerja-banten-terhadap-phk-sepihak",
    title: "Hak Normatif Buruh Industri di Banten Terhadap PHK Sepihak Tanpa Pesangon",
    category: "Ketenagakerjaan",
    summary: "Ulasan hak-hak pekerja di kawasan industri Cilegon, Serang, dan Tangerang berdasarkan regulasi ketenagakerjaan pasca Putusan MK atas UU Cipta Kerja.",
    content: `Sebagai salah satu poros industri terbesar di Indonesia, Provinsi Banten menampung ratusan ribu buruh pabrik di Cilegon, Cikande Serang, dan Tangerang. Namun, PHK sepihak dan status kerja kontrak (PKWT) berkepanjangan masih menjadi keluhan utama.

### Tahapan Penyelesaian Perselisihan PHK:
1. **Perundingan Bipartit (Pekerja & Manajemen)**: Batas waktu maksimal 30 hari kerja. Harus dituangkan dalam Risalah Bipartit.
2. **Pencatatan ke Disnaker (Tripartit)**: Jika bipartit gagal, salah satu pihak mencatatkan perselisihan ke Dinas Tenaga Kerja setempat untuk mediasi atau konsiliasi resmi.
3. **Anjuran Tertulis Mediator**: Mediator Disnaker akan mengeluarkan anjuran hukum tertulis.
4. **Gugatan ke Pengadilan Hubungan Industrial (PHI) di Pengadilan Negeri Serang**: Upaya hukum terakhir jika salah satu pihak menolak anjuran mediator.

Pekerja yang di-PHK berhak atas:
- Uang Pesangon (UP)
- Uang Penghargaan Masa Kerja (UPMK)
- Uang Penggantian Hak (UPH)

LBH GP Ansor Banten siap mendampingi serikat buruh maupun pekerja perseorangan yang hak-hak dasarnya dirampas oleh perusahaan nakal.`,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    author: "Rizki Maulana, S.H.",
    authorRole: "Koordinator Wilayah Cilegon & Ketenagakerjaan",
    publishedAt: "2025-04-28",
    readTimeMinutes: 5,
    tags: ["Buruh", "Ketenagakerjaan", "PHK", "Cilegon", "Pesangon"]
  },
  {
    id: "art-4",
    slug: "jerat-pinjol-ilegal-dan-ancaman-pidana-uu-ite-cara-melindungi-diri",
    title: "Teror Pinjol Ilegal dan Ancaman UU ITE: Strategi Hukum Menyelamatkan Diri",
    category: "Cyber Law & Pidana",
    summary: "Edukasi menghadapi ancaman sebar data pribadi oleh debt collector pinjaman online ilegal dan ketentuan perlindungan data pribadi UU No. 27/2022.",
    content: `Praktik pinjaman online (pinjol) ilegal telah memakan banyak korban di Banten, mulai dari bunga mencekik, intimidasi kasar, hingga penyebaran data pribadi dan foto manipulasi ke seluruh kontak telepon korban.

### Fakta Hukum yang Wajib Diketahui:
- **Penyebaran Data Pribadi adalah Tindak Pidana**: Melanggar Pasal 27 ayat (3) jo Pasal 45 ayat (3) UU ITE serta UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
- **Pengancaman & Pemerasan**: Melanggar Pasal 368 KUHP dan Pasal 29 UU ITE. Ancaman pidana penjara hingga 4 sampai 9 tahun.
- **Pinjol Ilegal Tidak Memiliki Legalitas OJK**: Perjanjian pinjaman dengan entitas ilegal dapat dinyatakan batal demi hukum karena melanggar syarat kausa yang halal dalam Pasal 1320 KUHPerdata.

### Langkah Cepat yang Harus Dilakukan:
1. Tangkap layar (screenshot) semua chat ancaman, bukti transfer, dan nomor telepon penagih.
2. Laporkan ke Satgas Waspada Investasi (SWI) OJK dan Kepolisian Daerah (Polda) Banten.
3. Jangan pernah mentransfer uang perpanjangan di luar aplikasi resmi.
4. Hubungi tim siber LBH Ansor Banten untuk pendampingan perlindungan hukum dan psikologis.`,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
    author: "Fajar Sidik Ramdani, S.H.",
    authorRole: "Advokat Cyber Law LBH Ansor Banten",
    publishedAt: "2025-04-15",
    readTimeMinutes: 5,
    tags: ["Pinjol Ilegal", "UU ITE", "Data Pribadi", "Polda Banten"]
  },
  {
    id: "art-5",
    slug: "panduan-lapor-tindak-pidana-ke-polisi-di-banten-tanpa-pungli",
    title: "Panduan Melaporkan Tindak Pidana ke SPKT Polsek & Polres di Banten Tanpa Biaya",
    category: "Hukum Pidana",
    summary: "Ketahui hak Anda sebagai pelapor, tata cara pembuatan Laporan Polisi (LP) atau Surat Tanda Penerimaan Laporan (STPL), dan cara mengawal proses penyelidikan.",
    content: `Setiap warga negara berhak melaporkan dugaan tindak pidana ke Sentra Pelayanan Kepolisian Terpadu (SPKT) di kantor polisi terdekat tanpa dipungut biaya apapun (gratis).

### Langkah Pelaporan yang Benar:
1. **Mendatangi SPKT**: Bawa identitas KTP dan siapkan keterangan kronologi peristiwa serta barang bukti awal (rekaman, saksi, dokumen, atau visum).
2. **Penerbitan STPL**: Pastikan petugas kepolisian menerbitkan Surat Tanda Penerimaan Laporan (STPL) resmi berstempel dinas.
3. **Minta SP2HP Berkala**: Pelapor berhak meminta Surat Pemberitahuan Perkembangan Hasil Penyelidikan (SP2HP) untuk memantau kemajuan berkas perkara.

LBH Ansor Banten siap mendampingi korban kejahatan sejak tahap laporan di kepolisian hingga pengadilan.`,
    imageUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=1200&auto=format&fit=crop&q=80",
    author: "Rojak, S.H.",
    authorRole: "Ketua LBH Ansor Banten",
    publishedAt: "2025-04-02",
    readTimeMinutes: 4,
    tags: ["Pidana", "Laporan Polisi", "SPKT", "Hak Korban"]
  },
  {
    id: "art-6",
    slug: "hukum-waris-islam-dan-sengketa-tanah-keluarga-di-banten",
    title: "Penyelesaian Sengketa Waris Tanah Keluarga Melalui Hukum Islam dan Mediasi",
    category: "Perdata & Keluarga",
    summary: "Ulasan pembagian waris berlandaskan Kompilasi Hukum Islam (KHI) dan strategi musyawarah kekeluargaan demi mencegah perpecahan tali silaturahmi.",
    content: `Sengketa waris antar keluarga kandung seringkali memicu konflik berkepanjangan hingga ke ranah pidana jika tidak diselesaikan dengan adil dan bijaksana.

### Prinsip Utama Pembagian Waris Islam (KHI):
- **Selesaikan Hak & Kewajiban Jenazah Dahulu**: Biaya pemakaman, pelunasan hutang almarhum, serta wasiat (maksimal 1/3 harta) harus ditunaikan sebelum pembagian.
- **Rukun dan Syarat Waris**: Adanya pewaris yang wafat, ahli waris yang masih hidup, dan harta tirkah yang halal dan jelas kepemilikannya.
- **Upaya Islah (Perdamaian)**: Pasal 183 KHI memungkinkan ahli waris bersepakat melakukan perdamaian pembagian harta setelah masing-masing menyadari bagian normatifnya.

LBH GP Ansor mengedepankan mediasi berbasis musyawarah kekeluargaan dengan mengacu pada asas fiqh Islam dan hukum positif.`,
    imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&auto=format&fit=crop&q=80",
    author: "Mulhat, S.H., M.H.",
    authorRole: "Sekretaris LBH Ansor Banten",
    publishedAt: "2025-03-25",
    readTimeMinutes: 6,
    tags: ["Hukum Waris", "KHI", "Mediasi", "Hukum Keluarga"]
  }
];

export const initialCases: CaseConsultation[] = [
  {
    id: "case-01",
    ticketNumber: "LBH-BTN-2025-0101",
    clientName: "Samsul Bahri",
    clientPhone: "081299887766",
    clientEmail: "samsul.serang@gmail.com",
    regency: "Kota Serang",
    category: "agraria",
    caseTitle: "Klaim Sepihak Tanah Warisan Seluas 1.200 m² di Cipocok Serang",
    chronology: "Tanah milik almarhum kakek saya tiba-tiba dipagar oleh pengembang perumahan tanpa ada ganti rugi atau konfirmasi. Kami memegang bukti surat girik dan riwayat leter C desa sejak 1978.",
    status: "proses",
    statusNotes: "Tim LBH Ansor Banten telah mengirimkan Surat Somasi I ke pihak pengembang dan menjadwalkan mediasi di kantor kelurahan pada Kamis mendatang.",
    assignedLawyerId: "law-1",
    assignedLawyerName: "Tubagus M. Fahrurrozi, S.H., M.H.",
    createdAt: "2025-05-02T10:30:00Z",
    updatedAt: "2025-05-12T14:20:00Z"
  },
  {
    id: "case-02",
    ticketNumber: "LBH-BTN-2025-0102",
    clientName: "Ibu Siti Rohmah",
    clientPhone: "087733445566",
    regency: "Kabupaten Pandeglang",
    category: "kdrt_anak",
    caseTitle: "Pendampingan Korban KDRT dan Penelantaran Nafkah Anak",
    chronology: "Mengalami kekerasan verbal dan fisik berulang serta penelantaran ekonomi selama 8 bulan. Suami menolak memberikan nafkah untuk dua anak di bawah umur.",
    status: "ditelaah",
    statusNotes: "Sedang dilakukan koordinasi dengan Unit PPA Polres Pandeglang dan pendampingan visum et repertum.",
    assignedLawyerId: "law-3",
    assignedLawyerName: "Hj. Nurul Hidayati, S.H., M.Kn.",
    createdAt: "2025-05-14T08:15:00Z",
    updatedAt: "2025-05-15T09:00:00Z"
  },
  {
    id: "case-03",
    ticketNumber: "LBH-BTN-2025-0103",
    clientName: "Wahyu Hendratno",
    clientPhone: "085211223344",
    regency: "Kota Cilegon",
    category: "ketenagakerjaan",
    caseTitle: "PHK Sepihak 14 Pekerja Subkontraktor Tanpa Kompensasi di Cilegon",
    chronology: "Kami bekerja selama 4 tahun dengan kontrak berulang tanpa jeda. Pada bulan April tiba-tiba diberhentikan tanpa uang pesangon atau uang sisa kontrak.",
    status: "verifikasi",
    statusNotes: "Menunggu kelengkapan salinan SPK (Surat Perjanjian Kerja) dan slip gaji terakhir dari pemohon.",
    assignedLawyerId: "law-4",
    assignedLawyerName: "Rizki Maulana, S.H.",
    createdAt: "2025-05-18T11:45:00Z",
    updatedAt: "2025-05-18T11:45:00Z"
  }
];
