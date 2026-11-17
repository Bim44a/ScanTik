/**
 * Penyimpanan riwayat pindaian untuk web.
 *
 * Kunci dan urutan sama dengan versi native ("scantik.history.v1", terbaru di
 * depan). Karena localStorage browser terbatas (~5 MB), foto riwayat disimpan
 * sebagai data URL JPEG yang diperkecil (sisi terpanjang maksimal 640 px,
 * kualitas 0,6) dan jumlah entri dibatasi 20.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem } from '@/types/history';

const STORAGE_KEY = 'scantik.history.v1';
const MAX_HISTORY = 20;
const MAX_THUMB_SIDE = 640;
const THUMB_QUALITY = 0.6;

type DrawableImage = HTMLImageElement | ImageBitmap;

function loadWithImageElement(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error('Gambar tidak memiliki ukuran yang valid.'));
        return;
      }
      resolve(image);
    };
    image.onerror = () => reject(new Error('Gambar tidak dapat dimuat.'));
    image.src = uri;
  });
}

async function loadImage(uri: string): Promise<DrawableImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Gambar tidak dapat dibaca.');
      }
      const blob = await response.blob();
      return await createImageBitmap(blob, { imageOrientation: 'from-image' });
    } catch (error) {
      console.warn('createImageBitmap gagal, memakai HTMLImageElement:', error);
    }
  }

  return loadWithImageElement(uri);
}

function getImageSize(source: DrawableImage): { width: number; height: number } {
  const image = source as HTMLImageElement & ImageBitmap;
  return {
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
  };
}

/**
 * Ubah foto hasil kompresi menjadi data URL JPEG kecil agar dapat disimpan
 * permanen di localStorage dan tetap tampil setelah halaman dimuat ulang.
 */
async function createThumbnail(sourceUri: string): Promise<string> {
  const source = await loadImage(sourceUri);
  const { width, height } = getImageSize(source);

  if (!width || !height) {
    throw new Error('Gambar tidak memiliki ukuran yang valid.');
  }

  const scale = Math.min(1, MAX_THUMB_SIDE / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D tidak tersedia di browser.');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, targetWidth, targetHeight);

  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
    source.close();
  }

  const dataUrl = canvas.toDataURL('image/jpeg', THUMB_QUALITY);

  canvas.width = 0;
  canvas.height = 0;

  return dataUrl;
}

function isQuotaError(error: unknown): boolean {
  if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
    return (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22 ||
      error.code === 1014
    );
  }
  return error instanceof Error && /quota/i.test(error.message);
}

/**
 * Simpan riwayat. Jika kuota localStorage habis, entri terlama dibuang lalu
 * penyimpanan dicoba lagi. Kegagalan tidak pernah dilempar ke pemanggil agar
 * layar hasil tidak terhalang.
 */
async function persist(items: HistoryItem[]): Promise<void> {
  let pending = items;

  while (true) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
      return;
    } catch (error) {
      if (!isQuotaError(error)) {
        console.warn('Failed to save history:', error);
        return;
      }

      if (pending.length <= 1) {
        try {
          await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (removeError) {
          console.warn('Failed to remove history after quota error:', removeError);
        }
        console.warn('History quota exceeded: newest entry could not be saved');
        return;
      }

      pending = pending.slice(0, pending.length - 1);
      console.warn('History quota exceeded: dropping oldest entry and retrying');
    }
  }
}

/**
 * Ambil daftar riwayat dari AsyncStorage (localStorage di web).
 * @returns Array HistoryItem (terbaru di depan), atau [] jika kosong/rusak
 */
export async function getHistory(): Promise<HistoryItem[]> {
  if (typeof window === 'undefined') {
    return [];
  }

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
    return parsed as HistoryItem[];
  } catch (error) {
    console.warn('Failed to load history:', error);
    return [];
  }
}

/**
 * Tambah entri riwayat baru.
 * - Foto diubah menjadi data URL JPEG kecil (maks 640 px, kualitas 0,6)
 * - Entri terbaru di depan
 * - Hapus entri terlama jika > 20
 *
 * @param sourceUri URI foto yang sudah dikompres (blob URL dari prepareImage)
 * @param predictedClass predicted_class dari API (termasuk 'Negatif')
 * @param confidenceScore confidence_score dari API
 * @param motifDetails motif_details dari API (opsional)
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
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    let imageUri: string;
    try {
      imageUri = await createThumbnail(sourceUri);
    } catch (thumbnailError) {
      console.warn('Failed to create history thumbnail:', thumbnailError);
      imageUri = sourceUri;
    }

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
      imageUri,
      predictedClass,
      confidenceScore,
      motifName,
      origin,
      philosophy,
      characteristics,
    };

    // Ambil riwayat yang ada
    const history = await getHistory();

    // Tambahkan entri baru di depan, batasi 20 entri
    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY);

    await persist(updatedHistory);
    if (__DEV__) {
      console.warn('addHistory: saved entry', id, 'total entries:', updatedHistory.length);
    }
  } catch (error) {
    console.warn('Failed to add history:', error);
    // Jangan throw, biarkan aplikasi lanjut
  }
}

/**
 * Hapus semua riwayat dari AsyncStorage (localStorage di web).
 */
export async function clearHistory(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    if (__DEV__) console.warn('clearHistory: storage cleared');
  } catch (error) {
    console.warn('Failed to clear history:', error);
  }
}
