import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon, { AppIconName } from './AppIcon';
import IconCircle from './IconCircle';
import { useBreakpoint } from '@/hooks/useBreakpoint';

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
    description: 'Unggah foto kain batik dari galeri atau berkas.',
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
 * Bagian "Cara kerja" versi web: tiga kartu langkah dengan angka besar
 * sebagai tanda air. Informasi saja, tidak dapat diketuk.
 * Lebar >= 768: tiga kartu sejajar; lebih sempit: kartu bertumpuk.
 */
export default function HowItWorksWeb() {
  const breakpoint = useBreakpoint();
  const isWide = breakpoint !== 'mobile';

  return (
    <View>
      <Text style={styles.title}>Cara kerja</Text>
      <View style={[styles.steps, isWide ? styles.stepsRow : styles.stepsColumn]}>
        {STEPS.map((step, index) => (
          <React.Fragment key={step.number}>
            {isWide && index > 0 ? (
              <View style={styles.connector}>
                <View style={styles.connectorLine} />
                <View style={styles.connectorIcon}>
                  <AppIcon
                    name="chevron-forward"
                    size={16}
                    color={Colors.accent}
                  />
                </View>
              </View>
            ) : null}

            <View
              style={[styles.card, isWide ? styles.cardWide : styles.cardStacked]}
            >
              <Text style={styles.watermark}>{step.number}</Text>
              <IconCircle name={step.icon} size={40} iconSize={20} />
              <View style={styles.textColumn}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.description}</Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
  },
  steps: {
    marginTop: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  stepsColumn: {
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    gap: 12,
  },
  cardWide: {
    flex: 1,
  },
  cardStacked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textColumn: {
    flexShrink: 1,
    gap: 4,
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
    right: 16,
    fontFamily: 'Poppins_700Bold',
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: 0,
    color: Colors.accentSoft,
  },
  connector: {
    width: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  connectorIcon: {
    backgroundColor: Colors.background,
    padding: 2,
  },
});
