import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ImageSourcePropType,
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
export default function ImageLightbox({
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
