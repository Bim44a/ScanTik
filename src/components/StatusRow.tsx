import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { API_BASE_URL } from '@/config/api';
import { checkHealth, HealthCheckResult } from '@/services/health';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

/**
 * Baris "Status layanan".
 * Memeriksa health setiap kali layar Help difokuskan; hasil dari
 * pemeriksaan lama diabaikan jika layar sudah ditinggalkan.
 */
export default function StatusRow() {
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const runCheck = async () => {
        setIsChecking(true);
        setResult(null);

        if (!API_BASE_URL) {
          if (!cancelled) {
            setResult({ ok: false, message: '' });
            setIsChecking(false);
          }
          return;
        }

        const healthResult = await checkHealth();
        if (!cancelled) {
          setResult(healthResult);
          setIsChecking(false);
        }
      };

      runCheck();

      return () => {
        cancelled = true;
      };
    }, [attempt])
  );

  const handleRetry = () => {
    setAttempt((current) => current + 1);
  };

  const isSuccess = result?.ok === true;
  const isFailure = result !== null && result.ok === false;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Status layanan</Text>

      <View style={styles.right}>
        {isChecking ? (
          <>
            <ActivityIndicator size="small" color={Colors.accent} />
            <Text style={styles.value}>Memeriksa layanan...</Text>
          </>
        ) : isSuccess ? (
          <>
            <View style={[styles.dot, styles.dotActive]} />
            <Text style={styles.value}>Layanan siap</Text>
          </>
        ) : isFailure ? (
          <>
            <View style={[styles.dot, styles.dotInactive]} />
            <Text style={styles.value}>Layanan tidak dapat dihubungi</Text>
            <Pressable onPress={handleRetry} hitSlop={8}>
              <Text style={styles.link}>Coba lagi</Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
  },
  label: {
    ...Typography.cardBody,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    flexShrink: 1,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.accent,
  },
  dotInactive: {
    backgroundColor: Colors.textSecondary,
  },
  value: {
    ...Typography.cardBody,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  link: {
    ...Typography.linkGold,
    color: Colors.accent,
  },
});
