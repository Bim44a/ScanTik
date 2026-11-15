import { HistoryItem } from '@/types/history';
import { setScanSession } from '@/state/scanSession';
import { router } from 'expo-router';

/**
 * Membuka layar Hasil dari entri riwayat yang tersimpan.
 * Tidak memanggil API dan tidak menyimpan ulang.
 * Logika sama dengan history.tsx.
 */
export function openHistoryItem(item: HistoryItem): void {
  const responseData = {
    predicted_class: item.predictedClass,
    confidence_score: item.confidenceScore,
    motif_details: {
      name: item.motifName,
      origin: item.origin,
      philosophy: item.philosophy,
      characteristics: item.characteristics,
    },
  };

  setScanSession(item.id, item.imageUri, responseData);
  router.push({ pathname: '/result', params: { sessionId: item.id } });
}
