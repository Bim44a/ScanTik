import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';

export interface SurfaceCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Kartu permukaan: surface, garis 1 px border, radius 16, padding 12.
 * Tanpa bayangan sesuai design-report.md Bagian 1.
 */
export default function SurfaceCard({ children, style }: SurfaceCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 12,
  },
});
