import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightLabel?: string;
  onRightPress?: () => void;
}

/**
 * Judul seksi dengan subjudul opsional dan tautan kanan opsional.
 */
export default function SectionHeader({
  title,
  subtitle,
  rightLabel,
  onRightPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightLabel && onRightPress ? (
        <Pressable onPress={onRightPress} hitSlop={8} accessibilityRole="button">
          <Text style={styles.link}>{rightLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  link: {
    ...Typography.linkGold,
    color: Colors.accent,
  },
});
