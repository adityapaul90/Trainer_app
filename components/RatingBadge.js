import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors , fonts } from '@/constants/theme';

const TONES = {
  dark: {
    backgroundColor: 'rgba(16, 18, 13, 0.74)',
    star: colors.volt,
    text: colors.white,
    count: 'rgba(255, 255, 255, 0.66)',
  },
  light: {
    backgroundColor: colors.surface,
    star: colors.star,
    text: colors.ink,
    count: colors.muted,
  },
  plain: {
    backgroundColor: 'transparent',
    star: colors.star,
    text: colors.ink,
    count: colors.muted,
  },
};

export function RatingBadge({
  rating,
  reviewCount,
  tone = 'dark',
  size = 12,
  style,
}) {
  const palette = TONES[tone] || TONES.dark;

  return (
    <View
      style={[
        styles.base,
        tone !== 'plain' && styles.padded,
        { backgroundColor: palette.backgroundColor },
        style,
      ]}
    >
      <Ionicons name="star" size={size} color={palette.star} />
      <Text style={[styles.rating, { color: palette.text, fontSize: size }]}>
        {rating.toFixed(2)}
      </Text>
      {reviewCount ? (
        <Text style={[styles.count, { color: palette.count, fontSize: size }]}>
          ({reviewCount})
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  padded: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
  },
  rating: {
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.2,
  },
  count: {
    fontWeight: '500',
    fontFamily: fonts.medium,
  },
});
