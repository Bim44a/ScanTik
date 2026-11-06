/**
 * HistoryItem persis sesuai PRD Bagian 10.
 * Setiap entri riwayat pindaian batik yang disimpan secara lokal.
 */

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