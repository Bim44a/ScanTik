import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from '@/components/AppIcon';
import { getScanSession } from '@/state/scanSession';

export default function ResultScreen() {
  const { sessionId } = useLocalSearchParams();
  const [session, setSession] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (sessionId) {
      const found = getScanSession(String(sessionId));
      setSession(found);
    }
    setIsProcessing(false);
  }, [sessionId]);

  const handleScanAgain = () => {
    router.replace('/(tabs)');
  };

  const handleOpenHelp = () => {
    router.replace('/(tabs)/help');
  };

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </SafeAreaView>
    );
  }

  if (!session || !session.response) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <AppIcon name="alert-circle-outline" size={64} color={Colors.accent} />
        <Text style={styles.errorText}>Hasil tidak tersedia.</Text>
        <Pressable style={styles.primaryButton} onPress={handleScanAgain}>
          <Text style={styles.primaryButtonText}>Kembali ke Pemindai</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { predicted_class, confidence_score, motif_details } = session.response;
  const imageUri = session.uri;
  const isUnrecognized = predicted_class === 'Negatif';
  const isLowConfidence = !isUnrecognized && confidence_score < 60;

  // Format skor ke 1 desimal dengan KOMA (contoh: 94,9%)
  const formattedScore = confidence_score.toFixed(1).replace('.', ',');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Thumbnail foto */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: String(imageUri) }}
            style={styles.thumbnail}
            resizeMode="contain"
          />
        </View>

        {/* Kondisi 3: TIDAK DIKENALI */}
        {isUnrecognized ? (
          <View style={styles.card}>
            <Text style={styles.unrecognizedTitle}>Motif tidak dikenali</Text>
            <Text style={styles.unrecognizedText}>
              Motif ini belum termasuk 6 motif yang dikenali aplikasi.
            </Text>

            <View style={styles.buttonGroup}>
              <Pressable style={styles.secondaryButton} onPress={handleOpenHelp}>
                <AppIcon name="help-circle-outline" size={20} color={Colors.accent} />
                <Text style={styles.secondaryButtonText}>Buka Panduan Foto</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handleScanAgain}>
                <AppIcon name="scan-outline" size={20} color={Colors.onPrimaryButton} />
                <Text style={styles.primaryButtonText}>Pindai Lagi</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          /* Kondisi 1 & 2: DIKENALI */
          <View style={styles.card}>
            {/* Lencana Kecocokan */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Kecocokan {formattedScore}%</Text>
            </View>

            {/* Nama Motif */}
            <Text style={styles.motifTitle}>
              {motif_details?.name || predicted_class}
            </Text>

            {/* Kondisi 2: Peringatan Skor < 60 */}
            {isLowConfidence && (
              <View style={styles.warningCard}>
                <AppIcon name="alert-circle-outline" size={24} color={Colors.accent} />
                <Text style={styles.warningText}>
                  Tingkat kemiripan rendah. Pastikan foto mengikuti panduan di Tab Bantuan.
                </Text>
              </View>
            )}

            {/* Detail Motif (Asal, Filosofi, Ciri) */}
            {motif_details && (
              <View style={styles.detailsContainer}>
                {motif_details.origin ? (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Asal</Text>
                    <Text style={styles.detailValue}>{motif_details.origin}</Text>
                  </View>
                ) : null}

                {motif_details.philosophy ? (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Filosofi</Text>
                    <Text style={styles.detailValue}>{motif_details.philosophy}</Text>
                  </View>
                ) : null}

                {motif_details.characteristics ? (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Ciri</Text>
                    <Text style={styles.detailValue}>{motif_details.characteristics}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* Tombol Aksi */}
            <View style={styles.buttonGroup}>
              {isLowConfidence && (
                <Pressable style={styles.secondaryButton} onPress={handleOpenHelp}>
                  <AppIcon name="help-circle-outline" size={20} color={Colors.accent} />
                  <Text style={styles.secondaryButtonText}>Buka Panduan Foto</Text>
                </Pressable>
              )}
              <Pressable style={styles.primaryButton} onPress={handleScanAgain}>
                <AppIcon name="scan-outline" size={20} color={Colors.onPrimaryButton} />
                <Text style={styles.primaryButtonText}>Pindai Lagi</Text>
              </Pressable>
            </View>
          </View>
        )}
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
    gap: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 24,
    gap: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    ...Typography.badge,
    color: Colors.onBadge,
  },
  motifTitle: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
  },
  unrecognizedTitle: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
  },
  unrecognizedText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primaryButton,
    borderRadius: 12,
    padding: 14,
  },
  warningText: {
    flex: 1,
    ...Typography.cardBody,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  detailsContainer: {
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  detailSection: {
    gap: 4,
  },
  detailLabel: {
    ...Typography.cardTitle,
    color: Colors.accent,
  },
  detailValue: {
    ...Typography.cardBody,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryButton,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  primaryButtonText: {
    ...Typography.buttonLabel,
    color: Colors.onPrimaryButton,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  secondaryButtonText: {
    ...Typography.buttonLabel,
    color: Colors.accent,
  },
  errorText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});