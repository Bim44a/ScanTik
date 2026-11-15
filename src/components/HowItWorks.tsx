import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

interface Step {
  number: string;
  label: string;
}

const STEPS: Step[] = [
  { number: '1', label: 'Pilih foto' },
  { number: '2', label: 'Analisis' },
  { number: '3', label: 'Kenali motif' },
];

/**
 * Bagian "Cara kerja": tiga langkah dalam satu baris.
 * Informasi saja, tidak dapat diketuk.
 */
export default function HowItWorks() {
  return (
    <View>
      <Text style={styles.title}>Cara kerja</Text>
      <View style={styles.steps}>
        {STEPS.map((step) => (
          <View key={step.number} style={styles.step}>
            <View style={styles.circle}>
              <Text style={styles.number}>{step.number}</Text>
            </View>
            <Text style={styles.label}>{step.label}</Text>
          </View>
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
    flexDirection: 'row',
    marginTop: 16,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    ...Typography.cardName,
    color: Colors.accent,
  },
  label: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
