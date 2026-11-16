import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOTIFS, Motif } from '@/data/motifs';
import { MOTIF_META } from '@/data/motifMeta';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from '@/components/AppIcon';
import FilterChip from '@/components/FilterChip';
import MotifCard from '@/components/MotifCard';
import MotifSheet from '@/components/MotifSheet';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type RegionFilter = 'Semua' | 'Pekalongan' | 'Cirebon';

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const { motif: motifSlug } = useLocalSearchParams<{ motif?: string }>();
  const { width } = useWindowDimensions();
  const breakpoint = useBreakpoint();
  const isWeb = Platform.OS === 'web';
  const columns = isWeb ? (breakpoint === 'mobile' ? 2 : 3) : 2;
  const webMaxWidth = breakpoint === 'tablet' ? 720 : 1120;
  const webPadding =
    breakpoint === 'mobile' ? 16 : breakpoint === 'tablet' ? 24 : 32;
  const sidebarWidth = isWeb && breakpoint === 'desktop' ? 240 : 0;
  const availableWidth = isWeb
    ? Math.max(
        0,
        Math.min(width - sidebarWidth, webMaxWidth) - webPadding * 2
      )
    : width - 16 * 2;
  const cardWidth = isWeb
    ? (availableWidth - 12 * (columns - 1)) / columns
    : (width - 16 * 2 - 12) / 2;
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
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 16 },
        isWeb && styles.webContainer,
        isWeb && { maxWidth: webMaxWidth },
      ]}
    >
      <View style={[styles.header, isWeb && { paddingHorizontal: webPadding }]}>
        <Text style={styles.title}>Katalog Motif</Text>
        <Text style={styles.subtitle}>Pelajari 6 motif batik pesisir utara Jawa.</Text>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchBar,
          isWeb && { marginHorizontal: webPadding },
        ]}
      >
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
      <View
        style={[
          styles.filterBar,
          isWeb && { paddingHorizontal: webPadding },
        ]}
      >
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
      <Text
        style={[
          styles.countText,
          isWeb && { paddingHorizontal: webPadding },
        ]}
      >
        {filteredMotifs.length} motif
      </Text>

      {/* Grid */}
      <FlatList
        key={isWeb ? `grid-${columns}` : 'grid-2'}
        style={styles.listContainer}
        data={filteredMotifs}
        renderItem={({ item }) => (
          <MotifCard
            motif={item}
            width={cardWidth}
            onPress={() => setSelectedMotif(item)}
          />
        )}
        keyExtractor={(item) => item.class}
        numColumns={columns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.list,
          isWeb && { paddingHorizontal: webPadding },
        ]}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Motif tidak ditemukan</Text>
        }
      />

      <MotifSheet motif={selectedMotif} onClose={handleCloseSheet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  listContainer: {
    flex: 1,
  },
  columnWrapper: {
    alignItems: 'flex-start',
    gap: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  emptyText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
});
