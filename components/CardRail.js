import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, layout, type , fonts } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

export function CardRail({
  title,
  subtitle,
  actionLabel = 'See all',
  onAction,
  children,
  style,
  cardStep = 278,
}) {
  const scrollRef = useRef(null);
  const { isDesktop } = useResponsive();
  const [offset, setOffset] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const canPrev = offset > 8;
  const canNext =
    viewportWidth > 0 &&
    contentWidth > viewportWidth &&
    offset + viewportWidth < contentWidth - 8;

  const scrollBy = (direction) => {
    const step = Math.max(viewportWidth * 0.78, cardStep);
    scrollRef.current?.scrollTo({
      x: Math.max(0, offset + direction * step),
      animated: true,
    });
  };

  return (
    <View style={[styles.clip, !isDesktop && styles.clipBleed, style]}>
      <View style={[styles.header, !isDesktop && styles.headerMobile]}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        <View style={styles.controls}>
          {isDesktop ? (
            <View style={styles.arrows}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Scroll ${title} left`}
                accessibilityState={{ disabled: !canPrev }}
                disabled={!canPrev}
                onPress={() => scrollBy(-1)}
                style={({ pressed }) => [
                  styles.arrow,
                  !canPrev && styles.arrowDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="arrow-back"
                  size={15}
                  color={canPrev ? colors.ink : colors.lineStrong}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Scroll ${title} right`}
                accessibilityState={{ disabled: !canNext }}
                disabled={!canNext}
                onPress={() => scrollBy(1)}
                style={({ pressed }) => [
                  styles.arrow,
                  !canNext && styles.arrowDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color={canNext ? colors.ink : colors.lineStrong}
                />
              </Pressable>
            </View>
          ) : null}

          {onAction ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${actionLabel} ${title}`}
              onPress={onAction}
              style={({ pressed }) => [
                styles.action,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.actionText}>{actionLabel}</Text>
              <Ionicons
                name="arrow-forward"
                size={13}
                color={colors.ink}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rail}
        contentContainerStyle={[
          styles.railContent,
          !isDesktop && styles.railContentMobile,
        ]}
        onScroll={(event) => {
          const next = event.nativeEvent.contentOffset.x;
          setOffset(next);
          setViewportWidth(event.nativeEvent.layoutMeasurement.width);
        }}
        scrollEventThrottle={32}
        onContentSizeChange={(width) => setContentWidth(width)}
        onLayout={(event) =>
          setViewportWidth(event.nativeEvent.layout.width)
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
    position: 'relative',
  },
  clipBleed: {
    marginHorizontal: -layout.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 14,
  },
  headerMobile: {
    paddingHorizontal: layout.screenPadding,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  subtitle: {
    ...type.tiny,
    marginTop: 3,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 1,
  },
  arrows: {
    flexDirection: 'row',
    gap: 7,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.surfaceMuted,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
  },
  actionText: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  rail: {
    marginHorizontal: 0,
  },
  railContent: {
    gap: 14,
    paddingBottom: 2,
  },
  railContentMobile: {
    paddingHorizontal: layout.screenPadding,
  },
  pressed: {
    opacity: 0.76,
  },
});
