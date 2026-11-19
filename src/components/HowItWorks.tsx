import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { AppIconName } from './AppIcon';
import IconCircle from './IconCircle';
import SurfaceCard from './SurfaceCard';

const ICON_SIZE = 40;

interface Step {
  number: string;
  title: string;
  description: string;
  icon: AppIconName;
}

const STEPS: Step[] = [
  {
    number: '1',
    title: 'Pilih foto',
    description: 'Unggah foto kain batik dari galeri.',
    icon: 'images-outline',
  },
  {
    number: '2',
    title: 'Analisis',
    description: 'Model AI mengenali pola motif dari foto Anda.',
    icon: 'sparkles-outline',
  },
  {
    number: '3',
    title: 'Kenali motif',
    description: 'Lihat nama motif, tingkat kecocokan, dan maknanya.',
    icon: 'ribbon-outline',
  },
];

/**
 * Bagian "Cara kerja": lini masa vertikal tiga langkah dalam satu kartu.
 * Informasi saja, tidak dapat diketuk.
 */
export default function HowItWorks() {
  return (
    <View>
      <Text style={styles.title}>Cara kerja</Text>
      <SurfaceCard style={styles.card}>
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;

          return (
            <View
              key={step.number}
              style={[styles.row, !isLast && styles.rowMinHeight]}
            >
              {isLast ? null : <View style={styles.connector} />}

              <View style={styles.timeline}>
                <IconCircle
                  name={step.icon}
                  size={ICON_SIZE}
                  iconSize={20}
                />
              </View>

              <View style={styles.textColumn}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.description}</Text>
              </View>
            </View>
          );
        })}
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
  },
  card: {
    marginTop: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  rowMinHeight: {
    minHeight: 76,
  },
  timeline: {
    width: ICON_SIZE,
    alignItems: 'center',
  },
  connector: {
    position: 'absolute',
    left: ICON_SIZE / 2 - 1,
    top: ICON_SIZE,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.border,
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  stepBody: {
    ...Typography.cardBody,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
