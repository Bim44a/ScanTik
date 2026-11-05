import { API_BASE_URL } from '@/config/api';

export type HealthCheckResult = {
  ok: true;
} | {
  ok: false;
  message: string;
};

export const getFriendlyErrorMessage = (error: unknown, status?: number): string => {
  if (status && status !== 200) {
    return 'Server menjawab dengan kesalahan. Coba lagi.';
  }
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'Server tidak merespons. Pastikan server API berjalan dan HP serta laptop di jaringan yang sama.';
    }
    // Generic network failure
    return 'Tidak dapat terhubung ke server. Periksa jaringan dan alamat server.';
  }
  return 'Terjadi kesalahan saat memeriksa koneksi';
};

export async function checkHealth(): Promise<HealthCheckResult> {
  if (!API_BASE_URL) {
    return {
      ok: false,
      message: 'Alamat server belum diatur',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { ok: true };
    }
    
    console.warn(`Health check failed with status: ${response.status}`);
    return {
      ok: false,
      message: getFriendlyErrorMessage(null, response.status),
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Health check error:', error);
    return {
      ok: false,
      message: getFriendlyErrorMessage(error),
    };
  }
}

