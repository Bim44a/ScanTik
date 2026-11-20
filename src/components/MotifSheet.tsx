import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { Motif } from '@/data/motifs';
import { MOTIF_META } from '@/data/motifMeta';
import { getMotifPhoto } from '@/data/motifPhotos';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import OriginChip from './OriginChip';
import IconCircle from './IconCircle';
import AppIcon from './AppIcon';
import ImageLightbox from './ImageLightbox';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export interface MotifSheetProps {
  motif: Motif | null;
  onClose: () => void;
}

export default function MotifSheet({ motif, onClose }: MotifSheetProps) {
  const breakpoint = useBreakpoint();
  const isDialog = Platform.OS === 'web' && breakpoint !== 'mobile';
  const [isLightboxVisible, setIsLightboxVisible] = useState(false);

  if (!motif) return null;

  const meta = MOTIF_META[motif.class];
  const photo = getMotifPhoto(meta?.slug);
  const motifLabel = motif.name.replace(/^Batik\s+/i, '');

  const sheet = (
    <View style={isDialog ? styles.dialogSheet : styles.sheet}>
      {/* Pegangan */}
      {isDialog ? null : <View style={styles.handle} />}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={isDialog ? styles.dialogScroll : undefined}
      >
        {/* Foto motif 16:9 (dapat diketuk) atau placeholder */}
        {photo ? (
          <Pressable
            onPress={() => setIsLightboxVisible(true)}
            accessibilityRole="imagebutton"
            accessibilityLabel="Perbesar foto motif"
          >
            <View style={styles.photoFrame}>
              <Image
                source={photo.source}
                style={[StyleSheet.absoluteFill, styles.image]}
                resizeMode="cover"
              />
              <View style={styles.expandHint}>
                <AppIcon
                  name="expand-outline"
                  size={18}
                  color={Colors.textPrimary}
                />
              </View>
            </View>
          </Pressable>
        ) : (
          <View style={styles.imagePlaceholder}>
            <IconCircle name={meta?.icon || 'help-outline'} size={120} iconSize={48} />
          </View>
        )}

        {/* Nama Motif */}
        <Text style={styles.title}>{motif.name}</Text>

        <OriginChip origin={motif.origin} />

        {/* Seksi Konten */}
        <View style={styles.details}>
          <View style={styles.section}>
            <Text style={styles.label}>Filosofi</Text>
            <Text style={styles.body}>{motif.philosophy}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Ciri</Text>
            <Text style={styles.body}>{motif.characteristics}</Text>
          </View>
        </View>

        {/* Tombol Tutup */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Tutup</Text>
        </Pressable>
      </ScrollView>
    </View>
  );

  return (
    <>
      <Modal
        visible={!!motif}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose} />
        {isDialog ? (
          <View style={styles.dialogWrapper} pointerEvents="box-none">
            {sheet}
          </View>
        ) : (
          sheet
        )}
      </Modal>

      {/* Pratinjau ditaruh di luar Modal lembar agar tidak bersarang. */}
      {photo ? (
        <ImageLightbox
          visible={isLightboxVisible}
          source={photo.source}
          caption={`Batik ${motifLabel} · Foto: ${photo.credit}`}
          onClose={() => setIsLightboxVisible(false)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  dialogWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  dialogSheet: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '85%',
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingTop: 8,
    overflow: 'hidden',
  },
  dialogScroll: {
    flexShrink: 1,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFrame: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  expandHint: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.detailTitle,
    color: Colors.textPrimary,
  },
  details: {
    gap: 20,
  },
  section: {
    gap: 8,
  },
  label: {
    ...Typography.cardTitle,
    color: Colors.accent,
  },
  body: {
    ...Typography.detailBody,
    color: Colors.textPrimary,
  },
  closeButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    ...Typography.buttonLabel,
    color: Colors.accent,
  },
});
