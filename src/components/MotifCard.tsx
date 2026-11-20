import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Motif } from '@/data/motifs';
import { MOTIF_META, getRegion } from '@/data/motifMeta';
import { getMotifPhoto } from '@/data/motifPhotos';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import SurfaceCard from './SurfaceCard';
import OriginChip from './OriginChip';
import IconCircle from './IconCircle';

export interface MotifCardProps {
  motif: Motif;
  width: number;
  onPress: () => void;
}

/**
 * Kartu motif untuk grid Katalog.
 * Gambar placeholder 4:3, nama, OriginChip (kota), filosofi maks 2 baris.
 * Lebar kartu ditetapkan oleh pemanggil agar satu hasil tetap satu kolom.
 */
export default function MotifCard({ motif, width, onPress }: MotifCardProps) {
  const meta = MOTIF_META[motif.class];
  const region = getRegion(motif.origin);
  const photo = getMotifPhoto(meta?.slug);

  return (
    <Pressable onPress={onPress} style={[styles.container, { width }]}>
      <SurfaceCard style={styles.card}>
        {/* Foto motif 4:3, atau placeholder ikon bila foto belum tersedia */}
        {photo ? (
          <View style={styles.photoFrame}>
            <Image
              source={photo.source}
              style={[StyleSheet.absoluteFill, styles.image]}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <IconCircle name={meta?.icon || 'help-outline'} size={64} iconSize={28} />
          </View>
        )}

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
    // Lebar tetap diatur lewat prop width; tinggi mengikuti isi.
  },
  card: {
    padding: 8,
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
  photoFrame: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
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
