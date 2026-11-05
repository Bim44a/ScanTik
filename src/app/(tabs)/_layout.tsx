import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import AppIcon from '@/components/AppIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
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
            <AppIcon name={color === Colors.accent ? 'book' : 'book-outline'} size={24} color={String(color ?? Colors.textSecondary)} />
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
}
