import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

export interface NeutralChipProps {
  label?: string;
}

/**
 * Chip netral "Tidak dikenali" sesuai design-report.md Bagian 4.
 * Tinggi 20, surfaceElevated, garis border.
 */
export default function NeutralChip({ label = 'Tidak dikenali' }: NeutralChipProps) {
  return (
    <Text style={styles.chip} numberOfLines={1}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  chip: {
    ...Typography.badgeSmall,
    color: Colors.textSecondary,
    height: 20,
    lineHeight: 20,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
});
