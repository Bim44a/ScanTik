/**
 * Penyimpanan sesi pindai di memori (tidak persisten).
 * Menyimpan hasil pindai terakhir dengan ID unik.
 */

type ScanSession = {
  id: string;
  uri: string;
  response: any;
};

let currentSession: ScanSession | null = null;

/**
 * Simpan hasil pindai saat ini
 */
export function setScanSession(id: string, uri: string, response: any) {
  currentSession = { id, uri, response };
}

/**
 * Ambil hasil pindai dengan ID
 */
export function getScanSession(id: string): ScanSession | null {
  if (currentSession && currentSession.id === id) {
    return currentSession;
  }
  return null;
}

/**
 * Hapus sesi pindai saat ini
 */
export function clearScanSession() {
  currentSession = null;
}
