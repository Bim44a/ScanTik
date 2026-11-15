import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { HistoryItem } from '@/types/history';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from './AppIcon';
import SurfaceCard from './SurfaceCard';
import MatchBadge from './MatchBadge';
import NeutralChip from './NeutralChip';

export interface RecentScanRowProps {
  item: HistoryItem;
  onPress: () => void;
}

/**
 * Baris ringkas entri pindaian terbaru di beranda Scanner.
 */
export default function RecentScanRow({ item, onPress }: RecentScanRowProps) {
  const isUnrecognized = item.motifName === 'Motif tidak dikenali';

  return (
    <Pressable onPress={onPress}>
      <SurfaceCard style={styles.card}>
        <Image
          source={{ uri: item.imageUri }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <Text style={styles.name} numberOfLines={1}>
          {item.motifName.replace(/^Batik\s+/, '')}
        </Text>
        {isUnrecognized ? (
          <NeutralChip />
        ) : (
          <MatchBadge score={item.confidenceScore} />
        )}
        <AppIcon
          name="chevron-forward"
          size={20}
          color={Colors.textSecondary}
        />
      </SurfaceCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
  },
  name: {
    flex: 1,
    ...Typography.cardName,
    color: Colors.textPrimary,
  },
});
