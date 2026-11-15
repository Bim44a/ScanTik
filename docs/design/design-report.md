# Spesifikasi Desain ScanTik v2.0

## 0. Aturan
- Sumber kebenaran visual: gambar docs/design/v2/*.png DAN dokumen ini.
  Jika bertentangan, bagian 7 (pengecualian) menang, lalu gambar, lalu angka (~).
- Data pada gambar (angka, foto, nama) hanya contoh. Data nyata dari aplikasi.
- Tanpa foto motif: pakai placeholder (kotak gelap + ikon dalam lingkaran).
- Tanpa warna, font, atau ikon di luar dokumen ini. Tanpa paket baru.
  Animasi dan lembar bawah memakai komponen React Native bawaan (Modal, Animated).
- Teks UI persis seperti gambar kecuali dinyatakan lain.

## 1. Warna (token)
background #161311 | surface #1D1814 | surfaceElevated #241F1C
border #3A312B | accent #D4AF37 | accentSoft rgba(212,175,55,0.12)
textPrimary #F4EBD9 | textSecondary #A39893
buttonPrimary #6B4423 | onButton #FFFFFF | onBadge #161311
Garis putus-putus zona unggah: #6B4423, 1 px, pola 6 garis 5 jeda.
Kedalaman: lapisan warna dan garis tepi 1 px border. TANPA bayangan.

## 2. Tipografi
Poppins: Bold 36/45 (wordmark, tracking -1.3) | Bold 28/40 (judul layar,
tracking -0.6) | Bold 24 (nama motif di detail) | SemiBold 17/24 (judul seksi)
| SemiBold 15/23 (judul kartu) | SemiBold 13 (nama di kartu kecil).
Open Sans: Regular 14/21 (isi detail) | Regular 13 (sapaan, subjudul) |
Regular 12/18 (isi kartu, waktu, tautan kecil) | Regular 11 (label tab,
metadata) | SemiBold 15 (label tombol) | SemiBold 13 (tautan emas) |
SemiBold 11 (lencana) | Bold 11 (label tab aktif).

## 3. Jarak dan bentuk (~)
Margin horizontal layar 16. Jarak antar seksi 24. Jarak antar kartu 12.
Radius: kartu 16, kartu besar dan lembar bawah 24, tombol 12, kolom cari 16,
chip dan lencana pill. Tinggi: tombol 52, kolom cari 48, chip filter 36,
lencana 20, tab bar 64 + safe area bawah.

## 4. Komponen
- Tombol utama: buttonPrimary, teks onButton, tinggi 52, radius 12.
- Tombol sekunder: transparan, garis 1 px accent, teks accent.
- Lencana "Kecocokan 94%": tinggi 20, padding horizontal 8, pill,
  latar accent, teks onBadge Open Sans SemiBold 11. Format angka: koma
  desimal, satu desimal pada layar Hasil (94,9%), bulat tidak perlu di daftar
  bila datanya bulat; gunakan satu desimal agar konsisten (94,9%).
- Chip asal: tinggi 24, surfaceElevated, garis border, ikon pin accent,
  teks textSecondary 12.
- Chip netral "Tidak dikenali": tinggi 20, surfaceElevated, garis border.
- Chip filter: tinggi 36, pill. Aktif: latar accentSoft, garis dan teks accent.
  Nonaktif: garis border, teks textSecondary. Ketiganya harus muat tanpa
  terpotong.
- Kartu: surface, garis 1 px border, padding 12 sampai 20.
- Ikon dalam lingkaran: lingkaran accentSoft, ikon accent.
- Tab bar: 4 tab, latar background, garis atas border. Aktif: ikon dan label
  accent, label Bold. Nonaktif: textSecondary, Regular.

## 5. Peta ikon (Ionicons; tsc memvalidasi nama)
Tab: Scanner scan-outline/scan | Katalog grid-outline/grid |
Riwayat time-outline/time | Help help-circle-outline/help-circle.
Zona unggah: image-outline. Cari: search-outline. Panah kartu: chevron-forward.
Pin asal: location-outline. Centang: checkmark. Silang: close.
Info: information-circle-outline. Kosong riwayat: time-outline.
Motif: Jlamprang flower-outline | Buketan leaf-outline | Liong flame-outline |
Mega Mendung cloud-outline | Singa Barong paw-outline |
Tujuh Rupa color-palette-outline.
Jika sebuah nama ditolak tipe, pilih Ionicons sepadan dan LAPORKAN.

## 6. Layar (ringkas; detail pada gambar dan flows.md)
- Scanner: header (sapaan, wordmark, tagline), kartu aksi (zona unggah +
  tombol + catatan), "Cara kerja" 3 langkah, "Motif yang dikenali" (baris
  geser, tautan Lihat semua), "Tips foto" (tautan ke Help), "Pindaian terbaru"
  (maks 3, tautan Lihat semua; kosong: kartu ajakan).
- Katalog: judul, subjudul, kolom cari, chip filter, "N motif", grid 2 kolom,
  lembar bawah detail (hero placeholder, nama, chip asal, Filosofi, Ciri,
  tombol Tutup).
- Riwayat: judul, subjudul, "Pindaian terbaru" + jumlah, tautan Hapus
  Riwayat, kelompok waktu (Hari ini, Kemarin, Lebih lama), kartu entri
  (thumbnail 64, nama, baris kedua lencana + waktu, panah). Kosong: ikon,
  judul, teks, tombol "Mulai Pindai".
- Help: label "PUSAT BANTUAN", judul, subjudul, dua kartu Do's/Don'ts,
  "Tiga Aturan Wajib", "Informasi" (Status layanan dengan titik, Versi).
  Titik status: accent untuk "Layanan siap", textSecondary untuk gagal.
- Hasil: TIDAK diubah, selain tombol sekunder "Lihat di Katalog".

## 7. Pengecualian terhadap gambar (dokumen ini menang)
1. Lencana di daftar: ukuran ramping bagian 4 (gambar masih besar).
2. Ikon tab Katalog: grid (gambar Scanner masih memakai buku).
3. Bayangan di bawah chip "DO'S" pada gambar: abaikan.
4. Waktu entri riwayat: format "14:30" di samping lencana, bukan di tepi kanan.
5. Asal motif dari data, bukan gambar (Mega Mendung dan Singa Barong: Cirebon).