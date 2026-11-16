import React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Lebar maksimum konten pada web. Default 1120 (tablet memakai 720). */
  maxWidth?: number;
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
