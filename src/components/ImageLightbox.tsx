import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ImageSourcePropType,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from './AppIcon';

export interface ImageLightboxProps {
  visible: boolean;
  source: ImageSourcePropType;
  caption?: string;
  onClose: () => void;
}

/**
 * Pratinjau gambar layar penuh tanpa zoom.
 * Tutup lewat ketuk mana saja, tombol close, atau kembali Android.
 */
export default function ImageLightbox(props: ImageLightboxProps) {
  if (Platform.OS === 'web') {
    return <WebImageLightbox {...props} />;
  }

  return <NativeImageLightbox {...props} />;
}

/** Cabang Android/iOS: susunan dan gaya lama tidak berubah. */
function NativeImageLightbox({
  visible,
  source,
  caption,
  onClose,
}: ImageLightboxProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.content, { marginTop: insets.top + 16 }]}>
          <View style={styles.imageWrap}>
            <Image source={source} style={styles.image} resizeMode="contain" />
          </View>
          {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        </View>

        <Pressable
          onPress={onClose}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Tutup pratinjau foto"
          style={[styles.closeButton, { top: insets.top + 8 }]}
        >
          <AppIcon name="close" size={28} color={Colors.textPrimary} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Cabang web: lebar maksimum 90% layar, tinggi maksimum 85% layar. */
function WebImageLightbox({
  visible,
  source,
  caption,
  onClose,
}: ImageLightboxProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // Ukuran bingkai pasti (piksel), bukan persentase tanpa acuan.
  // Sisihkan ruang keterangan agar gambar dan teks tetap utuh.
  const captionReserve = caption ? 56 : 0;
  const frameWidth = Math.round(width * 0.9);
  const frameHeight = Math.max(
    1,
    Math.round(height * 0.85) - captionReserve
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={[styles.overlay, styles.webOverlay]} onPress={onClose}>
        <View style={styles.webStage}>
          <View
            style={[
              styles.webImageFrame,
              { width: frameWidth, height: frameHeight },
            ]}
          >
            {/* width/height 100% menimpa ukuran intrinsik aset statis
                (imageSizeStyle dari react-native-web) agar kotak gambar
                selalu mengisi bingkai dan benar-benar di tengah. */}
            <Image
              source={source}
              style={[StyleSheet.absoluteFill, styles.webImage]}
              resizeMode="contain"
            />
          </View>
          {caption ? (
            <Text style={[styles.caption, styles.webCaption]}>{caption}</Text>
          ) : null}
        </View>

        <Pressable
          onPress={onClose}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Tutup pratinjau foto"
          style={[styles.closeButton, { top: insets.top + 8 }]}
        >
          <AppIcon name="close" size={28} color={Colors.textPrimary} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(22,19,17,0.92)',
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 16,
  },
  imageWrap: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
  },
  webOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webStage: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  webImageFrame: {
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  webImage: {
    width: '100%',
    height: '100%',
  },
  webCaption: {
    maxWidth: '90%',
  },
  caption: {
    ...Typography.cardBody,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
