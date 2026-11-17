import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
  Platform,
  useWindowDimensions,
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
import MotifCard from '@/components/MotifCard';
import MotifMiniCard from '@/components/MotifMiniCard';
import PhotoTips from '@/components/PhotoTips';
import RecentScanRow from '@/components/RecentScanRow';
import ResponsiveContainer from '@/components/ResponsiveContainer';
import { openHistoryItem } from '@/utils/openHistoryItem';
import { showMessage } from '@/utils/dialog';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const DESKTOP_PHOTO_TIPS = [
  'Cahaya terang dan merata',
  'Kain rata, tidak terlipat',
  'Foto tegak lurus',
];

export default function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const breakpoint = useBreakpoint();
  const isWeb = Platform.OS === 'web';
  const isDesktopWeb = isWeb && breakpoint === 'desktop';
  const isWideWeb = isWeb && breakpoint !== 'mobile';

  const webMaxWidth = breakpoint === 'tablet' ? 720 : 1120;
  const webPadding =
    breakpoint === 'mobile' ? 16 : breakpoint === 'tablet' ? 24 : 32;
  const sidebarWidth = isDesktopWeb ? 240 : 0;
  const availableWidth = Math.max(
    0,
    Math.min(width - sidebarWidth, webMaxWidth) - webPadding * 2
  );
  const gridCardWidth = (availableWidth - 12 * 2) / 3;

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
      showMessage(
        'Alamat server belum diatur',
        'Silakan atur EXPO_PUBLIC_API_URL di berkas .env dan restart aplikasi.'
      );
      return;
    }

    // Minta izin akses galeri (di web izin tidak diperlukan dan permintaan izin
    // dapat membatalkan aktivasi pengguna sebelum dialog file dibuka)
    if (!isWeb) {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!granted) {
        showMessage(
          'Izin dibutuhkan',
          'Untuk memilih foto, ScanTik memerlukan izin akses galeri. Buka pengaturan dan aktifkan izin Foto.'
        );
        return;
      }
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
      showMessage(
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
        showMessage('Gagal mengenali motif', predictResult.message);
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
      showMessage(
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

  const headerBlock = (
    <View style={styles.header}>
      <Text style={styles.welcome}>Selamat datang,</Text>
      <Text style={styles.title}>ScanTik</Text>
      <Text style={styles.tagline}>
        Kenali motif batik pesisir dalam sekali foto.
      </Text>
    </View>
  );

  const actionBlock = (
    <SurfaceCard
      style={[styles.actionCard, isDesktopWeb && styles.desktopColumnCard]}
    >
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
  );

  const howItWorksBlock = (
    <View style={styles.section}>
      <HowItWorks />
    </View>
  );

  const motifsBlock = (
    <View style={styles.section}>
      <SectionHeader
        title="Motif yang dikenali"
        subtitle="6 motif"
        rightLabel="Lihat semua"
        onRightPress={() => router.push('/(tabs)/catalog')}
      />
      {isWideWeb ? (
        <View style={styles.motifGrid}>
          {MOTIFS.map((item) => (
            <View
              key={item.class}
              style={[
                { width: gridCardWidth },
                isLoading && styles.dimmed,
              ]}
              pointerEvents={isLoading ? 'none' : 'auto'}
            >
              <MotifCard
                motif={item}
                width={gridCardWidth}
                onPress={() => openMotif(item.class)}
              />
            </View>
          ))}
        </View>
      ) : (
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
      )}
    </View>
  );

  const tipsBlock = (
    <View style={styles.section}>
      <PhotoTips onOpenHelp={() => router.push('/(tabs)/help')} />
    </View>
  );

  const recentBlock = (
    <View style={[styles.section, isDesktopWeb && styles.sectionNoTop]}>
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
  );

  const desktopRecentBlock = (
    <SurfaceCard style={[styles.desktopRecentCard, styles.desktopColumnCard]}>
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
          {recent.slice(0, 3).map((item) => (
            <RecentScanRow
              key={item.id}
              item={item}
              onPress={() => openHistoryItem(item)}
            />
          ))}
        </View>
      )}
    </SurfaceCard>
  );

  const desktopTipsBlock = (
    <View style={styles.section}>
      <SectionHeader title="Tips foto" />
      <SurfaceCard style={styles.desktopTipsCard}>
        <View style={styles.desktopTipsRow}>
          {DESKTOP_PHOTO_TIPS.map((tip) => (
            <View key={tip} style={styles.desktopTipItem}>
              <AppIcon name="checkmark" size={16} color={Colors.accent} />
              <Text style={styles.desktopTipText}>{tip}</Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => router.push('/(tabs)/help')}
          hitSlop={8}
          style={styles.desktopTipsLinkButton}
        >
          <Text style={styles.desktopTipsLink}>Lihat panduan lengkap</Text>
        </Pressable>
      </SurfaceCard>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWeb && styles.scrollContentWeb,
          { paddingTop: insets.top + 24 },
        ]}
      >
        <ResponsiveContainer maxWidth={webMaxWidth}>
          {isDesktopWeb ? (
            <>
              {headerBlock}
              <View style={styles.desktopColumns}>
                {actionBlock}
                {desktopRecentBlock}
              </View>
              {howItWorksBlock}
              {motifsBlock}
              {desktopTipsBlock}
            </>
          ) : (
            <>
              {headerBlock}
              {actionBlock}
              {howItWorksBlock}
              {motifsBlock}
              {tipsBlock}
              {recentBlock}
            </>
          )}
        </ResponsiveContainer>
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
  scrollContentWeb: {
    paddingHorizontal: 0,
  },
  desktopColumns: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 24,
  },
  desktopColumnCard: {
    flex: 1,
  },
  desktopRecentCard: {
    padding: 16,
  },
  desktopTipsCard: {
    marginTop: 12,
    padding: 16,
    gap: 12,
  },
  desktopTipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  desktopTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  desktopTipText: {
    ...Typography.cardBody,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  desktopTipsLinkButton: {
    alignSelf: 'flex-start',
  },
  desktopTipsLink: {
    ...Typography.linkGold,
    color: Colors.accent,
  },
  sectionNoTop: {
    marginTop: 0,
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
  motifGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
