import { API_BASE_URL } from '@/config/api';

export type HealthCheckResult = {
  ok: true;
} | {
  ok: false;
  message: string;
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
    } else {
      return {
        ok: false,
        message: `Server error: ${response.status}`,
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          ok: false,
          message: 'Koneksi timeout (15 detik)',
        };
      }
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: false,
      message: 'Terjadi kesalahan saat memeriksa koneksi',
    };
  }
}
