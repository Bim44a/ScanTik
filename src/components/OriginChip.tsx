import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppIcon from '@/components/AppIcon';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

export interface OriginChipProps {
  origin: string;
}

/**
 * Chip asal motif sesuai design-report.md Bagian 4.
 * Tinggi 24, surfaceElevated, garis border, ikon pin accent, teks textSecondary 12.
 */
export default function OriginChip({ origin }: OriginChipProps) {
  return (
    <View style={styles.chip}>
      <AppIcon name="location-outline" size={12} color={Colors.accent} />
      <Text style={styles.text} numberOfLines={1}>
        {origin}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    ...Typography.cardBody,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
