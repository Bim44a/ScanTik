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
import { API_BASE_URL } from '@/config/api';
import { prepareImage } from '@/services/image';
import { predictImage, PredictResult } from '@/services/predict';

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

      // Sukses, navigasi ke layar hasil
      router.push({
        pathname: '/result',
        params: {
          imageUri: compressedUri,
          resultData: JSON.stringify(predictResult.data),
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
          <Text style={styles.subtitle}>
            Unggah foto kain batik untuk mengenali motifnya.
          </Text>
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
            <ActivityIndicator color={Colors.textOnPrimary} size="small" />
          ) : (
            <AppIcon name="images-outline" size={20} color={Colors.textOnPrimary} />
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 40,
  },
  welcome: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  title: {
    fontSize: 36,
    color: Colors.text,
    fontFamily: 'Inter_700Bold',
    marginTop: 4,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
  uploadCard: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: Colors.surface,
  },
  uploadIconContainer: {
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  uploadHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 18,
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
    fontSize: 16,
    color: Colors.textOnPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
});

