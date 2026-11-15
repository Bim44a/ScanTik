import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppIcon, { AppIconName } from '@/components/AppIcon';
import { Colors } from '@/theme/colors';

export interface IconCircleProps {
  name: AppIconName;
  size?: number;
  iconSize?: number;
}

/**
 * Ikon dalam lingkaran accentSoft dengan ikon accent
 * sesuai design-report.md Bagian 4.
 */
export default function IconCircle({ name, size = 88, iconSize = 36 }: IconCircleProps) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <AppIcon name={name} size={iconSize} color={Colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentSoft,
  },
});
