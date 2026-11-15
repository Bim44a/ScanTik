import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';
import Constants from 'expo-constants';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import SurfaceCard from '@/components/SurfaceCard';
import SectionHeader from '@/components/SectionHeader';
import PhotoExampleCard from '@/components/PhotoExampleCard';
import StatusRow from '@/components/StatusRow';
import ImageLightbox from '@/components/ImageLightbox';
import { doPhoto, dontPhoto } from '@/data/helpPhotos';

const RULES: string[] = [
  'Cahaya terang dan merata',
  'Kain rata (tidak terlipat atau kusut berlebih)',
  'Foto tegak lurus yang menyorot pola utama',
];

export default function HelpScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 16 * 2 - 12) / 2;
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const [lightbox, setLightbox] = useState<{
    source: ImageSourcePropType;
    caption: string;
  } | null>(null);

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

        {/* Contoh foto */}
        <View style={styles.exampleRow}>
          <PhotoExampleCard
            title="Cara yang Benar"
            badgeLabel="DO'S"
            badgeIcon="checkmark"
            variant="accent"
            caption="Kain rata, cahaya terang, dan motif terlihat jelas."
            width={cardWidth}
            photo={doPhoto}
            onOpenPhoto={() =>
              setLightbox({
                source: doPhoto,
                caption: 'Kain rata, cahaya terang, dan motif terlihat jelas.',
              })
            }
          />
          <PhotoExampleCard
            title="Hindari"
            badgeLabel="DON'TS"
            badgeIcon="close"
            variant="neutral"
            caption="Kain terlipat, gelap, atau buram akan menurunkan akurasi AI."
            width={cardWidth}
            photo={dontPhoto}
            onOpenPhoto={() =>
              setLightbox({
                source: dontPhoto,
                caption: 'Kain terlipat, gelap, atau buram akan menurunkan akurasi AI.',
              })
            }
          />
        </View>

        {/* Tiga Aturan Wajib */}
        <View style={styles.section}>
          <SectionHeader title="Tiga Aturan Wajib" />
          <SurfaceCard style={styles.rulesCard}>
            {RULES.map((rule, index) => (
              <View
                key={rule}
                style={[styles.rule, index > 0 && styles.ruleDivider]}
              >
                <View style={styles.ruleNumber}>
                  <Text style={styles.ruleNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </SurfaceCard>
        </View>

        {/* Informasi */}
        <View style={styles.section}>
          <SectionHeader title="Informasi" />
          <SurfaceCard style={styles.infoCard}>
            <StatusRow />
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versi aplikasi</Text>
              <Text style={styles.infoValue}>{appVersion}</Text>
            </View>
          </SurfaceCard>
        </View>
      </ScrollView>

      {lightbox ? (
        <ImageLightbox
          visible
          source={lightbox.source}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </SafeAreaView>
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
  headerLabel: {
    ...Typography.badgeSmall,
    color: Colors.accent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.greeting,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  section: {
    marginTop: 24,
  },
  rulesCard: {
    marginTop: 12,
    padding: 0,
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  ruleDivider: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumberText: {
    ...Typography.cardName,
    color: Colors.accent,
  },
  ruleText: {
    flex: 1,
    ...Typography.cardBody,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  infoCard: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
  },
  infoLabel: {
    ...Typography.cardBody,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Typography.cardBody,
    fontSize: 14,
    color: Colors.textPrimary,
  },
});
