import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { getHistory, clearHistory } from '@/storage/history';
import { HistoryItem } from '@/types/history';
import { setScanSession } from '@/state/scanSession';
import AppIcon from '@/components/AppIcon';
import MatchBadge from '@/components/MatchBadge';
import NeutralChip from '@/components/NeutralChip';
import IconCircle from '@/components/IconCircle';
import SectionHeader from '@/components/SectionHeader';
import SurfaceCard from '@/components/SurfaceCard';
import { WebDocumentTitle } from '@/components/ResponsiveContainer';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type HistoryGroupKey = 'today' | 'yesterday' | 'older';

interface HistoryGroup {
  key: HistoryGroupKey;
  label: string;
  items: HistoryItem[];
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function formatOlderTime(date: Date): string {
  const day = pad2(date.getDate());
  const month = date.toLocaleString('id-ID', { month: 'short' });
  return `${day} ${month}, ${formatTime(date)}`;
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function groupHistory(items: HistoryItem[]): HistoryGroup[] {
  const todayStart = startOfDay(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStart = startOfDay(yesterday);

  const groups: HistoryGroup[] = [
    { key: 'today', label: 'Hari ini', items: [] },
    { key: 'yesterday', label: 'Kemarin', items: [] },
    { key: 'older', label: 'Lebih lama', items: [] },
  ];

  for (const item of items) {
    const dayStart = startOfDay(new Date(item.createdAt));
    if (dayStart === todayStart) {
      groups[0].items.push(item);
    } else if (dayStart === yesterdayStart) {
      groups[1].items.push(item);
    } else {
      groups[2].items.push(item);
    }
  }

  return groups.filter((group) => group.items.length > 0);
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const breakpoint = useBreakpoint();
  const isWeb = Platform.OS === 'web';
  const isWebGrid = isWeb && breakpoint !== 'mobile';

  const webMaxWidth = breakpoint === 'tablet' ? 720 : 1120;
  const webPadding =
    breakpoint === 'mobile' ? 16 : breakpoint === 'tablet' ? 24 : 32;
  const sidebarWidth = isWeb && breakpoint === 'desktop' ? 240 : 0;
  const availableWidth = Math.max(
    0,
    Math.min(width - sidebarWidth, webMaxWidth) - webPadding * 2
  );
  const cardWidth = isWebGrid ? (availableWidth - 12) / 2 : undefined;

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data);
  }, []);

  // Reload setiap tab difokuskan
  useFocusEffect(() => {
    loadHistory();
  });

  const handleOpenResult = (item: HistoryItem) => {
    // Susun response data untuk result screen (tanpa memanggil API)
    const responseData = {
      predicted_class: item.predictedClass,
      confidence_score: item.confidenceScore,
      motif_details: {
        name: item.motifName,
        origin: item.origin,
        philosophy: item.philosophy,
        characteristics: item.characteristics,
      },
    };

    setScanSession(item.id, item.imageUri, responseData);
    router.push({ pathname: '/result', params: { sessionId: item.id } });
  };

  const handleClearHistory = () => {
    Alert.alert('Hapus Riwayat', 'Hapus semua riwayat pindaian?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          await loadHistory();
        },
      },
    ]);
  };

  const renderItem = (item: HistoryItem, groupKey: HistoryGroupKey) => {
    const isUnrecognized = item.motifName === 'Motif tidak dikenali';
    const date = new Date(item.createdAt);
    const timeLabel =
      groupKey === 'older' ? formatOlderTime(date) : formatTime(date);

    return (
      <Pressable
        key={item.id}
        onPress={() => handleOpenResult(item)}
        style={isWebGrid ? { width: cardWidth } : undefined}
      >
        <SurfaceCard style={styles.card}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.motifName} numberOfLines={1}>
              {item.motifName}
            </Text>
            <View style={styles.metaRow}>
              {isUnrecognized ? (
                <NeutralChip />
              ) : (
                <MatchBadge score={item.confidenceScore} />
              )}
              <Text style={styles.timeText}>{timeLabel}</Text>
            </View>
          </View>
          <AppIcon
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </SurfaceCard>
      </Pressable>
    );
  };

  const groups = groupHistory(history);

  const headerBlock = (
    <View style={[styles.header, isWeb && styles.headerWeb]}>
      <Text style={styles.title}>Riwayat Pindaian</Text>
      <Text style={styles.subtitle}>Jejak penemuan motif batik Anda.</Text>
    </View>
  );

  const emptyBlock = (
    <View style={styles.emptyContainer}>
      <IconCircle name="time-outline" />
      <Text style={styles.emptyTitle}>Belum ada riwayat pindaian</Text>
      <Text style={styles.emptyText}>
        Foto yang kamu pindai akan muncul di sini.
      </Text>
      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.secondaryButtonText}>Mulai Pindai</Text>
      </Pressable>
    </View>
  );

  const sectionHeader = (
    <SectionHeader
      title="Pindaian terbaru"
      subtitle={`${history.length} pindaian`}
      rightLabel="Hapus Riwayat"
      onRightPress={handleClearHistory}
    />
  );

  const historyList = (
    <>
      {isWeb ? (
        <View style={styles.sectionHeaderWeb}>{sectionHeader}</View>
      ) : (
        sectionHeader
      )}

      {groups.map((group) => (
        <View key={group.key} style={styles.group}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          <View style={[styles.cardList, isWebGrid && styles.cardGrid]}>
            {group.items.map((item) => renderItem(item, group.key))}
          </View>
        </View>
      ))}
    </>
  );

  return (
    <View style={[styles.container, !isWeb && { paddingTop: insets.top + 16 }]}>
      <WebDocumentTitle title="Riwayat" />
      {isWeb ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            styles.scrollContentWeb,
            {
              maxWidth: webMaxWidth,
              paddingHorizontal: webPadding,
              paddingTop: insets.top + 16,
            },
            history.length === 0 && styles.scrollEmptyWeb,
          ]}
        >
          {headerBlock}
          {history.length === 0 ? emptyBlock : historyList}
        </ScrollView>
      ) : (
        <>
          {headerBlock}
          {history.length === 0 ? (
            emptyBlock
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {historyList}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
  },
  headerWeb: {
    paddingHorizontal: 0,
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  scrollContentWeb: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  scrollEmptyWeb: {
    flexGrow: 1,
  },
  sectionHeaderWeb: {
    marginTop: 24,
  },
  group: {
    marginTop: 20,
  },
  groupLabel: {
    ...Typography.cardBody,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cardList: {
    gap: 12,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  motifName: {
    ...Typography.cardName,
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    marginTop: 24,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.detailBody,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  secondaryButton: {
    alignSelf: 'stretch',
    marginTop: 24,
    marginHorizontal: 20,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...Typography.buttonLabel,
    color: Colors.accent,
  },
});
