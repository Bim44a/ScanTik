import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon, { AppIconName } from './AppIcon';
import IconCircle from './IconCircle';
import SurfaceCard from './SurfaceCard';

export interface PhotoExampleCardProps {
  title: string;
  badgeLabel: string;
  badgeIcon: AppIconName;
  variant: 'accent' | 'neutral';
  caption: string;
  width: number;
}

/**
 * Kartu contoh foto (DO'S / DON'TS) untuk layar Help.
 * Placeholder gambar 4:3, tanpa foto dan tanpa bayangan.
 */
export default function PhotoExampleCard({
  title,
  badgeLabel,
  badgeIcon,
  variant,
  caption,
  width,
}: PhotoExampleCardProps) {
  const isAccent = variant === 'accent';

  return (
    <SurfaceCard style={[styles.card, { width }]}>
      <Text style={styles.title}>{title}</Text>

      <View
        style={[
          styles.badge,
          { borderColor: isAccent ? Colors.accent : Colors.border },
        ]}
      >
        <AppIcon
          name={badgeIcon}
          size={12}
          color={isAccent ? Colors.accent : Colors.textSecondary}
        />
        <Text
          style={[
            styles.badgeText,
            { color: isAccent ? Colors.accent : Colors.textSecondary },
          ]}
        >
          {badgeLabel}
        </Text>
      </View>

      <View style={styles.placeholder}>
        <IconCircle name="image-outline" size={48} iconSize={22} />
      </View>

      <Text style={styles.caption}>{caption}</Text>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    ...Typography.badgeSmall,
  },
  placeholder: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  caption: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
  },
});
