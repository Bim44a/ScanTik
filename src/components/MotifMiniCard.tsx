import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Motif } from '@/data/motifs';
import { MOTIF_META, getRegion } from '@/data/motifMeta';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import SurfaceCard from './SurfaceCard';
import IconCircle from './IconCircle';

export interface MotifMiniCardProps {
  motif: Motif;
  disabled?: boolean;
  onPress: () => void;
}

/**
 * Kartu motif kecil untuk baris horizontal "Motif yang dikenali".
 */
export default function MotifMiniCard({
  motif,
  disabled = false,
  onPress,
}: MotifMiniCardProps) {
  const meta = MOTIF_META[motif.class];
  const region = getRegion(motif.origin);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, disabled && styles.dimmed]}
    >
      <SurfaceCard style={styles.card}>
        <IconCircle name={meta?.icon || 'help-outline'} size={48} iconSize={24} />
        <Text style={styles.name} numberOfLines={1}>
          {motif.name.replace(/^Batik\s+/, '')}
        </Text>
        <Text style={styles.region} numberOfLines={1}>
          {region}
        </Text>
      </SurfaceCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
  },
  dimmed: {
    opacity: 0.5,
  },
  card: {
    padding: 12,
    gap: 8,
  },
  name: {
    ...Typography.smallCardName,
    color: Colors.textPrimary,
  },
  region: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
  },
});
