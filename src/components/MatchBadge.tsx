import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

export interface MatchBadgeProps {
  score: number;
}

/**
 * Lencana "Kecocokan 94,9%" sesuai design-report.md Bagian 4.
 * Tinggi 20, pill, latar accent, teks onBadge Open Sans SemiBold 11.
 */
export default function MatchBadge({ score }: MatchBadgeProps) {
  const formatted = score.toFixed(1).replace('.', ',');
  return <Text style={styles.badge}>Kecocokan {formatted}%</Text>;
}

const styles = StyleSheet.create({
  badge: {
    ...Typography.badgeSmall,
    color: Colors.onBadge,
    height: 20,
    lineHeight: 20,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    overflow: 'hidden',
  },
});
