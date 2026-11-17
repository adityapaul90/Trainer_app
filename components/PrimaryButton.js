import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows } from '@/constants/theme';

const VARIANTS = {
  dark: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    label: colors.white,
    iconBackground: 'rgba(255, 255, 255, 0.14)',
    icon: colors.volt,
  },
  volt: {
    backgroundColor: colors.volt,
    borderColor: colors.volt,
    label: colors.ink,
    iconBackground: 'rgba(16, 18, 13, 0.1)',
    icon: colors.ink,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.lineStrong,
    label: colors.ink,
    iconBackground: colors.surfaceMuted,
    icon: colors.ink,
  },
  danger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
    label: colors.white,
    iconBackground: 'rgba(255, 255, 255, 0.16)',
    icon: colors.white,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    label: colors.ink,
    iconBackground: colors.surfaceMuted,
    icon: colors.ink,
  },
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'dark',
  icon = 'arrow-forward',
  disabled = false,
  style,
  accessibilityLabel,
}) {
  const palette = VARIANTS[variant] || VARIANTS.dark;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
        variant === 'dark' && shadows.card,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, { color: palette.label }]}>{label}</Text>
      {icon ? (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: palette.iconBackground },
          ]}
        >
          <Ionicons name={icon} size={15} color={palette.icon} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingLeft: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
