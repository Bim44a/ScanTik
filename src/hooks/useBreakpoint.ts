import { Platform, useWindowDimensions } from 'react-native';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Titik lebar web: mobile < 768, tablet 768-1023, desktop >= 1024.
 * Di luar web selalu 'mobile' agar tampilan Android/HP tidak berubah.
 */
export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') return 'mobile';
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}
