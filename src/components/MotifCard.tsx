import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Motif } from '@/data/motifs';
import { MOTIF_META, getRegion } from '@/data/motifMeta';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import SurfaceCard from './SurfaceCard';
import OriginChip from './OriginChip';
import IconCircle from './IconCircle';

export interface MotifCardProps {
  motif: Motif;
  onPress: () => void;
}

/**
 * Kartu motif untuk grid Katalog.
 * Gambar placeholder 4:3, nama, OriginChip (kota), filosofi maks 2 baris.
 */
export default function MotifCard({ motif, onPress }: MotifCardProps) {
  const meta = MOTIF_META[motif.class];
  const region = getRegion(motif.origin);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <SurfaceCard style={styles.card}>
        {/* Placeholder Gambar 4:3 */}
        <View style={styles.imagePlaceholder}>
          <IconCircle name={meta?.icon || 'help-outline'} size={64} iconSize={28} />
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {motif.name}
          </Text>
          <OriginChip origin={region} />
          <Text style={styles.philosophy} numberOfLines={2}>
            {motif.philosophy}
          </Text>
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6, // Jarak antar kartu (total 12)
  },
  card: {
    padding: 8,
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  content: {
    gap: 6,
  },
  name: {
    ...Typography.smallCardName,
    color: Colors.textPrimary,
  },
  philosophy: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
});
