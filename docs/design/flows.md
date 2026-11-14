# Alur dan Interaksi ScanTik (v1.1)

Prinsip: setiap elemen yang tampak bisa ditekan punya tujuan jelas. Elemen
informasi TIDAK boleh tampak seperti tombol. Data besar tidak dikirim lewat
parameter rute (hanya id sederhana).

## 1. Peta Layar
- Tab: Scanner (index), Katalog (catalog), Riwayat (history), Help (help).
- Stack di atas tab: Hasil (result).
- Kode motif untuk rute: buketan, jlamprang, liong, mega-mendung,
  singa-barong, tujuh-rupa (huruf kecil, tanpa spasi).

## 2. Scanner (Beranda)
| Elemen | Aksi | Tujuan |
| Tombol "Pilih dari Galeri" | ketuk | galeri, kompres, loading, lalu Hasil |
| Zona unggah (putus-putus) | ketuk | SAMA dengan tombol |
| Cara kerja (3 langkah) | tidak ada | informasi, tanpa efek ketuk |
| Kartu motif ("Motif yang dikenali") | ketuk | tab Katalog, modal motif itu terbuka |
| "Lihat semua" (motif) | ketuk | tab Katalog |
| Kartu Tips foto | tidak ada | informasi |
| "Lihat panduan lengkap" | ketuk | tab Help |
| Baris "Pindaian terbaru" | ketuk | Hasil dengan data tersimpan |
| "Lihat semua" (riwayat) | ketuk | tab Riwayat |
Keadaan:
- Loading: tombol "Menghubungkan ke Server..." + indikator; tombol, zona
  unggah, dan kartu motif diredupkan dan tidak bisa diketuk.
- Riwayat kosong: bagian "Pindaian terbaru" diganti kartu "Belum ada
  pindaian" ("Pilih foto kain batik untuk memulai.") dan tombol "Pilih Foto"
  (sama dengan tombol utama).
- Gagal: Alert ramah (jaringan, timeout, server, izin galeri ditolak,
  alamat server belum diatur). Tombol aktif lagi.

## 3. Hasil
- Param rute: hanya sessionId. Data dari src/state/scanSession.
- Masuk dari Scanner (pindai baru) atau dari entri riwayat.
- Tombol kembali (header) ke layar asal.
- "Pindai Lagi": ke tab Scanner.
- Skor < 60: kartu peringatan + "Buka Panduan Foto" ke tab Help.
- Tidak dikenali: judul "Motif tidak dikenali", tanpa skor, tombol
  "Buka Panduan Foto" dan "Pindai Lagi". Kata "Negatif" tidak pernah tampil.
- Dikenali: tombol "Lihat di Katalog" ke tab Katalog, modal motif terbuka.
- Sesi tidak ada: "Hasil tidak tersedia." + tombol ke Scanner.
- Riwayat disimpan HANYA saat pindai baru, bukan saat membuka dari riwayat.

## 4. Katalog
- Ketuk kartu: modal detail (nama, asal, filosofi, ciri). Ditutup lewat
  tombol tutup, ketuk di luar, atau tombol kembali Android.
- Pencarian lokal; kosong: "Motif tidak ditemukan".
- Parameter motif=<kode> membuka modal langsung. Setelah ditutup, parameter
  dibersihkan agar modal tidak terbuka lagi saat layar fokus ulang.

## 5. Riwayat
- Ketuk entri: Hasil dengan data tersimpan (tanpa API, tanpa simpan ulang).
- "Hapus Riwayat": konfirmasi (Batal, Hapus), lalu kosong.
- Kosong: ajakan menuju tab Scanner.
- Daftar dimuat ulang setiap tab Riwayat fokus.

## 6. Help
- Baris "Status layanan": dicek otomatis saat tab Help fokus (memanggil
  checkHealth). Menunggu: "Memeriksa layanan...". Berhasil: titik hijau
  "Layanan siap". Gagal: titik abu-abu "Layanan tidak dapat dihubungi" dan
  tautan "Coba lagi". TIDAK ADA tombol "Cek koneksi server".
- Konten panduan tidak membuka layar lain.