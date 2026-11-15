import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MOTIFS, Motif } from '@/data/motifs';
import { MOTIF_META } from '@/data/motifMeta';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from '@/components/AppIcon';
import FilterChip from '@/components/FilterChip';
import MotifCard from '@/components/MotifCard';
import MotifSheet from '@/components/MotifSheet';

type RegionFilter = 'Semua' | 'Pekalongan' | 'Cirebon';

export default function CatalogScreen() {
  const { motif: motifSlug } = useLocalSearchParams<{ motif?: string }>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<RegionFilter>('Semua');
  const [selectedMotif, setSelectedMotif] = useState<Motif | null>(null);

  // Auto-open detail jika ada param rute
  useEffect(() => {
    if (motifSlug) {
      const motif = MOTIFS.find(
        (m) => MOTIF_META[m.class]?.slug === motifSlug
      );
      if (motif) {
        setSelectedMotif(motif);
      }
    }
  }, [motifSlug]);

  const filteredMotifs = useMemo(() => {
    return MOTIFS.filter((m) => {
      // Filter wilayah
      const matchRegion =
        filter === 'Semua' || m.origin.includes(filter);
      // Filter pencarian
      const matchSearch = m.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [filter, search]);

  const handleCloseSheet = () => {
    setSelectedMotif(null);
    if (motifSlug) {
      router.setParams({ motif: undefined });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Katalog Motif</Text>
        <Text style={styles.subtitle}>Pelajari 6 motif batik pesisir utara Jawa.</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <AppIcon name="search-outline" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari motif batik..."
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {(['Semua', 'Pekalongan', 'Cirebon'] as RegionFilter[]).map((r) => (
          <FilterChip
            key={r}
            label={r}
            active={filter === r}
            onPress={() => setFilter(r)}
          />
        ))}
      </View>

      {/* Count */}
      <Text style={styles.countText}>{filteredMotifs.length} motif</Text>

      {/* Grid */}
      <FlatList
        data={filteredMotifs}
        renderItem={({ item }) => (
          <MotifCard motif={item} onPress={() => setSelectedMotif(item)} />
        )}
        keyExtractor={(item) => item.class}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Motif tidak ditemukan</Text>
        }
      />

      <MotifSheet motif={selectedMotif} onClose={handleCloseSheet} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    height: 48,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    ...Typography.cardBody,
    color: Colors.textPrimary,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 8,
  },
  countText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 10, // Margin kartu 6x2 = 12, padding 10 -> total 16
    paddingBottom: 20,
  },
  emptyText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});
