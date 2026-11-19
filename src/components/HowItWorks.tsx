import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { AppIconName } from './AppIcon';
import IconCircle from './IconCircle';
import SurfaceCard from './SurfaceCard';

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
            <View key={step.number} style={styles.row}>
              <View style={styles.timeline}>
                <IconCircle name={step.icon} size={40} iconSize={20} />
                {isLast ? null : <View style={styles.connector} />}
              </View>

              <View
                style={[styles.textColumn, !isLast && styles.textColumnSpacing]}
              >
                <Text style={styles.watermark}>{step.number}</Text>
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
    alignItems: 'stretch',
    gap: 12,
  },
  timeline: {
    width: 40,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  connector: {
    width: 2,
    flex: 1,
    marginTop: 8,
    backgroundColor: Colors.border,
  },
  textColumn: {
    flex: 1,
    paddingRight: 36,
    gap: 2,
  },
  textColumnSpacing: {
    marginBottom: 16,
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
  watermark: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontFamily: 'Poppins_700Bold',
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: 0,
    color: Colors.accentSoft,
  },
});
