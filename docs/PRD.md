# PRD ScanTik Pekalongan v2.0

**Klasifikasi Motif Batik Berbasis Machine Learning (Sinkron dengan Implementasi Aktual)**

- **Versi:** 2.0 (menggantikan v1.0)
- **Tanggal:** 5 November 2026
- **Status:** Approved for Implementation
- **Pemilik:** Bima
- **Platform target:** Android via Expo Go (SDK 58); iOS tidak diuji
- **Sumber desain UI:** file Figma pemilik (empat layar: Scanner, Katalog, Riwayat, Panduan Foto). Tautan: https://www.figma.com/design/xMiHzT41cYSBL964PTOKE4/ScanTik?node-id=0-1&t=WJJ44bIjVFEJIDYK-1

---

## 0. Aturan Kerja untuk Agent AI (Wajib Dibaca Pertama)

Dokumen ini adalah **satu-satunya sumber kebenaran**. Jika ada konflik antara dokumen ini, desain Figma, dan kebiasaan bawaan template, **dokumen ini menang**, kecuali bagian visual murni (warna, tipografi, jarak) yang mengikuti Figma.

### 0.1 Aturan

1. **Kerjakan per milestone** (Bagian 12). Selesaikan satu, jalankan, lalu berhenti dan laporkan. Jangan mengerjakan milestone berikutnya tanpa perintah.
2. **Jangan menambah fitur** di luar Bagian 3. Jika ada ide tambahan, tulis sebagai saran di akhir laporan, jangan diimplementasikan.
3. **Jangan mengarang data motif.** Teks motif hanya boleh berasal dari Bagian 7. Jika data kurang, tampilkan `[isi]` atau tanya pemilik.
4. **Jangan mengubah kontrak API** (Bagian 6) dan **jangan mengubah backend** (folder `scantik-api`). Backend sudah selesai dan diuji.
5. **Jangan menambah dependensi** di luar Bagian 4 tanpa persetujuan. Gunakan `npx expo install <paket>` (bukan `npm install`) agar versi sesuai SDK 58.
6. **Periksa dokumentasi SDK 58** (`docs.expo.dev/versions/v58.0.0`) sebelum memakai API Expo. Beberapa API berubah antar-versi (misalnya `expo-file-system`, `expo-image-picker`). Jangan menulis API dari ingatan.
7. **TypeScript ketat.** Tanpa `any` kecuali ada alasan yang ditulis di komentar.
8. **Setiap milestone harus bisa dijalankan** (`npx expo start`, Expo Go di Android) tanpa error merah sebelum dilaporkan selesai.
9. **Jika ragu, bertanya.** Jangan menebak.

### 0.2 Format Laporan Tiap Milestone

- Berkas yang dibuat atau diubah
- Perintah yang dijalankan
- Cara menguji
- Hal yang tidak diselesaikan atau diasumsikan

---

## 1. Ringkasan Produk

**ScanTik Pekalongan** adalah aplikasi mobile edukasi budaya. Pengguna memilih foto kain batik dari galeri, aplikasi mengirimnya ke REST API ML, lalu menampilkan **nama motif, skor kecocokan (%), dan makna motif**. Aplikasi juga memiliki katalog motif, riwayat pindaian lokal, dan panduan foto.

### 1.1 Perubahan dari PRD v1.0

| Hal | v1.0 | v2.0 (aktual) | Alasan |
| :-- | :-- | :-- | :-- |
| Jumlah motif | "Jlamprang, Tujuh Rupa, Buketan, Terang Bulan, dll." | **6 motif**: Buketan, Jlamprang, Liong, Mega Mendung, Singa Barong, Tujuh Rupa | Sesuai dataset yang dipakai |
| Kelas **Negatif** | Tidak ada | Ada: berarti "motif di luar 6 motif yang dikenali" | Ada di dataset; memengaruhi perilaku API dan UI |
| "Terang Bulan" | Contoh kelas | **Tidak ada** di model | Tidak ada di dataset |
| Klaim "motif Pekalongan" | Semua motif | Buketan, Jlamprang, Liong, Tujuh Rupa dari Pekalongan; **Mega Mendung dan Singa Barong dari Cirebon** | Dibuktikan lewat referensi; dataset berlabel "Batik Pesisir Utara Jawa" |
| Hosting API | Hugging Face Spaces atau Render (cloud) | **API berjalan di laptop** pemilik, diakses HP lewat hotspot | Hugging Face meminta paket berbayar untuk Space Docker, Render meminta kartu |
| Endpoint | `POST /predict` | `POST /predict` dan `GET /health` | `/health` ditambahkan |
| Lokasi kode | `app/` | **`src/app/`** | Struktur bawaan template Expo SDK 58 |
| Pencarian katalog | Tidak ada | Kolom cari di Katalog (filter lokal) | Ada di desain Figma |
| Dataset | 3.700 foto, split 70/20/10 | Split disusun ulang per kelompok foto: 2.585 / 738 / 369 (total 3.692) | Menghindari kebocoran data antar-split |
| Akurasi | Tidak dicantumkan | **92,4% pada data uji** | Hasil evaluasi |

---

## 2. Status Proyek Saat Ini

### 2.1 Selesai (jangan dikerjakan ulang)

- Dataset dibersihkan dan dibagi ulang; model MobileNetV2 dilatih (`scantik_model_v2.keras`).
- API FastAPI lokal (`scantik-api`) dengan `/predict` dan `/health`; lolos uji respons 200 dan 400; dapat diakses dari HP.
- Data 6 motif (`motif_data.json`) sudah diisi dari referensi.
- Repositori API: `github.com/Bim44a/scantik-api`.
- Proyek Expo `scantik-app` (SDK 58) dibuat dan terbuka di Expo Go Android.
- Desain Figma empat layar tersedia.

### 2.2 Belum dikerjakan (tugas agent)

- Seluruh UI sesuai Figma dan struktur rute Bagian 8.
- Integrasi API, penyimpanan riwayat, katalog, dan halaman bantuan.

---

## 3. Batasan Scope

| In-Scope (Wajib) | Out-of-Scope (Dilarang) |
| :-- | :-- |
| Pilih foto dari galeri (`expo-image-picker`) | Akses kamera langsung (live preview) |
| Kompres dan resize foto di klien (`expo-image-manipulator`) | Login, registrasi, profil pengguna, avatar yang berfungsi |
| `POST /predict` ke API lokal | E-commerce, keranjang, transaksi |
| Layar hasil: thumbnail, nama motif, skor, makna | Peta, GPS, lokasi toko |
| Katalog 6 motif (data statis) dengan kolom cari lokal | ML di perangkat (TensorFlow Lite, ONNX di HP) |
| Riwayat pindaian lokal | Chat, ulasan, fitur sosial |
| Halaman Bantuan dan panduan foto | Sinkronisasi cloud, backend baru, push notification |
| Penanganan error dan peringatan skor rendah | Mode terang/gelap ganda (cukup satu tema gelap sesuai Figma) |

**Catatan desain:** layar Scanner di Figma memiliki ikon profil bulat di pojok kanan atas. Karena login/profil out-of-scope, ikon itu **tidak diimplementasikan** (hilangkan, atau tampilkan sebagai hiasan tanpa aksi, sesuai keputusan pemilik).

---

## 4. Tech Stack dan Versi (Terkunci)

| Komponen | Versi / Keputusan |
| :-- | :-- |
| Expo SDK | **58** (`expo ~58.0.23`) |
| React Native | 0.88.1 |
| React | 19.3.0 |
| TypeScript | \~6.0.3 |
| Router | `expo-router ~58.0.30` (Tab + Stack) |
| Node.js | 26.x (minimal 22.13) |
| Perangkat uji | Android, Expo Go SDK 58 |
| Penyimpanan riwayat | `@react-native-async-storage/async-storage` (JSON, maksimal 50 entri) |
| Pilih foto | `expo-image-picker` |
| Kompres foto | `expo-image-manipulator` |
| Salin berkas | `expo-file-system` (API SDK 58; baca dokumentasinya) |
| HTTP | `fetch` bawaan dengan `AbortController` (tanpa axios) |
| Ikon | `@expo/vector-icons` (hanya Ionicons). `expo-symbols` tidak dipakai untuk ikon baru |

Paket bawaan template (`expo-glass-effect`, `@expo/ui`, dan sejenisnya) boleh dibiarkan, tetapi **tidak boleh dipakai** kecuali dibutuhkan desain.

---

## 5. Model ML dan Dataset (Fakta)

### 5.1 Model

- Arsitektur: MobileNetV2 transfer learning (bobot ImageNet), dua fase pelatihan.
- Input: gambar RGB 224x224, piksel mentah 0-255 (praproses sudah ada di dalam model).
- Output: 7 probabilitas softmax. **Urutan kelas (jangan diubah):**

`['Buketan', 'Jlamprang', 'Liong', 'Mega Mendung', 'Negatif', 'Singa Barong', 'Tujuh Rupa']`

### 5.2 Makna kelas Negatif

**Negatif = "motif di luar 6 motif yang dikenali"**, bukan "bukan batik". Isinya sebagian besar batik lain (misalnya Parang atau pola geometris) dan sedikit foto non-batik. UI **tidak boleh** menampilkan kata "Negatif" kepada pengguna. Tampilkan **"Motif tidak dikenali"**.

### 5.3 Hasil evaluasi (data uji, 369 gambar)

| Kelas | Recall |
| :-- | :-: |
| Buketan | 0,90 |
| Jlamprang | 0,86 |
| Liong | 0,76 |
| Mega Mendung | 0,98 |
| Negatif | 0,99 |
| Singa Barong | 0,96 |
| Tujuh Rupa | 1,00 |
| **Akurasi total** | **0,924** |

### 5.4 Keterbatasan yang diketahui (harus tercermin di UI dan laporan)

- Performa menurun pada foto di luar gaya dataset (ilustrasi digital, foto produk, pencahayaan sangat berbeda).
- Model bisa **yakin tetapi salah** (sering ke Negatif), sehingga peringatan skor rendah tidak menangkap semua kasus.
- Karena itu teks UI memakai istilah **"Kecocokan"**, bukan "Akurasi", dan Panduan Foto wajib mudah diakses.

---

## 6. Kontrak REST API (Final, Jangan Diubah)

### 6.1 Alamat dasar

- API berjalan di laptop pemilik: `http://<IPv4-laptop>:8000`.
- IP **berubah** tiap pindah jaringan/hotspot. Karena itu alamat dasar dibaca dari variabel lingkungan **`EXPO_PUBLIC_API_URL`** (berkas `.env`, tidak di-commit), dengan satu konstanta di `src/config/api.ts`. **Jangan menulis IP langsung di komponen.**
- Contoh `.env`: `EXPO_PUBLIC_API_URL=http://10.16.152.123:8000`
- Setelah `.env` diubah, Expo harus di-restart.

### 6.2 `GET /health`

Respons: `{"status": "ok"}`. Boleh dipakai Tab Bantuan untuk tombol "Cek koneksi server".

### 6.3 `POST /predict`

- `Content-Type`: `multipart/form-data`, field **`file`** (gambar JPEG).
- Batas ukuran unggahan server: 8 MB. Foto yang sudah dikompres jauh di bawah batas ini.

**Sukses (200), motif dikenali:**

```json
{
  "status": "success",
  "data": {
    "predicted_class": "Jlamprang",
    "confidence_score": 94.85,
    "confidence_decimal": 0.9485,
    "motif_details": {
      "name": "Batik Jlamprang",
      "origin": "Pekalongan (Krapyak)",
      "philosophy": "...",
      "characteristics": "..."
    }
  },
  "timestamp": "2026-11-05T10:00:00Z"
}
```

**Sukses (200), motif tidak dikenali:** `predicted_class` bernilai `"Negatif"`, dan `motif_details` berbentuk:

```json
{ "name": "Motif tidak dikenali", "origin": null, "philosophy": null, "characteristics": null }
```

**Error (400 atau 500):**

```json
{ "status": "error", "message": "Gambar tidak valid atau format file tidak didukung.", "code": 400 }
```

### 6.4 Tipe TypeScript (`src/types/api.ts`)

```ts
export type MotifDetails = {
  name: string;
  origin: string | null;
  philosophy: string | null;
  characteristics: string | null;
};

export type PredictSuccess = {
  status: 'success';
  data: {
    predicted_class: string;
    confidence_score: number;   // 0-100
    confidence_decimal: number; // 0-1
    motif_details: MotifDetails;
  };
  timestamp: string;
};

export type PredictError = { status: 'error'; message: string; code: number };
```

### 6.5 Aturan Klien

- Timeout **15 detik** (`AbortController`).
- Pengiriman: `FormData` dengan `{ uri, name: 'batik.jpg', type: 'image/jpeg' }` pada field `file`.
- Bungkus semua panggilan dengan `try/catch`; aplikasi **tidak boleh crash** saat jaringan putus.
- Teks loading: **"Menghubungkan ke Server..."** dengan activity indicator.

---

## 7. Data Motif (Katalog dan Hasil)

Sumber: `scantik-api/motif_data.json`. Salin ke `src/data/motifs.ts` **persis** seperti di bawah. Jangan menambah atau mengubah teks. Teks bersumber dari artikel populer dan jurnal; untuk laporan, pemilik akan melengkapi rujukan akademik.

| Kelas (kunci) | Nama | Asal | Filosofi | Ciri |
| :-- | :-- | :-- | :-- | :-- |
| Buketan | Batik Buketan | Pekalongan | Melambangkan kebahagiaan, kecantikan, kemurnian, dan keceriaan. | Rangkaian bunga yang sering dipadukan dengan burung; nama berasal dari kata Belanda 'boeket' dan menunjukkan pengaruh budaya Eropa. |
| Jlamprang | Batik Jlamprang | Pekalongan (Krapyak) | Motif geometris yang dipengaruhi oleh kebudayaan Arab dan India (Patola), melambangkan titik awal kehidupan dan keselarasan dengan Sang Pencipta. | Pola geometris berupa titik, bintang, dan segi delapan dengan warna-warni cerah. |
| Liong | Batik Liong | Pekalongan | Mencerminkan akulturasi budaya Tionghoa dalam batik pesisir Pekalongan. | Motif bergambar naga (liong), identik dengan budaya masyarakat Tionghoa. |
| Mega Mendung | Batik Mega Mendung | Cirebon | Awan melambangkan pembawa hujan dan rezeki; gradasi warna mewakili kesabaran serta kemampuan menyejukkan emosi. | Pola awan bergulung dengan garis miring dan gradasi warna hingga tujuh tingkat, umumnya biru atau merah; dipengaruhi akulturasi budaya Tionghoa. |
| Singa Barong | Batik Singa Barong | Cirebon | Perwujudan hewan mitologi yang melambangkan ketangguhan dan keperkasaan, serta menjadi simbol spiritual. | Hewan mitologi gabungan singa atau macan, gajah, naga, dan garuda, dengan belalai, lidah menjulur, dan sayap; termasuk motif keraton Cirebon. |
| Tujuh Rupa | Batik Tujuh Rupa | Pekalongan | Menggambarkan kekayaan alam Pekalongan serta kehidupan masyarakat pesisir yang mudah beradaptasi dengan budaya luar. | Motif hewan dan tumbuhan dengan warna cerah mencolok pada latar polos, dipengaruhi perpaduan budaya Tiongkok dan Indonesia. |

**Peringatan konten:**

- **Desain Figma memakai contoh motif Kawung dan Parang. Keduanya BUKAN bagian model dan TIDAK boleh muncul di aplikasi.** Katalog dan riwayat hanya berisi 6 motif di atas.
- Gambar contoh per motif harus disediakan pemilik (dari dataset atau sumber berlisensi). Sampai tersedia, pakai placeholder netral. Jangan mengunduh gambar dari internet.
- Arti nama "Tujuh Rupa" berbeda antar sumber, jadi jangan menulis penjelasan angka "tujuh".

---

## 8. Struktur Folder dan Rute

```
scantik-app/
├── .env                      # EXPO_PUBLIC_API_URL (tidak di-commit)
├── src/
│   ├── app/
│   │   ├── _layout.tsx       # Root Stack
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx   # Bottom Tab (4 tab)
│   │   │   ├── index.tsx     # Tab 1: Scanner
│   │   │   ├── catalog.tsx   # Tab 2: Katalog
│   │   │   ├── history.tsx   # Tab 3: Riwayat
│   │   │   └── help.tsx      # Tab 4: Help
│   │   └── result.tsx        # Layar hasil (Stack)
│   ├── components/           # Komponen UI bersama
│   ├── config/api.ts         # Alamat dasar API
│   ├── data/motifs.ts        # Data Bagian 7
│   ├── services/predict.ts   # Panggilan /predict
│   ├── storage/history.ts    # Baca/tulis riwayat
│   ├── theme/                # Warna, tipografi, jarak dari Figma
│   └── types/api.ts
```

- Hapus layar contoh template (`explore.tsx` dan komponen contoh) hanya pada milestone yang ditentukan (Bagian 12).
- **Urutan dan label tab (dari Figma):** Scanner, Katalog, Riwayat, Help.

---

## 9. Spesifikasi Layar (Mengikuti Figma)

Tema gelap dengan aksen emas dan tombol utama berwarna cokelat keemasan. Ambil nilai warna, ukuran huruf, radius, dan jarak **langsung dari Figma**, jangan menebak. Sebelum menulis UI, ekstrak token ke `src/theme/`.

### 9.1 Tab 1: Scanner (`index.tsx`)

- Sapaan kecil "Selamat datang," dan judul besar **ScanTik**.
- Kartu unggah bergaris putus-putus dengan ikon, teks "Unggah foto kain batik untuk mengenali motifnya.", dan keterangan "JPG / PNG · Maks. 10 MB".
- Tombol utama **"Pilih dari Galeri"**.
- Catatan kaki: "Foto Anda hanya digunakan untuk identifikasi."
- Alur: tombol ditekan, `launchImageLibraryAsync` (hanya gambar, tanpa editing), kompres/resize, tampilkan loading, `POST /predict`, navigasi ke `result`, simpan ke riwayat.
- Jika pengguna membatalkan pemilihan, tidak terjadi apa pun (tanpa error).
- Jika `fileSize` tersedia dan melebihi 10 MB, tampilkan `Alert`. Foto selalu dikompres sebelum dikirim.
- Tombol dinonaktifkan selama loading (cegah ketukan ganda).

### 9.2 Layar Hasil (`result.tsx`)

Tiga kondisi:

| Kondisi | Tampilan |
| :-- | :-- |
| **Dikenali**, skor >= 60 | Thumbnail, nama motif, **Kecocokan XX,X%**, asal, filosofi, ciri |
| **Dikenali**, skor < 60 | Seperti di atas ditambah peringatan: "Tingkat kemiripan rendah. Pastikan foto mengikuti panduan di Tab Bantuan." |
| **Tidak dikenali** (`Negatif`) | Thumbnail, judul "Motif tidak dikenali", penjelasan bahwa motif belum termasuk 6 motif yang dikenali, tautan ke Panduan Foto. Tanpa skor dan tanpa nama motif |

- Tombol "Pindai Lagi" kembali ke Scanner.
- Skor ditampilkan satu desimal dari `confidence_score`.

### 9.3 Tab 2: Katalog (`catalog.tsx`)

- Judul "Katalog Motif", kolom cari "Cari motif batik..." (filter lokal berdasarkan nama, tanpa ke server).
- Label seksi "Jelajahi motif" dengan jumlah motif (**6**).
- `FlatList` kartu: gambar, nama, ringkasan singkat (potongan filosofi atau ciri).
- Ketukan kartu membuka **modal detail**: nama, asal, filosofi, ciri.
- Kondisi kosong saat pencarian tidak cocok.

### 9.4 Tab 3: Riwayat (`history.tsx`)

- Judul "Riwayat Pindaian", subjudul "Jejak penemuan motif batik Anda.", seksi "Pindaian terbaru" dengan jumlah entri.
- Kartu: thumbnail, nama motif, lencana "Kecocokan XX%", waktu pindaian. Entri tidak dikenali menampilkan "Motif tidak dikenali" tanpa lencana skor.
- Ketukan entri membuka layar hasil dengan data tersimpan (tanpa memanggil API lagi).
- Tombol "Hapus Riwayat" dengan konfirmasi `Alert`.
- Kondisi kosong yang ramah.

### 9.5 Tab 4: Help (`help.tsx`)

Judul "Panduan Foto", subjudul "Kenali batik lebih akurat, dimulai dari foto yang tepat."

- **Cara yang Benar (Do's):** foto kain rata, cahaya terang dan merata, motif terlihat jelas; tegak lurus dari atas.
- **Hindari (Don'ts):** kain terlipat, gelap, atau buram menurunkan akurasi AI.
- Tiga aturan wajib: cahaya terang dan merata; kain rata (tidak terlipat atau kusut berlebih); foto tegak lurus yang menyorot pola utama.
- Bagian teknis: versi aplikasi, tombol "Cek koneksi server" (memanggil `/health`), dan petunjuk singkat jika gagal ("Pastikan HP dan laptop di jaringan yang sama dan server API berjalan").
- Gambar contoh Do/Don't disediakan pemilik; sebelum tersedia pakai placeholder.

---

## 10. Penyimpanan Lokal (Riwayat)

- Kunci AsyncStorage: `scantik.history.v1`. Isi: array JSON, entri terbaru di depan, **maksimal 50 entri** (hapus yang terlama).

```ts
export type HistoryItem = {
  id: string;              // unik
  createdAt: string;       // ISO 8601
  imageUri: string;        // salinan permanen di direktori dokumen aplikasi
  predictedClass: string;  // termasuk 'Negatif'
  confidenceScore: number; // 0-100
  motifName: string;
  origin: string | null;
  philosophy: string | null;
  characteristics: string | null;
};
```

- **Penting:** URI dari pemilih foto atau pengompres bersifat sementara (cache) dan bisa terhapus. Salin foto yang sudah dikompres ke direktori dokumen aplikasi (via `expo-file-system`, sesuai dokumentasi SDK 58) dan simpan URI salinannya. Saat "Hapus Riwayat", hapus juga berkas salinan.
- Pembacaan data rusak atau kosong tidak boleh membuat aplikasi crash (fallback ke daftar kosong).

---

## 11. Penanganan Error dan Kasus Tepi

| Situasi | Perilaku wajib |
| :-- | :-- |
| Server tidak terjangkau / internet putus | `Alert` ramah: "Tidak dapat terhubung ke server. Pastikan HP dan laptop di jaringan yang sama dan server API berjalan." Tidak crash |
| Timeout 15 detik | `Alert` serupa; loading berhenti; tombol aktif lagi |
| Respons 400 | Tampilkan `message` dari server dalam `Alert` |
| Respons 500 atau JSON tidak valid | Pesan umum "Terjadi kesalahan pada server" |
| Pengguna membatalkan galeri | Tidak ada tindakan |
| Izin galeri ditolak | `Alert` dengan arahan membuka pengaturan |
| Skor < 60% | Peringatan di layar hasil (Bagian 9.2) |
| `predicted_class` = `Negatif` | Kondisi "Motif tidak dikenali" |
| Riwayat kosong | Tampilan kosong yang ramah |
| Ketukan ganda tombol pindai | Dicegah selama loading |

Kompresi foto sebelum kirim: resize sisi terpanjang maksimal **1024 px**, kualitas JPEG **0,7**.

---

## 12. Rencana Kerja Bertahap (Milestone)

Satu milestone per sesi. Setiap milestone diakhiri laporan (Bagian 0.2) dan **berhenti menunggu persetujuan**.

| # | Milestone | Hasil yang bisa diuji |
| :-: | :-- | :-- |
| M1 | Rangka navigasi: struktur Bagian 8, 4 tab + `result`, tema dari Figma, hapus layar contoh template | Empat tab berpindah dengan benar di Expo Go; label dan urutan sesuai Figma |
| M2 | Data dan Katalog: `motifs.ts`, daftar kartu, pencarian, modal detail | 6 motif tampil, pencarian bekerja, modal menampilkan data yang benar |
| M3 | Help: panduan foto, versi aplikasi, tombol cek koneksi | Konten sesuai Figma; tombol cek server menampilkan hasil |
| M4 | Pemindai: pemilih galeri, kompres, `services/predict.ts`, loading, error, layar hasil (3 kondisi) | Foto dari galeri menghasilkan nama motif dan skor dari API lokal |
| M5 | Riwayat: simpan otomatis, daftar, buka ulang, hapus, empty state | Riwayat bertahan setelah aplikasi ditutup |
| M6 | Pemolesan: pesan error, kasus tepi Bagian 11, uji pada Android fisik | Seluruh kriteria Bagian 13 lulus |

---

## 13. Kriteria Penerimaan (Uji Demo)

1. Tombol "Pilih dari Galeri" membuka galeri Android; foto terpilih masuk ke aplikasi tanpa crash atau lonjakan memori.
2. Aplikasi memanggil API, membaca JSON, dan menampilkan **nama motif** dan **nilai kecocokan** di layar.
3. Foto motif dikenali tampil dengan data yang benar; foto `Negatif` tampil sebagai "Motif tidak dikenali".
4. Skor < 60% menampilkan peringatan.
5. Saat server mati atau jaringan putus, aplikasi menampilkan `Alert` dan tidak crash.
6. Riwayat tersimpan, dapat dibuka ulang, dan dapat dihapus.
7. Katalog menampilkan **hanya 6 motif nyata** (tanpa Kawung atau Parang) dan pencarian berfungsi.
8. Tidak ada fitur out-of-scope (Bagian 3).

---

## 14. Operasional Demo

- API dijalankan di laptop: `uvicorn app:app --host 0.0.0.0 --port 8000` (lingkungan virtual `scantik-api` aktif).
- HP dan laptop memakai **hotspot yang sama**, dan jaringan diatur **Private**. Jangan memakai Wi-Fi publik.
- Cek IPv4 laptop (`ipconfig`) setiap kali jaringan berubah, lalu perbarui `.env` dan restart Expo.
- Siapkan 3-5 foto uji yang sudah terbukti dikenali dan rekaman layar cadangan.

---

## 15. Risiko dan Keterbatasan

| Risiko | Dampak | Mitigasi |
| :-- | :-- | :-- |
| Foto di luar gaya dataset | Salah klasifikasi (sering ke Negatif) dengan skor tinggi | Panduan Foto mudah diakses; foto demo teruji; keterbatasan ditulis di laporan |
| IP laptop berubah | Aplikasi tidak terhubung | `.env`, tombol cek koneksi, cek `ipconfig` sebelum demo |
| Laptop mati atau tidur saat demo | API tidak tersedia | Colok charger, nonaktifkan sleep, siapkan rekaman cadangan |
| API tanpa login terbuka di jaringan lokal | Siapa pun di jaringan bisa memanggil | Hanya jaringan Private (hotspot sendiri); matikan server setelah demo |
| Sumber teks motif berupa artikel populer | Akurasi makna | Lengkapi rujukan akademik di laporan |
| Mega Mendung dan Singa Barong asal Cirebon | Berbeda dari klaim "motif Pekalongan" | Tulis asal dengan jujur; di laporan gunakan kerangka "batik pesisir utara Jawa" |

---

## 16. Ringkasan Larangan untuk Agent

- Jangan mengubah backend, kontrak API, urutan kelas model, atau teks motif.
- Jangan memunculkan Kawung, Parang, atau motif lain di luar 6 motif.
- Jangan menampilkan kata "Negatif" ke pengguna.
- Jangan menulis IP API langsung di kode.
- Jangan mengunduh gambar dari internet.
- Jangan menambah fitur, halaman, atau dependensi di luar dokumen ini tanpa persetujuan tertulis pemilik.
- Jangan melanjutkan ke milestone berikutnya tanpa perintah.

## 17. Keputusan Pemilik (Berlaku sebagai Bagian PRD)

- Ikon profil di Scanner **dihapus**.
- Placeholder gambar motif dan Help: kotak berwarna permukaan gelap dari tema
  dengan satu ikon expo-symbols netral. Tanpa gambar dari internet.
- Foto uji untuk demo disediakan pemilik, bukan fitur aplikasi.
- Teks motif di Bagian 7 final untuk implementasi.
- Bahan visual: docs/design/design-report.md (utama) dan docs/design/*.png.
  Jika bertentangan dengan tebakan agent, bahan ini yang berlaku.

  ## 18. Catatan Perubahan v2.1 (berlaku mengikat)

Status: M1 sampai M6.1 selesai dan diuji di HP Android. Tag v1.0.0.
Repositori: github.com/Bim44a/ScanTik (cabang main).

Penyimpangan dari isi di atas, yang berlaku:
- Ikon: @expo/vector-icons (Ionicons). expo-symbols tidak dipakai.
- Layar hasil menerima HANYA sessionId lewat rute. Uri foto dan data respons
  disimpan di src/state/scanSession.ts (memori). Jangan mengirimnya lewat
  parameter rute.
- Unggah foto memakai kelas File dari expo-file-system. Bentuk lama
  { uri, name, type } DITOLAK oleh fetch Expo SDK 58.
- Font: Poppins (judul) dan Open Sans (isi dan kontrol) dari paket
  @expo-google-fonts. Token tema ada di src/theme (colors.ts, typography.ts).
- Sumber desain: docs/design/design-report.md. Teks di bawah judul Scanner
  dihapus (hanya ada di dalam kartu unggah).
- Format waktu riwayat: "Hari ini, 14:30" (titik dua).
- Skor rendah: kartu peringatan memakai token tema yang ada, tanpa warna baru.
- Alamat API: EXPO_PUBLIC_API_URL di .env, harus disesuaikan dengan IP
  laptop pada jaringan yang dipakai. API saat ini berjalan di laptop pemilik
  (hotspot HP). Rencana: deploy ke Railway setelah desain final.

Aturan kerja tambahan untuk agent:
- Paket hanya dipasang oleh pemilik. Agent dilarang menyentuh package.json.
- Setiap laporan wajib menempelkan keluaran perintah (git status --short,
  git diff --stat, findstr). Laporan tanpa bukti ditolak.
- Setiap perubahan tampilan mengikuti design-report.md. Jangan mengarang
  warna, ukuran, atau teks.