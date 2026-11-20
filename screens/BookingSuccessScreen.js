import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenMeta } from '@/components/ScreenMeta';
import { colors, layout, radius, type , fonts } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import {
  getTrainerById,
  getTrainerVenue,
  SESSION_TYPES,
} from '@/data/trainers';
import { formatFullDate } from '@/utils/dates';

export default function BookingSuccessScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { bookings, getBooking } = useBookings();

  const bookingId = Array.isArray(id) ? id[0] : id;
  const booking = bookingId ? getBooking(bookingId) : bookings[0];
  const trainer = booking ? getTrainerById(booking.trainerId) : null;
  const sessionType = booking
    ? SESSION_TYPES.find((item) => item.id === booking.sessionType)
    : null;

  const [scale] = useState(() => new Animated.Value(0.55));
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  const goToBookings = () => router.replace('/bookings');
  const goHome = () => router.replace('/');

  return (
    <View style={styles.screen}>
      <ScreenMeta
        title="Booking confirmed"
        description="Your personal training session is locked in. Review the details and get ready to train."
      />
      <StatusBar style="light" />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.topBar}>
            <Text style={styles.brand}>
              instafit<Text style={styles.brandDot}>.</Text>
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close confirmation"
              onPress={goToBookings}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="close" size={20} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.main}>
            <Animated.View
              style={[
                styles.checkWrap,
                { opacity, transform: [{ scale }] },
              ]}
            >
              <View style={styles.checkCircle}>
                <Ionicons
                  name="checkmark"
                  size={52}
                  color={colors.ink}
                />
              </View>
            </Animated.View>

            <Text style={styles.eyebrow}>Session confirmed</Text>
            <Text style={styles.title}>Your trainer is booked.</Text>
            <Text style={styles.subtitle}>
              Your coach is locked in. Show up ready to move.
            </Text>

            {booking && trainer ? (
              <View style={styles.bookingCard}>
                <View style={styles.trainerRow}>
                  <Image
                    source={trainer.image}
                    style={styles.trainerImage}
                    contentFit="cover"
                  />
                  <View style={styles.trainerInfo}>
                    <Text style={styles.trainerName}>{trainer.name}</Text>
                    <Text style={styles.trainerRole}>{trainer.role}</Text>
                  </View>
                  <View style={styles.confirmedBadge}>
                    <Text style={styles.confirmedText}>Confirmed</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={colors.volt}
                  />
                  <Text style={styles.detailText}>
                    {formatFullDate(booking.dateKey)} · {booking.time}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={colors.volt}
                  />
                  <Text style={styles.detailText}>
                    {booking.duration} min ·{' '}
                    {sessionType ? sessionType.label : 'Session'}
                  </Text>
                </View>
                {booking.name ? (
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color={colors.volt}
                    />
                    <Text style={styles.detailText}>
                      {booking.name}
                      {booking.phone ? ` · +91 ${booking.phone}` : ''}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.detailRow}>
                  <Ionicons
                    name={
                      booking.sessionType === 'online'
                        ? 'videocam-outline'
                        : 'location-outline'
                    }
                    size={16}
                    color={colors.volt}
                  />
                  <Text style={styles.detailText}>
                    {booking.sessionType === 'online'
                      ? 'Video link sent before your session'
                      : getTrainerVenue(trainer).name}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.bookingCard}>
                <Text style={styles.detailText}>
                  Your session has been added to your bookings.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label="View my bookings"
              variant="volt"
              onPress={goToBookings}
            />
            <Pressable
              accessibilityRole="button"
              onPress={goHome}
              style={({ pressed }) => [
                styles.secondary,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryText}>Back to home</Text>
              <Ionicons
                name="arrow-forward"
                size={14}
                color={colors.white}
              />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    overflow: 'hidden',
  },
  safe: {
    flex: 1,
  },
  glowTop: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.volt,
    opacity: 0.08,
    top: -140,
    right: -110,
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.volt,
    opacity: 0.05,
    bottom: -160,
    left: -100,
    pointerEvents: 'none',
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  brand: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -1.3,
    color: colors.white,
  },
  brandDot: {
    color: colors.volt,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  pressed: {
    opacity: 0.75,
  },
  main: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  checkWrap: {
    marginBottom: 22,
  },
  checkCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    ...type.label,
    color: colors.volt,
  },
  title: {
    fontSize: 38,
    lineHeight: 43,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -1.6,
    color: colors.white,
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.62)',
    textAlign: 'center',
    maxWidth: 290,
    marginTop: 8,
  },
  bookingCard: {
    marginTop: 26,
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.darkCard,
    borderWidth: 1,
    borderColor: colors.darkLine,
    borderRadius: radius.xl,
    padding: 16,
    gap: 9,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trainerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.darkLine,
  },
  trainerInfo: {
    flex: 1,
    minWidth: 0,
  },
  trainerName: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.white,
  },
  trainerRole: {
    fontSize: 11,
    fontFamily: fonts.regular,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.48)',
    marginTop: 1,
  },
  confirmedBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(216,255,79,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(216,255,79,0.3)',
  },
  confirmedText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.volt,
  },
  divider: {
    height: 1,
    backgroundColor: colors.darkLine,
    marginVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: 'rgba(255,255,255,0.82)',
  },
  actions: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: 8,
  },
  secondary: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.white,
  },
});
