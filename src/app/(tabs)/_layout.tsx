import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from '@/components/AppIcon';
import WebSidebar from '@/components/WebSidebar';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const breakpoint = useBreakpoint();

  // SDK 58 menyediakan tabBarPosition: 'left', tetapi tidak ada slot untuk
  // wordmark "ScanTik". Desktop web memakai sidebar kustom dan tab bar
  // bawah disembunyikan.
  const isDesktopWeb = Platform.OS === 'web' && breakpoint === 'desktop';
  const isWeb = Platform.OS === 'web';

  const tabs = (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Latar scene navigator di web harus gelap agar area di luar wadah
        // konten tidak menampilkan latar terang bawaan.
        ...(isWeb ? { sceneStyle: { backgroundColor: Colors.background } } : null),
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: isDesktopWeb
          ? styles.hiddenTabBar
          : {
              backgroundColor: Colors.background,
              borderTopColor: Colors.border,
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom + 8,
              paddingTop: 8,
            },
        tabBarLabel: ({ focused, color, children }) => (
          <Text
            style={{
              color,
              ...(focused ? Typography.tabLabelActive : Typography.tabLabelInactive),
            }}
          >
            {children}
          </Text>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => (
            <AppIcon name={color === Colors.accent ? 'scan' : 'scan-outline'} size={24} color={String(color ?? Colors.textSecondary)} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Katalog',
          tabBarIcon: ({ color }) => (
            <AppIcon name={color === Colors.accent ? 'grid' : 'grid-outline'} size={24} color={String(color ?? Colors.textSecondary)} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color }) => (
            <AppIcon name={color === Colors.accent ? 'time' : 'time-outline'} size={24} color={String(color ?? Colors.textSecondary)} />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color }) => (
            <AppIcon name={color === Colors.accent ? 'help-circle' : 'help-circle-outline'} size={24} color={String(color ?? Colors.textSecondary)} />
          ),
        }}
      />
    </Tabs>
  );

  if (!isWeb) return tabs;

  return (
    <View style={styles.webShell}>
      {isDesktopWeb ? <WebSidebar /> : null}
      <View style={styles.webContent}>{tabs}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  hiddenTabBar: {
    display: 'none',
  },
  webShell: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background,
  },
  webContent: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
