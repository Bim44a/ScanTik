import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { usePathname } from 'expo-router';
import Head from 'expo-router/head';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const DOCUMENT_TITLES: Record<string, string> = {
  '/': 'Scanner',
  '/catalog': 'Katalog',
  '/history': 'Riwayat',
  '/help': 'Help',
  '/result': 'Hasil',
};

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Lebar maksimum konten pada web. Default 1120 (tablet memakai 720). */
  maxWidth?: number;
}

export interface WebDocumentTitleProps {
  /** Label halaman. Bila kosong, ditentukan dari pathname saat ini. */
  title?: string;
}

function WebDocumentTitleInner({ title }: WebDocumentTitleProps) {
  const pathname = usePathname();
  const label = title ?? DOCUMENT_TITLES[pathname] ?? 'ScanTik';

  return (
    <Head>
      <title>{`${label} | ScanTik`}</title>
    </Head>
  );
}

/**
 * Judul dokumen browser per rute (khusus web).
 * Memakai `Head` resmi expo-router; di Android tidak merender apa pun.
 */
export function WebDocumentTitle({ title }: WebDocumentTitleProps) {
  if (Platform.OS !== 'web') {
    return null;
  }

  return <WebDocumentTitleInner title={title} />;
}

/**
 * Wadah konten web: lebar maksimum, rata tengah, padding horizontal 16/24/32.
 * Di Android/HP mengembalikan children apa adanya tanpa pembungkus baru.
 */
export default function ResponsiveContainer({
  children,
  style,
  maxWidth = 1120,
}: ResponsiveContainerProps) {
  const breakpoint = useBreakpoint();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const paddingHorizontal =
    breakpoint === 'mobile' ? 16 : breakpoint === 'tablet' ? 24 : 32;

  return (
    <View
      style={[
        styles.container,
        { maxWidth, paddingHorizontal },
        style,
      ]}
    >
      <WebDocumentTitle />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
});
