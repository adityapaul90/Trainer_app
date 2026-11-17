import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/Chip';
import { CardRail } from '@/components/CardRail';
import { DesktopHeader } from '@/components/DesktopHeader';
import { ScreenMeta } from '@/components/ScreenMeta';
import { SearchPill } from '@/components/SearchPill';
import { SearchSheet } from '@/components/SearchSheet';
import { TrainerCard } from '@/components/TrainerCard';
import {
  colors,
  layout,
  radius,
  shadows,
  type,
} from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import {
  CATEGORIES,
  getTrainerById,
  getTrainerVenue,
  PROMO_IMAGE,
  SESSION_TYPES,
  TRAINERS,
  USER,
} from '@/data/trainers';
import { useResponsive } from '@/hooks/useResponsive';
import { formatMonthDay, formatRelativeDay } from '@/utils/dates';
import { EMPTY_SEARCH } from '@/utils/trainerFilters';

const topRated = [...TRAINERS]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 7);

const nearby = [...TRAINERS]
  .sort((a, b) => a.distance - b.distance)
  .slice(0, 7);

const availableToday = TRAINERS.filter(
  (trainer) => trainer.availableToday
);

export default function HomeScreen() {
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const { upcomingBookings, unreadCount } = useBookings();
  const [searchOpen, setSearchOpen] = useState(false);

  const nextBooking = upcomingBookings[0] || null;
  const nextTrainer = nextBooking
    ? getTrainerById(nextBooking.trainerId)
    : null;
  const nextDate = nextBooking ? formatMonthDay(nextBooking.dateKey) : null;
  const nextSessionType = nextBooking
    ? SESSION_TYPES.find((item) => item.id === nextBooking.sessionType)
    : null;

  const openExplore = (category) => {
    if (category && category !== 'all') {
      router.push({ pathname: '/explore', params: { category } });
      return;
    }
    router.push('/explore');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenMeta />
      <DesktopHeader active="home" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
      >
        <View style={styles.container}>
          {!isDesktop ? (
            <View style={styles.topBar}>
              <View>
                <Text style={styles.brand}>
                  instafit<Text style={styles.brandDot}>.</Text>
                </Text>
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={13}
                    color={colors.inkSoft}
                  />
                  <Text style={styles.locationText}>{USER.location}</Text>
                </View>
              </View>

              <View style={styles.topActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Messages${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  onPress={() => router.push('/inbox')}
                  style={({ pressed }) => [
                    styles.inboxButton,
                    pressed && styles.avatarPressed,
                  ]}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={19}
                    color={colors.ink}
                  />
                  {unreadCount > 0 ? (
                    <View style={styles.inboxBadge}>
                      <Text style={styles.inboxBadgeText}>{unreadCount}</Text>
                    </View>
                  ) : null}
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open profile"
                  onPress={() => router.push('/profile')}
                  style={({ pressed }) => [
                    styles.avatarButton,
                    pressed && styles.avatarPressed,
                  ]}
                >
                  <Image
                    source={USER.avatar}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                </Pressable>
              </View>
            </View>
          ) : null}

          <View
            style={[
              styles.heroSection,
              isDesktop && styles.heroSectionDesktop,
            ]}
          >
            <View style={styles.heroCopy}>
              {isDesktop ? (
                <Text style={styles.eyebrow}>Your training</Text>
              ) : null}
              <Text style={[styles.hero, isDesktop && styles.heroDesktop]}>
                {nextBooking
                  ? isDesktop
                    ? `Welcome back, ${USER.firstName}.`
                    : `Welcome back,\n${USER.firstName}.`
                  : isDesktop
                    ? 'Find your perfect trainer.'
                    : `Find your\nperfect trainer.`}
              </Text>
              <Text
                style={[
                  styles.heroSub,
                  isDesktop && styles.heroSubDesktop,
                ]}
              >
                {nextBooking
                  ? "Your next session is locked in. Let's keep the week moving."
                  : 'Book 1-on-1 sessions with vetted coaches near you.'}
              </Text>
            </View>

            {nextBooking && nextTrainer ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Open next session with ${nextTrainer.name} on ${formatRelativeDay(nextBooking.dateKey)} at ${nextBooking.time}`}
                onPress={() => router.push('/bookings')}
                style={({ pressed }) => [
                  styles.nextCard,
                  isDesktop && styles.nextCardDesktop,
                  pressed && styles.nextCardPressed,
                ]}
              >
                <View style={styles.nextTopRow}>
                  <View style={styles.nextLabelRow}>
                    <View style={styles.nextDot} />
                    <Text style={styles.nextLabel}>Next session</Text>
                  </View>
                  <Text style={styles.nextRelative}>
                    {formatRelativeDay(nextBooking.dateKey)}
                  </Text>
                </View>

                <View style={styles.nextMain}>
                  <View style={styles.nextDate}>
                    <Text style={styles.nextMonth}>{nextDate.month}</Text>
                    <Text style={styles.nextDay}>{nextDate.day}</Text>
                    <Text style={styles.nextWeekday}>{nextDate.weekday}</Text>
                  </View>

                  <View style={styles.nextInfo}>
                    <View style={styles.nextNameRow}>
                      <Image
                        source={nextTrainer.image}
                        style={styles.nextAvatar}
                        contentFit="cover"
                      />
                      <Text numberOfLines={1} style={styles.nextName}>
                        {nextTrainer.name}
                      </Text>
                    </View>
                    <Text numberOfLines={1} style={styles.nextMeta}>
                      {nextBooking.time} · {nextBooking.duration} min
                      {nextSessionType ? ` · ${nextSessionType.label}` : ''}
                    </Text>
                    <View style={styles.nextLocation}>
                      <Ionicons
                        name={
                          nextBooking.sessionType === 'online'
                            ? 'videocam-outline'
                            : 'location-outline'
                        }
                        size={12}
                        color="rgba(255,255,255,0.5)"
                      />
                      <Text numberOfLines={1} style={styles.nextLocationText}>
                        {nextBooking.sessionType === 'online'
                          ? 'Video session'
                          : getTrainerVenue(nextTrainer).name}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.nextArrow}>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={colors.volt}
                    />
                  </View>
                </View>
              </Pressable>
            ) : null}
          </View>

          <SearchPill
            value={EMPTY_SEARCH}
            onPress={() => setSearchOpen(true)}
            isDesktop={isDesktop}
            style={styles.searchPill}
          />

          <View style={[styles.categoryClip, !isDesktop && styles.categoryClipBleed]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.categoryRow,
                !isDesktop && styles.categoryRowMobile,
              ]}
            >
              {CATEGORIES.map((category) => (
                <Chip
                  key={category.id}
                  label={category.label}
                  icon={category.icon}
                  onPress={() => openExplore(category.id)}
                />
              ))}
            </ScrollView>
          </View>

          <CardRail
            title="Client favourites in Guwahati"
            subtitle="The coaches clients keep rebooking"
            onAction={() => openExplore()}
            style={styles.rail}
          >
            {topRated.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </CardRail>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explore strength coaches"
            onPress={() => openExplore('strength')}
            style={({ pressed }) => [
              styles.promo,
              isDesktop && styles.promoDesktop,
              pressed && styles.promoPressed,
            ]}
          >
            <Image
              source={PROMO_IMAGE}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={250}
            />
            <LinearGradient
              colors={['rgba(16,18,13,0.06)', 'rgba(16,18,13,0.92)']}
              locations={[0.1, 0.95]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.promoTopRow}>
              <View style={styles.promoBadge}>
                <View style={styles.promoBadgeDot} />
                <Text style={styles.promoBadgeText}>Coach picks</Text>
              </View>
            </View>
            <View
              style={[
                styles.promoContent,
                isDesktop && styles.promoContentDesktop,
              ]}
            >
              <Text style={styles.promoEyebrow}>Strength starts here</Text>
              <Text
                style={[
                  styles.promoTitle,
                  isDesktop && styles.promoTitleDesktop,
                ]}
              >
                Build your base with a coach who gets you.
              </Text>
              <View style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Explore strength</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.ink} />
              </View>
            </View>
          </Pressable>

          <CardRail
            title="Popular near you"
            subtitle="Within 5 km of downtown Guwahati"
            onAction={() => openExplore()}
            style={styles.rail}
          >
            {nearby.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </CardRail>

          <CardRail
            title="Available today in Guwahati"
            subtitle="Open slots before the day is done"
            onAction={() => openExplore()}
            style={styles.rail}
          >
            {availableToday.map((trainer) => (
              <TrainerCard key={trainer.id} trainer={trainer} />
            ))}
          </CardRail>

          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={colors.inkSoft}
              />
              <Text style={styles.trustText}>Vetted coaches</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons
                name="refresh-outline"
                size={14}
                color={colors.inkSoft}
              />
              <Text style={styles.trustText}>Free rescheduling</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={colors.inkSoft}
              />
              <Text style={styles.trustText}>Secure payments</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {searchOpen ? (
        <SearchSheet
          visible
          onClose={() => setSearchOpen(false)}
          initial={EMPTY_SEARCH}
          onSubmit={(value) => {
            router.push({
              pathname: '/explore',
              params: {
                q: value.query || undefined,
                area: value.area || undefined,
                when: value.when !== 'any' ? value.when : undefined,
                who: value.who !== 'solo' ? value.who : undefined,
                category:
                  value.category !== 'all' ? value.category : undefined,
              },
            });
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  scrollContentDesktop: {
    paddingBottom: 56,
    paddingTop: 30,
  },
  container: {
    width: '100%',
    maxWidth: layout.wideWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  brand: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -1.4,
    color: colors.ink,
  },
  brandDot: {
    color: colors.volt,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.volt,
    backgroundColor: colors.surfaceMuted,
    ...shadows.card,
  },
  avatarPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inboxButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  inboxBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.volt,
    borderWidth: 1.5,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inboxBadgeText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '800',
    color: colors.ink,
  },
  eyebrow: {
    ...type.label,
    marginBottom: 8,
  },
  heroSection: {
    width: '100%',
  },
  heroSectionDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 56,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  hero: {
    ...type.display,
    fontSize: 34,
    lineHeight: 38,
    marginTop: 26,
  },
  heroDesktop: {
    fontSize: 52,
    lineHeight: 56,
    letterSpacing: -2.2,
    marginTop: 0,
  },
  heroSub: {
    ...type.small,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 310,
    marginTop: 8,
  },
  heroSubDesktop: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 460,
    marginTop: 12,
  },
  nextCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: radius.xl,
    backgroundColor: colors.darkCard,
    borderWidth: 1,
    borderColor: colors.darkLine,
    ...shadows.card,
  },
  nextCardDesktop: {
    width: 432,
    marginTop: 0,
    padding: 18,
    borderRadius: radius.xxl,
  },
  nextCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  nextTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  nextLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.volt,
  },
  nextLabel: {
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.52)',
  },
  nextRelative: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.42)',
  },
  nextMain: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nextDate: {
    width: 54,
    paddingVertical: 7,
    borderRadius: radius.md,
    backgroundColor: colors.volt,
    alignItems: 'center',
  },
  nextMonth: {
    fontSize: 8.5,
    lineHeight: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: 'rgba(16,18,13,0.58)',
  },
  nextDay: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.ink,
  },
  nextWeekday: {
    fontSize: 8.5,
    lineHeight: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: 'rgba(16,18,13,0.58)',
  },
  nextInfo: {
    flex: 1,
    minWidth: 0,
  },
  nextNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  nextAvatar: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.darkLine,
  },
  nextName: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
    color: colors.white,
  },
  nextMeta: {
    marginTop: 4,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.72)',
  },
  nextLocation: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nextLocationText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.46)',
  },
  nextArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPill: {
    marginTop: 22,
  },
  rail: {
    marginTop: 32,
  },
  categoryClip: {
    overflow: 'hidden',
    position: 'relative',
  },
  categoryClipBleed: {
    marginHorizontal: -layout.screenPadding,
  },
  pressed: {
    opacity: 0.75,
  },
  categoryRow: {
    paddingTop: 16,
    paddingBottom: 2,
    gap: 8,
  },
  categoryRowMobile: {
    paddingHorizontal: layout.screenPadding,
  },
  promo: {
    marginTop: 30,
    height: 232,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    justifyContent: 'space-between',
    backgroundColor: colors.darkCard,
    ...shadows.card,
  },
  promoDesktop: {
    height: 300,
    marginTop: 44,
  },
  promoPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  promoTopRow: {
    padding: 16,
    flexDirection: 'row',
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  promoBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.volt,
  },
  promoBadgeText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.white,
  },
  promoContent: {
    padding: 18,
    gap: 8,
  },
  promoContentDesktop: {
    padding: 30,
    maxWidth: 560,
    gap: 10,
  },
  promoEyebrow: {
    ...type.label,
    color: colors.volt,
  },
  promoTitle: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: colors.white,
    maxWidth: 310,
  },
  promoTitleDesktop: {
    fontSize: 32,
    lineHeight: 37,
    letterSpacing: -1,
    maxWidth: 460,
  },
  promoButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    backgroundColor: colors.volt,
  },
  promoButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },
  trustRow: {
    marginTop: 34,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    color: colors.muted,
  },
});
