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
        <AppIcon name="image-outline" size={32} color={Colors.accentMuted} />
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
    // TODO: Typography token
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    marginLeft: 8,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginRight: 8,
  },
  sectionCount: {
    fontSize: 14,
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
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 24,
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: 'bold',
    marginTop: 16,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 4,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
