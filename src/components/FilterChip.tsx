import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

export interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

/**
 * Chip filter sesuai design-report.md Bagian 4.
 * Tinggi 36, pill. Aktif: accentSoft, garis dan teks accent.
 * Nonaktif: garis border, teks textSecondary.
 */
export default function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
    >
      <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  chipInactive: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  text: {
    ...Typography.linkGold,
  },
  textActive: {
    color: Colors.accent,
  },
  textInactive: {
    color: Colors.textSecondary,
  },
});
