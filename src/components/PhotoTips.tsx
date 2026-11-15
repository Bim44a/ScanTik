import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from './AppIcon';
import SurfaceCard from './SurfaceCard';
import SectionHeader from './SectionHeader';

export interface PhotoTipsProps {
  onOpenHelp: () => void;
}

const TIPS: string[] = [
  'Cahaya terang dan merata',
  'Kain rata, tidak terlipat',
  'Foto tegak lurus',
];

/**
 * Bagian "Tips foto": tiga baris centang dan tautan ke panduan Help.
 */
export default function PhotoTips({ onOpenHelp }: PhotoTipsProps) {
  return (
    <View>
      <SectionHeader title="Tips foto" />
      <SurfaceCard style={styles.card}>
        {TIPS.map((tip) => (
          <View key={tip} style={styles.row}>
            <AppIcon name="checkmark" size={16} color={Colors.accent} />
            <Text style={styles.text}>{tip}</Text>
          </View>
        ))}
        <Pressable onPress={onOpenHelp} hitSlop={8} style={styles.linkButton}>
          <Text style={styles.link}>Lihat panduan lengkap</Text>
        </Pressable>
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    ...Typography.cardBody,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  linkButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  link: {
    ...Typography.linkGold,
    color: Colors.accent,
  },
});
