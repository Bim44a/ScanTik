# Spesifikasi Tampilan Web (v1)

Aturan emas:
- Tampilan Android/HP TIDAK BOLEH berubah. Semua perubahan hanya berlaku
  jika Platform.OS === 'web'.
- Tanpa logika baru, tanpa paket baru. Hanya tata letak.

## 1. Titik lebar (hanya web)
mobile < 768 | tablet 768 sampai 1023 | desktop >= 1024.
Hook useBreakpoint() mengembalikan 'mobile' | 'tablet' | 'desktop'
(useWindowDimensions).

## 2. Wadah
Konten maksimum 1120 px, rata tengah. Padding horizontal: mobile 16,
tablet 24, desktop 32. Tidak boleh ada gulir horizontal pada lebar 320 sampai
1920. Semua gambar mengikuti aturan baku gambar (pembungkus ukuran tetap
dengan batas lebar maksimum).

## 3. Navigasi
- mobile dan tablet: tab bar bawah seperti sekarang (pada tablet konten tetap
  maksimum 720 px, rata tengah).
- desktop: tab bar bawah DISEMBUNYIKAN; sidebar kiri lebar 240: wordmark
  "ScanTik" (emas) di atas, empat menu vertikal (ikon + label: Scanner,
  Katalog, Riwayat, Help), item aktif berlatar accentSoft dengan ikon dan
  teks emas, garis kanan 1 px border. Periksa dokumentasi SDK 58: opsi
  tabBarPosition: 'left' pada Tabs; jika tidak memadai, buat sidebar kustom.

## 4. Layar
- Scanner desktop: dua kolom. Kiri (lebar sekitar 58%): header, kartu aksi,
  "Cara kerja". Kanan (sisa): "Pindaian terbaru" dan "Tips foto".
  Di bawah, selebar penuh: "Motif yang dikenali" sebagai grid 3 kolom
  (bukan baris geser). Tablet: satu kolom, "Motif yang dikenali" grid 3 kolom.
- Katalog: grid mobile 2, tablet 3, desktop 3 kolom. Lembar detail pada
  tablet dan desktop berupa dialog tengah (lebar maksimum 560, sudut 24)
  menggantikan lembar bawah.
- Riwayat: mobile satu kolom; tablet dan desktop grid 2 kolom kartu.
- Help: konten maksimum 960 px; dua kartu contoh tetap berdampingan dan lebih
  besar; pada desktop seksi "Tiga Aturan Wajib" dan "Informasi" berdampingan.
- Hasil: desktop dua kolom: foto kiri (persegi, maksimum 480), detail dan
  tombol kanan. Tablet dan mobile satu kolom.
- Pratinjau gambar (ImageLightbox): gambar utuh, lebar maksimum 90% layar.

## 5. Pengujian (browser, mode responsif)
Lebar 360, 768, 1024, 1440, 1920. Tidak ada gulir horizontal; gambar tidak
meluap; tab bar bawah hanya pada lebar < 1024; sidebar hanya >= 1024.