import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
} from 'react-native';
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
  photo?: ImageSourcePropType;
  onOpenPhoto?: () => void;
}

/**
 * Kartu contoh foto (DO'S / DON'TS) untuk layar Help.
 * Foto asli 4:3 dapat ditekan untuk pratinjau; tanpa foto memakai placeholder.
 */
export default function PhotoExampleCard({
  title,
  badgeLabel,
  badgeIcon,
  variant,
  caption,
  width,
  photo,
  onOpenPhoto,
}: PhotoExampleCardProps) {
  const isAccent = variant === 'accent';
  const photoAccessibilityLabel = isAccent
    ? 'Perbesar contoh foto yang benar'
    : 'Perbesar contoh foto yang dihindari';

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

      {photo ? (
        <Pressable
          onPress={onOpenPhoto}
          accessibilityRole="imagebutton"
          accessibilityLabel={photoAccessibilityLabel}
        >
          <Image source={photo} style={styles.photo} resizeMode="cover" />
        </Pressable>
      ) : (
        <View style={styles.placeholder}>
          <IconCircle name="image-outline" size={48} iconSize={22} />
        </View>
      )}

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
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  caption: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
  },
});
