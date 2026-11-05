import { API_BASE_URL } from '@/config/api';
import { PredictSuccess, PredictError } from '@/types/api';
import { getFriendlyErrorMessage } from './health';
import { File, Paths } from 'expo-file-system';

export type PredictResult =
  | { ok: true; data: PredictSuccess['data'] }
  | { ok: false; message: string };

/**
 * Mengirim gambar ke endpoint /predict dan mengembalikan hasil prediksi.
 * @param uri URI gambar JPEG yang sudah dikompres (file:// atau content://)
 * @returns { ok: true, data } atau { ok: false, message }
 */
export async function predictImage(uri: string): Promise<PredictResult> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      message: 'Alamat server belum diatur',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    // Buat File instance dari URI yang sudah dikompres
    // File dari expo-file-system implements Blob interface, kompatibel dengan expo/fetch
    const file = new File(uri);

    // FormData dengan File dari expo-file-system (WinterCG-compliant)
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 200) {
      const json = await response.json();
      
      // Validasi struktur respons sukses
      if (json.status === 'success' && json.data) {
        return { ok: true, data: json.data };
      }
      
      // JSON tidak sesuai format
      console.warn('Invalid success response structure:', json);
      return {
        ok: false,
        message: 'Terjadi kesalahan pada server.',
      };
    }

    if (response.status === 400) {
      // Error dari validasi server
      const json = await response.json();
      return {
        ok: false,
        message: json.message || 'Gambar tidak valid.',
      };
    }

    if (response.status >= 500) {
      console.warn(`Server error: ${response.status}`);
      return {
        ok: false,
        message: 'Terjadi kesalahan pada server.',
      };
    }

    // Status code lain
    console.warn(`Unexpected status: ${response.status}`);
    return {
      ok: false,
      message: getFriendlyErrorMessage(null, response.status),
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Predict error:', error);
    
    return {
      ok: false,
      message: getFriendlyErrorMessage(error),
    };
  }
}
