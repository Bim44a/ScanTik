import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import AppIcon from '@/components/AppIcon';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { API_BASE_URL } from '@/config/api';
import { prepareImage } from '@/services/image';
import { predictImage, PredictResult } from '@/services/predict';
import { setScanSession } from '@/state/scanSession';

export default function ScannerScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Selamat datang,</Text>
          <Text style={styles.title}>ScanTik</Text>
        </View>

        {/* Kartu unggah */}
        <View style={styles.uploadCard}>
          <View style={styles.uploadIconContainer}>
            <AppIcon name="image-outline" size={48} color={Colors.accent} />
          </View>
          <Text style={styles.uploadText}>
            Unggah foto kain batik untuk mengenali motifnya.
          </Text>
          <Text style={styles.uploadHint}>
            JPG / PNG · Maks. 10 MB
          </Text>
        </View>

        {/* Tombol utama */}
        <Pressable
          style={[
            styles.primaryButton,
            isLoading && styles.primaryButtonDisabled,
          ]}
          onPress={handlePickImage}
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

        {/* Catatan kaki */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Foto Anda hanya digunakan untuk identifikasi.
          </Text>
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
    paddingHorizontal: 24, // TODO: Diukur dari scanner.png
    paddingTop: 32,        // TODO: Diukur dari scanner.png
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,      // TODO: Diukur dari scanner.png
  },
  welcome: {
    ...Typography.greeting,
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.wordmark,
    color: Colors.accent,
    marginTop: 4,
  },
  uploadCard: {
    borderWidth: 1,        // Sesuai design-report.md: tebal 1 px
    borderColor: Colors.primaryButton, // Sesuai design-report.md: #6B4423
    borderStyle: 'dashed',
    borderRadius: 16,      // TODO: Diukur dari scanner.png
    padding: 32,           // TODO: Diukur dari scanner.png
    alignItems: 'center',
    marginBottom: 24,      // TODO: Diukur dari scanner.png
    backgroundColor: Colors.surface, // #1D1814
  },
  uploadIconContainer: {
    marginBottom: 16,
  },
  uploadText: {
    ...Typography.uploadInstruction,
    color: Colors.textPrimary, // #F4EBD9
    textAlign: 'center',
    marginBottom: 8,
  },
  uploadHint: {
    ...Typography.metadata,
    color: Colors.textSecondary, // #A39893
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryButton, // #6B4423
    borderRadius: 12,      // TODO: Diukur dari scanner.png
    paddingVertical: 16,
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
    color: Colors.onPrimaryButton, // #FFFFFF
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  footerText: {
    ...Typography.metadata,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});


