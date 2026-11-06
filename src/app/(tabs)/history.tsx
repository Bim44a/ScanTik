import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { getHistory, clearHistory } from '@/storage/history';
import { HistoryItem } from '@/types/history';
import { setScanSession } from '@/state/scanSession';

export default function HistoryScreen() {
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

  const formatDateTime = (createdAt: string): string => {
    const date = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = (d: Date) => d.toDateString();

    if (dateOnly(date) === dateOnly(today)) {
      // Hari ini
      return `Hari ini, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dateOnly(date) === dateOnly(yesterday)) {
      // Kemarin
      return `Kemarin, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      // Tanggal lain
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('id-ID', { month: 'short' });
      const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return `${day} ${month}, ${time}`;
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const isUnrecognized = item.predictedClass === 'Negatif';
    const formattedScore = item.confidenceScore.toFixed(1).replace('.', ',');
    const formattedDateTime = formatDateTime(item.createdAt);

    return (
      <Pressable style={styles.card} onPress={() => handleOpenResult(item)}>
        <Image source={{ uri: item.imageUri }} style={styles.thumbnail} resizeMode="cover" />
        <View style={styles.cardContent}>
          <Text style={styles.motifName}>{item.motifName}</Text>
          {!isUnrecognized && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Kecocokan {formattedScore}%</Text>
            </View>
          )}
          <Text style={styles.dateText}>{formattedDateTime}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Pindaian</Text>
        <Text style={styles.subtitle}>Jejak penemuan motif batik Anda.</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada riwayat pindaian.</Text>
          <Pressable onPress={() => router.push('/(tabs)')} style={styles.linkButton}>
            <Text style={styles.linkText}>Kembali ke Scanner</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pindaian terbaru ({history.length})</Text>
            <Pressable onPress={handleClearHistory}>
              <Text style={styles.clearText}>Hapus Riwayat</Text>
            </Pressable>
          </View>
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </>
      )}
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
    ...Typography.screenTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    ...Typography.cardBody,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  linkButton: {
    marginTop: 12,
  },
  linkText: {
    ...Typography.buttonLabel,
    color: Colors.accent,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  clearText: {
    ...Typography.cardBody,
    color: Colors.accent,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 4,
  },
  motifName: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    ...Typography.badge,
    color: Colors.onBadge,
    fontSize: 10,
  },
  dateText: {
    ...Typography.metadata,
    color: Colors.textSecondary,
    fontSize: 12,
  },
});