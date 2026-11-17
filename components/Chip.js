import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/theme';

export function Chip({
  label,
  icon,
  selected = false,
  onPress,
  small = false,
  style,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        selected && styles.selected,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={small ? 13 : 15}
          color={selected ? colors.volt : colors.inkSoft}
        />
      ) : null}
      <Text
        style={[
          styles.label,
          small && styles.labelSmall,
          selected && styles.labelSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  small: {
    height: 32,
    paddingHorizontal: 12,
    gap: 5,
  },
  selected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  pressed: {
    opacity: 0.78,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
  },
  labelSelected: {
    color: colors.white,
  },
});
