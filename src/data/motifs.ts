export type Motif = {
  class: string;
  name: string;
  origin: string;
  philosophy: string;
  characteristics: string;
};

export const MOTIFS: Motif[] = [
  {
    class: 'Buketan',
    name: 'Batik Buketan',
    origin: 'Pekalongan',
    philosophy: 'Melambangkan kebahagiaan, kecantikan, kemurnian, dan keceriaan.',
    characteristics: "Rangkaian bunga yang sering dipadukan dengan burung; nama berasal dari kata Belanda 'boeket' dan menunjukkan pengaruh budaya Eropa.",
  },
  {
    class: 'Jlamprang',
    name: 'Batik Jlamprang',
    origin: 'Pekalongan (Krapyak)',
    philosophy: 'Motif geometris yang dipengaruhi oleh kebudayaan Arab dan India (Patola), melambangkan titik awal kehidupan dan keselarasan dengan Sang Pencipta.',
    characteristics: 'Pola geometris berupa titik, bintang, dan segi delapan dengan warna-warni cerah.',
  },
  {
    class: 'Liong',
    name: 'Batik Liong',
    origin: 'Pekalongan',
    philosophy: 'Mencerminkan akulturasi budaya Tionghoa dalam batik pesisir Pekalongan.',
    characteristics: 'Motif bergambar naga (liong), identik dengan budaya masyarakat Tionghoa.',
  },
  {
    class: 'Mega Mendung',
    name: 'Batik Mega Mendung',
    origin: 'Cirebon',
    philosophy: 'Awan melambangkan pembawa hujan dan rezeki; gradasi warna mewakili kesabaran serta kemampuan menyejukkan emosi.',
    characteristics: 'Pola awan bergulung dengan garis miring dan gradasi warna hingga tujuh tingkat, umumnya biru atau merah; dipengaruhi akulturasi budaya Tionghoa.',
  },
  {
    class: 'Singa Barong',
    name: 'Batik Singa Barong',
    origin: 'Cirebon',
    philosophy: 'Perwujudan hewan mitologi yang melambangkan ketangguhan dan keperkasaan, serta menjadi simbol spiritual.',
    characteristics: 'Hewan mitologi gabungan singa atau macan, gajah, naga, dan garuda, dengan belalai, lidah menjulur, dan sayap; termasuk motif keraton Cirebon.',
  },
  {
    class: 'Tujuh Rupa',
    name: 'Batik Tujuh Rupa',
    origin: 'Pekalongan',
    philosophy: 'Menggambarkan kekayaan alam Pekalongan serta kehidupan masyarakat pesisir yang mudah beradaptasi dengan budaya luar.',
    characteristics: 'Motif hewan dan tumbuhan dengan warna cerah mencolok pada latar polos, dipengaruhi perpaduan budaya Tiongkok dan Indonesia.',
  },
];

export function getMotifByClass(className: string): Motif | undefined {
  if (className === 'Negatif') {
    return undefined;
  }
  return MOTIFS.find((m) => m.class === className);
}
