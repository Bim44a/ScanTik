import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '@/components/AppIcon';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { API_BASE_URL } from '@/config/api';
import { prepareImage } from '@/services/image';
import { predictImage, PredictResult } from '@/services/predict';
import { setScanSession } from '@/state/scanSession';
import { addHistory, getHistory } from '@/storage/history';
import { HistoryItem } from '@/types/history';
import { MOTIFS } from '@/data/motifs';
import { MOTIF_META } from '@/data/motifMeta';
import SurfaceCard from '@/components/SurfaceCard';
import IconCircle from '@/components/IconCircle';
import SectionHeader from '@/components/SectionHeader';
import HowItWorks from '@/components/HowItWorks';
import MotifMiniCard from '@/components/MotifMiniCard';
import PhotoTips from '@/components/PhotoTips';
import RecentScanRow from '@/components/RecentScanRow';
import { openHistoryItem } from '@/utils/openHistoryItem';

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [recent, setRecent] = useState<HistoryItem[]>([]);

  // Muat 3 entri terbaru setiap tab Scanner difokuskan
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getHistory().then((items) => {
        if (active) {
          setRecent(items.slice(0, 3));
        }
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const startScan = async () => {
    // Cek alamat server
    if (!API_BASE_URL) {
      Alert.alert(
        'Alamat server belum diatur',
        'Silakan atur EXPO_PUBLIC_API_URL di berkas .env dan restart aplikasi.'
      );
      return;
    }

    // Minta izin akses galeri
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      Alert.alert(
        'Izin dibutuhkan',
        'Untuk memilih foto, ScanTik memerlukan izin akses galeri. Buka pengaturan dan aktifkan izin Foto.'
      );
      return;
    }

    // Buka galeri
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) {
      return; // Batal, tidak terjadi apa pun
    }

    const asset = result.assets[0];

    // Cek ukuran file jika tersedia (10 MB = 10 * 1024 * 1024 bytes)
    if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
      Alert.alert(
        'Ukuran foto terlalu besar',
        'Foto maksimal 10 MB. Pilih foto lain atau kompres terlebih dahulu.'
      );
      return;
    }

    // Mulai proses
    setIsLoading(true);

    try {
      // Kompres gambar
      const compressedUri = await prepareImage(asset.uri);

      // Kirim ke API
      const predictResult = await predictImage(compressedUri);

      if (!predictResult.ok) {
        Alert.alert('Gagal mengenali motif', predictResult.message);
        return;
      }

      // Simpan ke session memori dengan ID unik
      const sessionId = Date.now().toString();
      setScanSession(sessionId, compressedUri, predictResult.data);

      // Simpan ke riwayat (gagal tidak menghalangi navigasi)
      try {
        await addHistory(
          compressedUri,
          predictResult.data.predicted_class,
          predictResult.data.confidence_score,
          predictResult.data.motif_details ?? null
        );
      } catch (err) {
        console.warn('addHistory gagal:', err);
      }

      // Navigasi ke result HANYA dengan session ID
      router.push({
        pathname: '/result',
        params: {
          sessionId: sessionId,
        },
      });
    } catch (error) {
      console.error('Process error:', error);
      Alert.alert(
        'Terjadi kesalahan',
        'Proses tidak dapat diselesaikan. Coba lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openMotif = (className: string) => {
    const meta = MOTIF_META[className];
    if (!meta) return;
    router.push({
      pathname: '/(tabs)/catalog',
      params: { motif: meta.slug },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 24 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Selamat datang,</Text>
          <Text style={styles.title}>ScanTik</Text>
          <Text style={styles.tagline}>
            Kenali motif batik pesisir dalam sekali foto.
          </Text>
        </View>

        {/* Kartu aksi */}
        <SurfaceCard style={styles.actionCard}>
          <Pressable
            style={[styles.uploadZone, isLoading && styles.dimmed]}
            onPress={startScan}
            disabled={isLoading}
          >
            <IconCircle name="image-outline" size={56} iconSize={26} />
            <Text style={styles.uploadText}>
              Unggah foto kain batik untuk mengenali motifnya.
            </Text>
            <Text style={styles.uploadHint}>JPG / PNG · Maks. 10 MB</Text>
          </Pressable>

          <Pressable
            style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
            onPress={startScan}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.onPrimaryButton} size="small" />
            ) : (
              <AppIcon name="images-outline" size={20} color={Colors.onPrimaryButton} />
            )}
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Menghubungkan ke Server...' : 'Pilih dari Galeri'}
            </Text>
          </Pressable>

          <Text style={styles.footerText}>
            Foto Anda hanya digunakan untuk identifikasi.
          </Text>
        </SurfaceCard>

        {/* Cara kerja */}
        <View style={styles.section}>
          <HowItWorks />
        </View>

        {/* Motif yang dikenali */}
        <View style={styles.section}>
          <SectionHeader
            title="Motif yang dikenali"
            subtitle="6 motif"
            rightLabel="Lihat semua"
            onRightPress={() => router.push('/(tabs)/catalog')}
          />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={MOTIFS}
            keyExtractor={(item) => item.class}
            contentContainerStyle={styles.motifList}
            renderItem={({ item }) => (
              <MotifMiniCard
                motif={item}
                disabled={isLoading}
                onPress={() => openMotif(item.class)}
              />
            )}
          />
        </View>

        {/* Tips foto */}
        <View style={styles.section}>
          <PhotoTips onOpenHelp={() => router.push('/(tabs)/help')} />
        </View>

        {/* Pindaian terbaru */}
        <View style={styles.section}>
          <SectionHeader
            title="Pindaian terbaru"
            rightLabel="Lihat semua"
            onRightPress={() => router.push('/(tabs)/history')}
          />

          {recent.length === 0 ? (
            <SurfaceCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Belum ada pindaian</Text>
              <Text style={styles.emptyText}>
                Pilih foto kain batik untuk memulai.
              </Text>
              <Pressable
                style={[styles.secondaryButton, isLoading && styles.dimmed]}
                onPress={startScan}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonText}>Pilih Foto</Text>
              </Pressable>
            </SurfaceCard>
          ) : (
            <View style={styles.recentList}>
              {recent.map((item) => (
                <RecentScanRow
                  key={item.id}
                  item={item}
                  onPress={() => openHistoryItem(item)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  welcome: {
    ...Typography.greeting,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.wordmark,
    color: Colors.accent,
    marginTop: 2,
  },
  tagline: {
    ...Typography.greeting,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  actionCard: {
    padding: 12,
  },
  uploadZone: {
    borderWidth: 1,
    borderColor: Colors.primaryButton,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadText: {
    ...Typography.uploadInstruction,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadHint: {
    ...Typography.metadata,
    color: Colors.textSecondary,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryButton,
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.7,
  },
  primaryButtonText: {
    ...Typography.buttonLabel,
    color: Colors.onPrimaryButton,
  },
  footerText: {
    ...Typography.metadata,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  dimmed: {
    opacity: 0.5,
  },
  section: {
    marginTop: 24,
  },
  motifList: {
    marginTop: 12,
    gap: 12,
  },
  emptyCard: {
    marginTop: 12,
    gap: 8,
  },
  emptyTitle: {
    ...Typography.cardName,
    color: Colors.textPrimary,
  },
  emptyText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
  },
  secondaryButton: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...Typography.buttonLabel,
    color: Colors.accent,
  },
  recentList: {
    marginTop: 12,
    gap: 12,
  },
});
