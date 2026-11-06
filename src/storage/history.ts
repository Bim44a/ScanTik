/**
 * Penyimpanan riwayat pindaian dengan AsyncStorage dan expo-file-system.
 * Kunci: "scantik.history.v1", maksimal 50 entri (FIFO).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Directory, Paths } from 'expo-file-system';
import { HistoryItem } from '@/types/history';

const STORAGE_KEY = 'scantik.history.v1';
const MAX_HISTORY = 50;

/**
 * Direktori penyimpanan foto riwayat (permanen)
 */
function getHistoryDirectory(): Directory {
  return new Directory(Paths.document, 'history');
}

/**
 * Ambil daftar riwayat dari AsyncStorage.
 * @returns Array HistoryItem (terbaru di depan), atau [] jika kosong/rusak
 */
export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      if (__DEV__) console.warn('getHistory: no data, returning empty array');
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      if (__DEV__) console.warn('getHistory: parsed data is not an array', typeof parsed);
      return [];
    }
    if (__DEV__) console.warn('getHistory: loaded', parsed.length, 'entries');
    return parsed;
  } catch (error) {
    console.warn('Failed to load history:', error);
    return [];
  }
}

/**
 * Tambah entri riwayat baru.
 * - Salin foto ke direktori dokumen permanen
 * - Simpan HistoryItem dengan URI salinan
 * - Entri terbaru di depan
 * - Hapus entri terlama jika > 50 (termasuk berkas foto)
 *
 * @param sourceUri URI foto yang sudah dikompres (dari cache)
 * @param predictedClass predicted_class dari API (termasuk 'Negatif')
 * @param confidenceScore confidence_score dari API
 * @param motifDetails motif_details dari API (opsional, berisi name/origin/philosophy/characteristics)
 */
export async function addHistory(
  sourceUri: string,
  predictedClass: string,
  confidenceScore: number,
  motifDetails?: {
    name?: string;
    origin?: string | null;
    philosophy?: string | null;
    characteristics?: string | null;
  } | null
): Promise<void> {
  try {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    const historyDir = getHistoryDirectory();

    // Pastikan direktori ada
    if (!historyDir.exists) {
      historyDir.create({ intermediates: true });
    }

    // Generate nama file unik
    const extension = sourceUri.split('.').pop() || 'jpg';
    const fileName = `scan_${id}.${extension}`;
    const sourceFile = new File(sourceUri);
    const destFile = new File(historyDir, fileName);

    // Salin foto dari cache ke document directory
    await sourceFile.copy(destFile);

    // Tentukan motifName
    let motifName: string;
    let origin: string | null = null;
    let philosophy: string | null = null;
    let characteristics: string | null = null;

    if (predictedClass === 'Negatif') {
      motifName = 'Motif tidak dikenali';
    } else {
      motifName = motifDetails?.name || predictedClass;
    }

    if (motifDetails) {
      origin = motifDetails.origin ?? null;
      philosophy = motifDetails.philosophy ?? null;
      characteristics = motifDetails.characteristics ?? null;
    }

    // Buat HistoryItem sesuai PRD Bagian 10
    const newItem: HistoryItem = {
      id,
      createdAt,
      imageUri: destFile.uri,
      predictedClass,
      confidenceScore,
      motifName,
      origin,
      philosophy,
      characteristics,
    };

    // Ambil riwayat yang ada
    const history = await getHistory();

    // Tambahkan entri baru di depan
    const updatedHistory = [newItem, ...history];

    // Jika > 50, hapus entri terlama beserta berkas
    if (updatedHistory.length > MAX_HISTORY) {
      const removed = updatedHistory.splice(MAX_HISTORY);
      for (const item of removed) {
        try {
          const fileToDelete = new File(item.imageUri);
          if (fileToDelete.exists) {
            fileToDelete.delete();
          }
        } catch (err) {
          console.warn('Failed to delete old history file:', item.imageUri, err);
        }
      }
    }

    // Simpan ke AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    if (__DEV__) console.warn('addHistory: saved entry', id, 'total entries:', updatedHistory.length);
  } catch (error) {
    console.warn('Failed to add history:', error);
    // Jangan throw, biarkan aplikasi lanjut
  }
}

/**
 * Hapus semua riwayat dari AsyncStorage DAN hapus semua berkas foto.
 */
export async function clearHistory(): Promise<void> {
  try {
    const history = await getHistory();

    // Hapus semua berkas foto
    for (const item of history) {
      try {
        const file = new File(item.imageUri);
        if (file.exists) {
          file.delete();
        }
      } catch (err) {
        console.warn('Failed to delete history file:', item.imageUri, err);
      }
    }

    // Hapus direktori history jika masih ada
    try {
      const historyDir = getHistoryDirectory();
      if (historyDir.exists) {
        historyDir.delete();
      }
    } catch (err) {
      console.warn('Failed to delete history directory:', err);
    }

    // Kosongkan AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEY);
    if (__DEV__) console.warn('clearHistory: storage cleared');
  } catch (error) {
    console.warn('Failed to clear history:', error);
    throw error;
  }
}