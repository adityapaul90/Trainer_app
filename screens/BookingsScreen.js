import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { DesktopHeader } from '@/components/DesktopHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenMeta } from '@/components/ScreenMeta';
import {
  colors,
  layout,
  radius,
  shadows,
  type,
  fonts,
} from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import {
  formatINR,
  getTrainerById,
  getTrainerVenue,
  SESSION_TYPES,
} from '@/data/trainers';
import {
  formatFullDate,
  formatMonthDay,
} from '@/utils/dates';
import { useResponsive } from '@/hooks/useResponsive';

function BookingCard({
  booking,
  isPast,
  onCancel,
  onViewTrainer,
  onBookAgain,
}) {
  const trainer = getTrainerById(booking.trainerId);
  if (!trainer) return null;

  const date = formatMonthDay(booking.dateKey);
  const sessionType = SESSION_TYPES.find(
    (item) => item.id === booking.sessionType
  );
  const cancelled = booking.status === 'cancelled';

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={trainer.image}
          style={styles.cardImage}
          contentFit="cover"
          contentPosition="top"
          transition={200}
        />
        <LinearGradient
          colors={['rgba(16,18,13,0.05)', 'rgba(16,18,13,0.8)']}
          locations={[0.25, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.datePill}>
          <Text style={styles.datePillText}>
            {date.month} {date.day} · {date.weekday}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            cancelled
              ? styles.statusCancelled
              : booking.status === 'confirmed'
                ? styles.statusConfirmed
                : styles.statusCompleted,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              cancelled
                ? styles.statusTextCancelled
                : booking.status === 'confirmed'
                  ? styles.statusTextConfirmed
                  : styles.statusTextCompleted,
            ]}
          >
            {cancelled
              ? 'Cancelled'
              : booking.status === 'confirmed'
                ? 'Confirmed'
                : 'Completed'}
          </Text>
        </View>
        <View style={styles.imageInfo}>
          <Text numberOfLines={1} style={styles.cardName}>
            {trainer.name}
          </Text>
          <Text numberOfLines={1} style={styles.cardRole}>
            {trainer.role}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={15} color={colors.inkSoft} />
          <Text style={styles.detailText}>
            {booking.time} · {booking.duration} min
            {sessionType ? ` · ${sessionType.label}` : ''}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name={
              booking.sessionType === 'online'
                ? 'videocam-outline'
                : 'location-outline'
            }
            size={15}
            color={colors.inkSoft}
          />
          <Text numberOfLines={1} style={styles.detailText}>
            {booking.sessionType === 'online'
              ? 'Online video call'
              : getTrainerVenue(trainer).name}
          </Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.price}>{formatINR(booking.total)}</Text>
            <Text style={styles.priceNote}>total</Text>
          </View>

          <View style={styles.cardActions}>
            {isPast ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Book ${trainer.name} again`}
                onPress={onBookAgain}
                style={({ pressed }) => [
                  styles.rebookButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="refresh" size={13} color={colors.ink} />
                <Text style={styles.rebookText}>Book again</Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={onCancel}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={onViewTrainer}
                  style={({ pressed }) => [
                    styles.viewButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.viewText}>View trainer</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={13}
                    color={colors.volt}
                  />
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function BookingsScreen() {
  const router = useRouter();
  const { width, isDesktop } = useResponsive();
  const {
    upcomingBookings,
    pastBookings,
    cancelBooking,
  } = useBookings();
  const [tab, setTab] = useState('upcoming');
  const [pendingCancel, setPendingCancel] = useState(null);

  const bookings = tab === 'upcoming' ? upcomingBookings : pastBookings;
  const pendingTrainer = pendingCancel
    ? getTrainerById(pendingCancel.trainerId)
    : null;

  const contentWidth = Math.min(width, layout.wideWidth);
  const cardWidth =
    (contentWidth - layout.screenPadding * 2 - 18) / 2;

  const confirmCancel = () => {
    if (pendingCancel) {
      cancelBooking(pendingCancel.id);
    }
    setPendingCancel(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenMeta
        title="My bookings"
        description="See your upcoming personal training sessions, training history, and free cancellation window."
      />
      <DesktopHeader active="bookings" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Your schedule</Text>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                My bookings
              </Text>
              <Text style={styles.subtitle}>
                Upcoming sessions and training history.
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="calendar" size={22} color={colors.ink} />
            </View>
          </View>

          <View
            style={[styles.segment, isDesktop && styles.segmentDesktop]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: tab === 'upcoming' }}
              onPress={() => setTab('upcoming')}
              style={({ pressed }) => [
                styles.segmentButton,
                tab === 'upcoming' && styles.segmentButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  tab === 'upcoming' && styles.segmentLabelActive,
                ]}
              >
                Upcoming
              </Text>
              <View
                style={[
                  styles.segmentCount,
                  tab === 'upcoming' && styles.segmentCountActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentCountText,
                    tab === 'upcoming' && styles.segmentCountTextActive,
                  ]}
                >
                  {upcomingBookings.length}
                </Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: tab === 'past' }}
              onPress={() => setTab('past')}
              style={({ pressed }) => [
                styles.segmentButton,
                tab === 'past' && styles.segmentButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  tab === 'past' && styles.segmentLabelActive,
                ]}
              >
                Past
              </Text>
              <View
                style={[
                  styles.segmentCount,
                  tab === 'past' && styles.segmentCountActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentCountText,
                    tab === 'past' && styles.segmentCountTextActive,
                  ]}
                >
                  {pastBookings.length}
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.noteRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={colors.muted}
            />
            <Text style={styles.noteText}>
              Free rescheduling up to 12 hours before a session.
            </Text>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {tab === 'upcoming' ? 'Next sessions' : 'Training history'}
            </Text>
            <Text style={styles.listCount}>
              {bookings.length} {bookings.length === 1 ? 'session' : 'sessions'}
            </Text>
          </View>

          {bookings.length > 0 ? (
            <View style={isDesktop ? styles.listGrid : styles.list}>
              {bookings.map((booking) => (
                <View
                  key={booking.id}
                  style={isDesktop ? { width: cardWidth } : undefined}
                >
                  <BookingCard
                    booking={booking}
                    isPast={tab === 'past'}
                    onCancel={() => setPendingCancel(booking)}
                    onViewTrainer={() =>
                      router.push(`/trainer/${booking.trainerId}`)
                    }
                    onBookAgain={() =>
                      router.push(`/booking/${booking.trainerId}`)
                    }
                  />
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon={
                tab === 'upcoming'
                  ? 'calendar-outline'
                  : 'time-outline'
              }
              title={
                tab === 'upcoming'
                  ? 'No sessions booked'
                  : 'Nothing here yet'
              }
              message={
                tab === 'upcoming'
                  ? 'Find a coach who fits your goals and lock in your first session.'
                  : 'Your completed and cancelled sessions will show up here.'
              }
              actionLabel={tab === 'upcoming' ? 'Find a trainer' : undefined}
              onAction={() => router.push('/explore')}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={Boolean(pendingCancel)}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingCancel(null)}
      >
        {pendingCancel ? (
          <View style={styles.modalOverlay}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close cancellation dialog"
              onPress={() => setPendingCancel(null)}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.modalCard}>
              <View style={styles.modalIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.danger}
                />
              </View>
              <Text style={styles.modalTitle}>Cancel this session?</Text>
              <Text style={styles.modalSession}>
                {pendingTrainer ? pendingTrainer.name : 'Your session'}
                {` · ${formatFullDate(pendingCancel.dateKey)} at ${pendingCancel.time}`}
              </Text>
              <Text style={styles.modalNote}>
                You can rebook anytime. Cancellations are free up to 12
                hours before the session.
              </Text>
              <View style={styles.modalActions}>
                <PrimaryButton
                  label="Keep session"
                  variant="outline"
                  icon={null}
                  onPress={() => setPendingCancel(null)}
                />
                <PrimaryButton
                  label="Cancel session"
                  variant="danger"
                  icon="close"
                  onPress={confirmCancel}
                />
              </View>
            </View>
          </View>
        ) : null}
      </Modal>
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
  container: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  containerDesktop: {
    maxWidth: layout.wideWidth,
    paddingTop: 32,
  },
  titleDesktop: {
    fontSize: 44,
    fontFamily: fonts.regular,
    lineHeight: 49,
    letterSpacing: -1.8,
  },
  segmentDesktop: {
    maxWidth: 420,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 10,
    gap: 12,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    ...type.label,
  },
  title: {
    ...type.display,
    fontSize: 32,
    fontFamily: fonts.regular,
    lineHeight: 37,
    marginTop: 5,
  },
  subtitle: {
    ...type.small,
    marginTop: 6,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  segment: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    padding: 4,
    flexDirection: 'row',
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    height: 42,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  segmentButtonActive: {
    backgroundColor: colors.ink,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.muted,
  },
  segmentLabelActive: {
    color: colors.white,
  },
  segmentCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentCountActive: {
    backgroundColor: colors.volt,
  },
  segmentCountText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.muted,
  },
  segmentCountTextActive: {
    color: colors.ink,
  },
  noteRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  noteText: {
    ...type.tiny,
  },
  listHeader: {
    marginTop: 26,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  listTitle: {
    ...type.h2,
    fontSize: 19,
    fontFamily: fonts.regular,
  },
  listCount: {
    ...type.tiny,
    fontWeight: '600',
    fontFamily: fonts.semibold,
  },
  list: {
    gap: 14,
  },
  listGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.card,
  },
  imageWrap: {
    height: 156,
    backgroundColor: colors.surfaceMuted,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  datePill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  datePillText: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: 0.4,
    color: colors.ink,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  statusConfirmed: {
    backgroundColor: colors.volt,
    borderColor: colors.volt,
  },
  statusCompleted: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderColor: 'rgba(255,255,255,0.92)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(16,18,13,0.74)',
    borderColor: 'rgba(255,255,255,0.14)',
  },
  statusText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusTextConfirmed: {
    color: colors.ink,
  },
  statusTextCompleted: {
    color: colors.ink,
  },
  statusTextCancelled: {
    color: '#FF9A9D',
  },
  imageInfo: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
  },
  cardName: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.5,
    color: colors.white,
  },
  cardRole: {
    fontSize: 11,
    fontFamily: fonts.regular,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 1,
  },
  cardBody: {
    padding: 14,
    gap: 7,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  detailText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.inkSoft,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginTop: 4,
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  priceNote: {
    ...type.tiny,
    marginTop: -1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cancelButton: {
    height: 36,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.danger,
  },
  viewButton: {
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewText: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.white,
  },
  rebookButton: {
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.volt,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rebookText: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  pressed: {
    opacity: 0.72,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,18,13,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 20,
    alignItems: 'center',
  },
  modalIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(217,74,74,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    ...type.h2,
    textAlign: 'center',
  },
  modalSession: {
    ...type.small,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.inkSoft,
  },
  modalNote: {
    ...type.small,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  modalActions: {
    width: '100%',
    gap: 8,
  },
});
