## 1. Color Palette (HEX)

| Elemen | Warna | Keterangan |
|---|---|---|
| Latar halaman | `#161311` | Hitam kecokelatan; konsisten pada keempat halaman |
| Isi kartu unggah | `#1D1814` | Sedikit lebih terang dari latar halaman |
| Garis putus-putus kartu unggah | `#6B4423` | Cokelat; tebal 1 px, pola 6 px garis / 5 px jeda |
| Isi tombol "Pilih dari Galeri" | `#6B4423` | Sama dengan warna garis kartu unggah |
| Teks "Pilih dari Galeri" | `#FFFFFF` | Putih |
| Tulisan "ScanTik" | `#D4AF37` | Emas; juga untuk status aktif dan lencana |
| Teks "Selamat datang," | `#A39893` | Abu-abu hangat |
| Teks sekunder ("JPG / PNG", "Maks. 10 MB") | `#A39893` | Sama dengan deskripsi kartu dan label tab nonaktif |
| Isi kartu motif di Katalog | `#241F1C` | Cokelat gelap sebagai permukaan kartu |
| Isi lencana "Kecocokan 94%" | `#D4AF37` | Emas |
| Teks lencana "Kecocokan 94%" | `#161311` | Sama dengan latar halaman |
| Ikon tab aktif | `#D4AF37` | Emas |
| Ikon tab nonaktif | `#A39893` | Abu-abu hangat |
| Teks utama / judul | `#F4EBD9` | Cream |
| Garis pemisah navigasi bawah | `#3A312B` | Cokelat gelap |

Semua warna utama menggunakan opacity 100%.

### Karakter palet

Latar hitam hangat, permukaan cokelat gelap, teks cream, dan aksen emas. Tombol utama memakai cokelat, sedangkan emas menonjolkan identitas merek, status aktif, dan hasil kecocokan. Gunakan nilai hex `#D4AF37` untuk aksen emas, bukan hanya istilah "Champagne Gold".

## 2. Typography

Ukuran dalam px. *Line height* adalah tinggi baris; *letter spacing* adalah jarak antarhuruf.

| Peran / contoh | Font | Weight | Ukuran | Line height | Letter spacing | Warna |
|---|---|---|---:|---:|---:|---|
| Wordmark "ScanTik" | Poppins | Bold 700 | 36 | 125% (45 px) | -1,3 px | `#D4AF37` |
| Judul layar "Katalog Motif" | Poppins | Bold 700 | 28 | 40 px | -0,6 px | `#F4EBD9` |
| Judul kartu "Motif Jlamprang" | Poppins | SemiBold 600 | 15 | 23 px | 0 | `#F4EBD9` |
| Isi kartu "Geometri pesisir dengan..." | Open Sans | Regular 400 | 12 | 18 px | 0 | `#A39893` |
| Sapaan "Selamat datang," | Open Sans | Regular 400 | 13 | Auto | 0 | `#A39893` |
| Label tombol "Pilih dari Galeri" | Open Sans | SemiBold 600 | 15 | Auto | 0 | `#FFFFFF` |
| Label tab "Scanner" (aktif) | Open Sans | Bold 700 | 11 | Auto | 0 | `#D4AF37` |
| Label tab "Scanner" (nonaktif) | Open Sans | Regular 400 | 11 | Auto | 0 | `#A39893` |
| Lencana "Kecocokan 94%" | Open Sans | SemiBold 600 | 11 | 16 px | 0 | `#161311` |

### Detail tambahan

- Judul "Motif Jlamprang" konsisten di Katalog dan Riwayat: Poppins SemiBold, 15/23 px.
- Deskripsi kartu Katalog memakai 12/18 px (line height 150%).
- Metadata "JPG / PNG" dan "Maks. 10 MB": Open Sans Regular 11 px, line height Auto.
- Instruksi unggah: Open Sans Regular 15 px, line height 165% (sekitar 24,75 px), rata tengah.
- Semua teks memakai kapitalisasi sesuai aslinya, tanpa italic, underline, atau strikethrough.
- Label tombol dan tab berada di tengah komponen melalui tata letak, walau properti perataan teksnya kiri.
- "Auto" berarti tinggi baris mengikuti metrik font. Sebagai pembanding, tinggi kotak teks sapaan 18 px, label tombol 20 px, dan label tab 15 px.

## 3. Temuan Konsistensi Antarhalaman

### Yang sudah konsisten

- Latar halaman `#161311`.
- Permukaan kartu utama `#241F1C`.
- Teks utama cream, teks sekunder abu-abu hangat, aksen emas.
- Pembagian font: Poppins untuk identitas/judul, Open Sans untuk informasi dan kontrol.
- Pada tiga halaman utama, tab aktif memakai emas + Bold 700, tab nonaktif memakai abu-abu + Regular 400.

### Yang masih berbeda

**1. Bahasa label tab belum seragam**

| Halaman (node) | Label navigasi saat ini |
|---|---|
| Scanner (1:135) | Scanner, Catalog, History, Help |
| Katalog (1:67) | Scanner, Katalog, History, Help |
| Riwayat (1:2) | Scanner, Katalog, Riwayat, Help |
| Panduan Foto (3:78) | Scanner, Katalog, Riwayat, Help |

**2. Ketebalan tab di halaman Panduan Foto tidak sesuai statusnya**

- "Help" sudah berwarna emas, tetapi teksnya masih Regular 400.
- "Riwayat" berwarna nonaktif, tetapi teksnya masih Bold 700.

Warna status aktif sudah menunjuk Help, tetapi ketebalan teks belum mengikuti pola tiga halaman utama.

## 4. Keterbacaan Warna

| Pasangan | Rasio kontras | Penilaian |
|---|---:|---|
| Teks cream / latar halaman | 15,62:1 | Memenuhi WCAG AAA (teks normal) |
| Teks sekunder / latar halaman | 6,58:1 | Memenuhi WCAG AA |
| Teks sekunder / kartu Katalog | 5,80:1 | Memenuhi WCAG AA |
| Teks sekunder / kartu unggah | 6,26:1 | Memenuhi WCAG AA |
| Teks putih / tombol cokelat | 8,48:1 | Memenuhi WCAG AAA |
| Teks gelap / lencana emas | 8,80:1 | Memenuhi WCAG AAA |
| Emas / latar halaman | 8,80:1 | Kontras kuat untuk tab aktif |
| Garis putus-putus / isi kartu unggah | 2,08:1 | Di bawah 3:1 jika garis menjadi penanda batas kontrol yang wajib terlihat |

**Kesimpulan:** kontras teks secara umum sudah baik. Area yang perlu perhatian:

- Garis batas unggah yang cukup samar.
- Ukuran teks kecil 11-12 px.
- Konsistensi bahasa dan ketebalan status tab.

Rasio warna saja belum memastikan aksesibilitas keseluruhan; keterbacaan tetap perlu dinilai pada ukuran ponsel sebenarnya.
