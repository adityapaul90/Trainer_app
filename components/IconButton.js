import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { colors, shadows } from '@/constants/theme';

const VARIANTS = {
  surface: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    icon: colors.ink,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    icon: colors.ink,
  },
  dark: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    icon: colors.white,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    icon: colors.ink,
  },
  danger: {
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    borderColor: 'transparent',
    icon: colors.heart,
  },
};

export function IconButton({
  name,
  onPress,
  size = 20,
  variant = 'surface',
  color,
  style,
  accessibilityLabel,
  disabled = false,
}) {
  const palette = VARIANTS[variant] || VARIANTS.surface;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
        variant === 'surface' && shadows.card,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={color || palette.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
