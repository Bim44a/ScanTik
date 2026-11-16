import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from '@/components/AppIcon';

const ITEMS = [
  {
    href: '/(tabs)',
    path: '/',
    label: 'Scanner',
    icon: 'scan-outline',
    activeIcon: 'scan',
  },
  {
    href: '/(tabs)/catalog',
    path: '/catalog',
    label: 'Katalog',
    icon: 'grid-outline',
    activeIcon: 'grid',
  },
  {
    href: '/(tabs)/history',
    path: '/history',
    label: 'Riwayat',
    icon: 'time-outline',
    activeIcon: 'time',
  },
  {
    href: '/(tabs)/help',
    path: '/help',
    label: 'Help',
    icon: 'help-circle-outline',
    activeIcon: 'help-circle',
  },
] as const;

/**
 * Sidebar kiri khusus web desktop (>= 1024): wordmark, empat menu vertikal,
 * item aktif berlatar accentSoft dengan ikon dan teks emas.
 */
export default function WebSidebar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View style={[styles.sidebar, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.wordmark}>ScanTik</Text>

      <View style={styles.menu}>
        {ITEMS.map((item) => {
          const isActive =
            item.path === '/'
              ? pathname === '/'
              : pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Pressable
              key={item.href}
              onPress={() => router.navigate(item.href)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[styles.item, isActive && styles.itemActive]}
            >
              <AppIcon
                name={isActive ? item.activeIcon : item.icon}
                size={22}
                color={isActive ? Colors.accent : Colors.textSecondary}
              />
              <Text
                style={[styles.label, isActive && styles.labelActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    height: '100%',
    backgroundColor: Colors.background,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  wordmark: {
    ...Typography.wordmark,
    color: Colors.accent,
    paddingHorizontal: 8,
  },
  menu: {
    marginTop: 32,
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  itemActive: {
    backgroundColor: Colors.accentSoft,
  },
  label: {
    ...Typography.buttonLabel,
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.accent,
  },
});
