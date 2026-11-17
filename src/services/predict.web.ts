import { API_BASE_URL } from '@/config/api';
import { PredictSuccess } from '@/types/api';
import { getFriendlyErrorMessage } from './health';

export type PredictResult =
  | { ok: true; data: PredictSuccess['data'] }
  | { ok: false; message: string };

/**
 * Mengirim gambar ke endpoint /predict dari browser.
 * Blob diambil dari object URL hasil prepareImage, lalu dikirim sebagai
 * multipart/form-data tanpa mengatur header Content-Type secara manual.
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
    const imageResponse = await fetch(uri);
    if (!imageResponse.ok) {
      clearTimeout(timeoutId);
      return {
        ok: false,
        message: 'Gambar tidak dapat dibaca. Coba pilih foto lain.',
      };
    }

    const blob = await imageResponse.blob();
    const formData = new FormData();
    formData.append('file', blob, 'batik.jpg');

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
    console.warn('Predict error (web):', error);

    return {
      ok: false,
      message: getFriendlyErrorMessage(error),
    };
  }
}
