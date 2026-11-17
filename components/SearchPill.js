import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, type } from '@/constants/theme';
import { getSearchSummary } from '@/components/SearchSheet';
import { EMPTY_SEARCH } from '@/utils/trainerFilters';

export function SearchPill({
  value = EMPTY_SEARCH,
  onPress,
  isDesktop = false,
  style,
}) {
  const summary = getSearchSummary(value);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Search: ${summary.where}, ${summary.when}, ${summary.who}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.bar,
        isDesktop && styles.barDesktop,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="search" size={isDesktop ? 17 : 16} color={colors.ink} />
      </View>

      {isDesktop ? (
        <>
          <View style={styles.segment}>
            <Text style={styles.segmentLabel}>Where</Text>
            <Text numberOfLines={1} style={styles.segmentValue}>
              {summary.where}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.segment}>
            <Text style={styles.segmentLabel}>When</Text>
            <Text numberOfLines={1} style={styles.segmentValue}>
              {summary.when}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.segment}>
            <Text style={styles.segmentLabel}>Who</Text>
            <Text numberOfLines={1} style={styles.segmentValue}>
              {summary.who}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.mobileCopy}>
          <Text numberOfLines={1} style={styles.mobileTitle}>
            {summary.where}
          </Text>
          <Text numberOfLines={1} style={styles.mobileMeta}>
            {summary.when} · {summary.who}
          </Text>
        </View>
      )}

      <View style={[styles.searchButton, isDesktop && styles.searchButtonDesktop]}>
        <Ionicons name="search" size={isDesktop ? 17 : 15} color={colors.ink} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 8,
    paddingRight: 6,
    ...shadows.card,
  },
  barDesktop: {
    height: 66,
    paddingLeft: 10,
    paddingRight: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.998 }],
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.voltSoft,
  },
  segment: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  segmentLabel: {
    ...type.label,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.8,
  },
  segmentValue: {
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.line,
  },
  mobileCopy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  mobileTitle: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  mobileMeta: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    color: colors.muted,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDesktop: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
