import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';

export type AppIconName = keyof typeof Ionicons.glyphMap;

export interface AppIconProps extends Omit<ComponentProps<typeof Ionicons>, 'name'> {
  name: AppIconName;
}

export default function AppIcon({ name, size = 24, color = 'black', ...props }: AppIconProps) {
  return <Ionicons name={name} size={size} color={String(color)} {...props} />;
}
