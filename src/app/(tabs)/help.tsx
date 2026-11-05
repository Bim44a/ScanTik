import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Constants from 'expo-constants';
import { Colors } from '@/theme/colors';
import { API_BASE_URL } from '@/config/api';
import { checkHealth, HealthCheckResult } from '@/services/health';
import AppIcon from '@/components/AppIcon';

export default function HelpScreen() {
  const [healthResult, setHealthResult] = useState<HealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckHealth = async () => {
    setIsLoading(true);
    const result = await checkHealth();
    setHealthResult(result);
    setIsLoading(false);
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>PUSAT BANTUAN</Text>
          <Text style={styles.title}>Panduan Foto</Text>
          <Text style={styles.subtitle}>
            Kenali batik lebih akurat, dimulai dari foto yang tepat.
          </Text>
        </View>

        {/* Cara yang Benar */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Cara yang Benar</Text>
            <Text style={styles.badge}>DO'S</Text>
          </View>
          <View style={styles.placeholderImage}>
            <AppIcon name="checkmark-circle" size={48} color={Colors.accent} />
          </View>
          <Text style={styles.imageCaption}>
            Kain rata, cahaya terang, dan motif terlihat jelas.
          </Text>
        </View>

        {/* Hindari */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>Hindari</Text>
            <Text style={[styles.badge, styles.badgeDont]}>DON'TS</Text>
          </View>
          <View style={styles.placeholderImage}>
            <AppIcon name="close-circle" size={48} color={Colors.textSecondary} />
          </View>
          <Text style={styles.imageCaption}>
            Kain terlipat, gelap, atau buram akan menurunkan akurasi AI.
          </Text>
        </View>

        {/* Tiga Aturan Wajib */}
        <View style={styles.section}>
          <Text style={styles.rulesTitle}>Tiga Aturan Wajib</Text>
          <View style={styles.rule}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>1</Text>
            </View>
            <Text style={styles.ruleText}>Cahaya terang dan merata</Text>
          </View>
          <View style={styles.rule}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>2</Text>
            </View>
            <Text style={styles.ruleText}>
              Kain rata (tidak terlipat atau kusut berlebih)
            </Text>
          </View>
          <View style={styles.rule}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>3</Text>
            </View>
            <Text style={styles.ruleText}>
              Foto tegak lurus yang menyorot pola utama
            </Text>
          </View>
        </View>

        {/* Technical Section */}
        <View style={styles.section}>
          <Text style={styles.techTitle}>Informasi Teknis</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versi aplikasi</Text>
            <Text style={styles.infoValue}>{appVersion}</Text>
          </View>

          <Pressable
            style={[
              styles.healthButton,
              !API_BASE_URL && styles.healthButtonDisabled,
              isLoading && styles.healthButtonLoading,
            ]}
            onPress={handleCheckHealth}
            disabled={!API_BASE_URL || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textOnPrimary} size="small" />
            ) : (
              <AppIcon
                name="globe-outline"
                size={18}
                color={!API_BASE_URL ? Colors.textSecondary : Colors.textOnPrimary}
              />
            )}
            <Text
              style={[
                styles.healthButtonText,
                !API_BASE_URL && styles.healthButtonTextDisabled,
              ]}
            >
              Cek koneksi server
            </Text>
          </Pressable>

          {!API_BASE_URL && (
            <View style={styles.statusBox}>
              <Text style={styles.statusError}>Alamat server belum diatur</Text>
            </View>
          )}

          {healthResult && (
            <View
              style={[
                styles.statusBox,
                healthResult.ok ? styles.statusBoxSuccess : styles.statusBoxError,
              ]}
            >
              {healthResult.ok ? (
                <>
                  <AppIcon
                    name="checkmark-circle"
                    size={20}
                    color={Colors.accent}
                  />
                  <Text style={styles.statusText}>Server terhubung</Text>
                </>
              ) : (
                <>
                  <AppIcon
                    name="close-circle"
                    size={20}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.statusError}>{healthResult.message}</Text>
                </>
              )}
            </View>
          )}

          {healthResult && !healthResult.ok && (
            <Text style={styles.helpText}>
              Pastikan HP dan laptop di jaringan yang sama dan server API berjalan.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerLabel: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
    // TODO: Typography token
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    // TODO: Typography token
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
    // TODO: Typography token
  },
  section: {
    marginBottom: 24,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    // TODO: Typography token
  },
  badge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.accent,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeDont: {
    color: Colors.textSecondary,
  },
  placeholderImage: {
    height: 200,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  imageCaption: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    // TODO: Typography token
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    // TODO: Typography token
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ruleNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    // TODO: Typography token
  },
  techTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    // TODO: Typography token
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    // TODO: Typography token
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  healthButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  healthButtonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.surfaceElevated,
  },
  healthButtonLoading: {
    opacity: 0.8,
  },
  healthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textOnPrimary,
    marginLeft: 8,
  },
  healthButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  statusBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBoxSuccess: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  statusBoxError: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  statusError: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
