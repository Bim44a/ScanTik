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

/**
 * TODO M4b: Tampilan final dengan tema motif, skor, makna, tombol aksi lengkap.
 * M4a: Layar sementara menampilkan thumbnail, predicted_class, dan confidence_score mentah.
 */
export default function ResultScreen() {
  const { imageUri, resultData } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (resultData) {
      try {
        const parsed = JSON.parse(String(resultData));
        setData(parsed);
      } catch (error) {
        console.error('Failed to parse result data:', error);
        setData(null);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
    }
  }, [resultData]);

  const handleScanAgain = () => {
    router.replace('/(tabs)');
  };

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </SafeAreaView>
    );
  }

  if (!data || !imageUri) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <AppIcon name="alert-circle" size={64} color={Colors.textSecondary} />
        <Text style={styles.errorText}>Data hasil tidak valid</Text>
        <Pressable style={styles.retryButton} onPress={handleScanAgain}>
          <Text style={styles.retryButtonText}>Pindai Lagi</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { predicted_class, confidence_score, motif_details } = data;

  // Format skor ke 1 desimal
  const formattedScore = confidence_score.toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.sectionLabel}>HASIL PEMINDAIAN</Text>
          <Text style={styles.subtitle}>Hasil identifikasi motif batik</Text>
        </View>

        {/* Thumbnail */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: String(imageUri) }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            {predicted_class === 'Negatif' ? (
              <AppIcon name="warning" size={32} color={Colors.onPrimaryButton} />
            ) : (
              <AppIcon name="checkmark-circle" size={32} color={Colors.accent} />
            )}
          </View>
        </View>

        {/* Info utama */}
        <View style={styles.infoCard}>
          {predicted_class === 'Negatif' ? (
            <>
              <View style={[styles.statusBadge, styles.statusBadgeNegatif]}>
                <AppIcon name="close-circle" size={16} color={Colors.onPrimaryButton} />
                <Text style={styles.statusBadgeText}>Tidak dikenali</Text>
              </View>
              <Text style={styles.classNameTitle}>Motif tidak dikenali</Text>
              <Text style={styles.explanationText}>
                Foto tidak cocok dengan salah satu dari 6 motif batik yang dikenali:
                Buketan, Jlamprang, Liong, Mega Mendung, Singa Barong, dan Tujuh Rupa.
              </Text>
            </>
          ) : (
            <>
              <View style={[styles.statusBadge, styles.statusBadgeSuccess]}>
                <AppIcon name="checkmark-circle" size={16} color={Colors.onPrimaryButton} />
                <Text style={styles.statusBadgeText}>Dikenali</Text>
              </View>
              <Text style={styles.classNameTitle}>{motif_details.name}</Text>
              <Text style={styles.confidenceText}>
                Kecocokan {formattedScore}%
              </Text>
              {confidence_score < 60 && (
                <View style={styles.warningBox}>
                  <AppIcon name="alert-circle-outline" size={20} color={Colors.accent} />
                  <Text style={styles.warningText}>
                    Tingkat kemiripan rendah. Pastikan foto mengikuti panduan di Tab Bantuan.
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Detail motif */}
          {predicted_class !== 'Negatif' && motif_details && (
            <View style={styles.detailsGrid}>
              {motif_details.origin && (
                <View style={styles.detailRow}>
                  <AppIcon name="location" size={20} color={Colors.accent} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Asal</Text>
                    <Text style={styles.detailValue}>{motif_details.origin}</Text>
                  </View>
                </View>
              )}
              {motif_details.philosophy && (
                <View style={styles.detailRow}>
                  <AppIcon name="heart" size={20} color={Colors.accent} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Filosofi</Text>
                    <Text style={styles.detailValue} numberOfLines={3}>
                      {motif_details.philosophy}
                    </Text>
                  </View>
                </View>
              )}
              {motif_details.characteristics && (
                <View style={styles.detailRow}>
                  <AppIcon name="grid" size={20} color={Colors.accent} />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Ciri</Text>
                    <Text style={styles.detailValue} numberOfLines={3}>
                      {motif_details.characteristics}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Tombol aksi */}
        <Pressable style={styles.actionButton} onPress={handleScanAgain}>
          <AppIcon name="share" size={20} color={Colors.onPrimaryButton} />
          <Text style={styles.actionButtonText}>Pindai Lagi</Text>
        </Pressable>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    marginBottom: 32,
  },
  sectionLabel: {
    ...Typography.tabLabelInactive,
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    ...Typography.metadata,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: Colors.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: 'fit-content',
    marginBottom: 16,
  },
  statusBadgeSuccess: {
    backgroundColor: Colors.accent,
  },
  statusBadgeNegatif: {
    backgroundColor: Colors.textSecondary,
  },
  statusBadgeText: {
    color: Colors.onPrimaryButton,
    ...Typography.metadata,
  },
  classNameTitle: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  confidenceText: {
    ...Typography.cardTitle,
    fontSize: 18,
    color: Colors.accent,
    marginBottom: 16,
  },
  explanationText: {
    ...Typography.cardBody,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  warningText: {
    flex: 1,
    ...Typography.cardBody,
    color: Colors.accent,
    lineHeight: 20,
  },
  detailsGrid: {
    gap: 24,
    marginTop: 24,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.cardTitle,
    color: Colors.accent,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    ...Typography.cardBody,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryButton,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  actionButtonText: {
    ...Typography.buttonLabel,
    color: Colors.onPrimaryButton,
  },
  errorText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  retryButtonText: {
    ...Typography.buttonLabel,
    color: Colors.accent,
  },
});
