import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AppIcon from '@/components/AppIcon';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { MOTIFS, Motif } from '@/data/motifs';

export default function CatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMotif, setSelectedMotif] = useState<Motif | null>(null);

  const filteredMotifs = useMemo(() => {
    return MOTIFS.filter((motif) =>
      motif.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderItem = ({ item }: { item: Motif }) => (
    <Pressable
      style={styles.card}
      onPress={() => setSelectedMotif(item)}
    >
      <View style={styles.placeholderImage}>
        <AppIcon name="image-outline" size={32} color={Colors.accent} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>
          {item.philosophy}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Katalog Motif</Text>
        <View style={styles.searchContainer}>
          <AppIcon name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari motif batik..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Jelajahi motif</Text>
        <Text style={styles.sectionCount}>{filteredMotifs.length}</Text>
      </View>

      <FlatList
        data={filteredMotifs}
        renderItem={renderItem}
        keyExtractor={(item) => item.class}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Motif tidak ditemukan</Text>
          </View>
        }
      />

      <Modal
        visible={selectedMotif !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedMotif(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalTitle}>{selectedMotif?.name}</Text>
              
              <Text style={styles.label}>Asal</Text>
              <Text style={styles.value}>{selectedMotif?.origin}</Text>
              
              <Text style={styles.label}>Filosofi</Text>
              <Text style={styles.value}>{selectedMotif?.philosophy}</Text>
              
              <Text style={styles.label}>Ciri</Text>
              <Text style={styles.value}>{selectedMotif?.characteristics}</Text>
            </ScrollView>
            
            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedMotif(null)}
            >
              <Text style={styles.closeButtonText}>Tutup</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20, // TODO: Diukur dari katalog.png
  },
  title: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12, // TODO: Diukur dari katalog.png
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    marginLeft: 8,
    fontSize: 16, // TODO: Gunakan typography token untuk body text
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  sectionCount: {
    ...Typography.metadata,
    color: Colors.textSecondary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated, // #241F1C sesuai design-report.md
    borderRadius: 16, // TODO: Diukur dari katalog.png
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16, // TODO: Gunakan typography token
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 24,
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalTitle: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  label: {
    ...Typography.cardTitle,
    color: Colors.accent,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  value: {
    ...Typography.cardBody,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: Colors.primaryButton,
    borderRadius: 12, // TODO: Diukur dari katalog.png
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    ...Typography.buttonLabel,
    color: Colors.onPrimaryButton,
  },
});
