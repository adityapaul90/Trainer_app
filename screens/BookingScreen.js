import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { FakeQrCode } from '@/components/FakeQrCode';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenMeta } from '@/components/ScreenMeta';
import { colors, layout, radius, shadows, type , fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';
import { usePublishedTrainers } from '@/context/PublishedTrainersContext';
import {
  DISABLED_SLOTS,
  DURATIONS,
  formatINR,
  getTrainerById,
  getTrainerVenue,
  SERVICE_FEE,
  SESSION_TYPES,
  TIME_SLOTS,
} from '@/data/trainers';
import {
  saveCustomerBooking,
  sendBookingOtp,
  verifyBookingOtp,
} from '@/services/customerBookings';
import { formatFullDate, getNextDays } from '@/utils/dates';
import { useResponsive } from '@/hooks/useResponsive';

function createBookingId() {
  return `bk-${Date.now()}`;
}

const PAYMENT_OPTIONS = [
  { id: 'upi', label: 'UPI', note: 'GPay · PhonePe · Paytm', icon: 'phone-portrait-outline' },
  { id: 'card', label: 'Card', note: 'Credit or debit', icon: 'card-outline' },
  {
    id: 'netbanking',
    label: 'Net banking',
    note: 'All major banks',
    icon: 'server-outline',
  },
];

function StepHeader({ number, title }) {
  return (
    <View style={styles.stepHeader}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
    </View>
  );
}

const PAYMENT_DELAY_MS = 3000;
const SCAN_SIZE = 232;

function PaymentSheet({ method, amountLabel, onComplete, onCancel }) {
  const option =
    PAYMENT_OPTIONS.find((item) => item.id === method) || PAYMENT_OPTIONS[0];
  const isUpi = option.id === 'upi';
  const progress = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const scan = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(sweep, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    const fill = Animated.timing(progress, {
      toValue: 1,
      duration: PAYMENT_DELAY_MS,
      useNativeDriver: false,
    });

    scan.start();
    fill.start(({ finished }) => {
      if (finished) completeRef.current();
    });

    return () => {
      scan.stop();
      fill.stop();
    };
  }, [progress, sweep]);

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onCancel}>
      <View style={sheetStyles.backdrop}>
        <View style={sheetStyles.card}>
          <View style={sheetStyles.header}>
            <Text style={sheetStyles.title}>
              {isUpi ? 'Scan to pay' : 'Processing payment'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel payment"
              hitSlop={8}
              onPress={onCancel}
              style={sheetStyles.closeButton}
            >
              <Ionicons name="close" size={18} color={colors.ink} />
            </Pressable>
          </View>

          <Text style={sheetStyles.amount}>{amountLabel}</Text>

          {isUpi ? (
            <View style={sheetStyles.scanFrame}>
              <FakeQrCode size={SCAN_SIZE} />
              <Animated.View
                style={[
                  sheetStyles.scanLine,
                  {
                    transform: [
                      {
                        translateY: sweep.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, SCAN_SIZE - 3],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          ) : (
            <View style={sheetStyles.processing}>
              <Ionicons name={option.icon} size={34} color={colors.ink} />
            </View>
          )}

          <Text style={sheetStyles.hint}>
            {isUpi
              ? 'Open GPay, PhonePe or Paytm and scan this code.'
              : 'Paying with ' + option.label + '. Please wait.'}
          </Text>

          <View style={sheetStyles.track}>
            <Animated.View
              style={[
                sheetStyles.fill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Text style={sheetStyles.note}>
            Test payment · no money will be charged.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

function DetailsSheet({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  verified,
  onVerified,
  onContinue,
  onClose,
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [error, setError] = useState('');

  const requestOtp = async () => {
    if (otpBusy) return;
    if (phone.trim().length !== 10) {
      setError('Enter a valid 10 digit phone number.');
      return;
    }
    setError('');
    setOtpBusy(true);
    try {
      await sendBookingOtp(phone.trim());
      setOtpSent(true);
      setOtpCode('');
    } catch (err) {
      setError(err.message || 'Could not send OTP.');
    } finally {
      setOtpBusy(false);
    }
  };

  const confirmOtp = async () => {
    if (verifyBusy) return;
    if (otpCode.trim().length !== 6) {
      setError('Enter the 6 digit OTP.');
      return;
    }
    setError('');
    setVerifyBusy(true);
    try {
      const data = await verifyBookingOtp(phone.trim(), otpCode.trim());
      onVerified(phone.trim(), data.verifyToken);
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setVerifyBusy(false);
    }
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={sheetStyles.backdrop}>
        <View style={sheetStyles.card}>
          <View style={sheetStyles.header}>
            <Text style={sheetStyles.title}>Your details</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close details"
              hitSlop={8}
              onPress={onClose}
              style={sheetStyles.closeButton}
            >
              <Ionicons name="close" size={18} color={colors.ink} />
            </Pressable>
          </View>

          <View style={sheetStyles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full name</Text>
            <TextInput
              value={name}
              onChangeText={onNameChange}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              style={styles.fieldInput}
              autoCapitalize="words"
              accessibilityLabel="Full name"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone number</Text>
            <View style={styles.phoneRow}>
              <TextInput
                value={phone}
                onChangeText={onPhoneChange}
                placeholder="10 digit number"
                placeholderTextColor={colors.muted}
                style={[styles.fieldInput, styles.phoneInput]}
                keyboardType="phone-pad"
                maxLength={10}
                accessibilityLabel="Phone number"
              />
              {verified ? (
                <View style={styles.verifiedChip}>
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color={colors.success}
                  />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Send OTP"
                  onPress={requestOtp}
                  disabled={otpBusy}
                  style={[styles.otpButton, otpBusy && styles.otpButtonDisabled]}
                >
                  <Text style={styles.otpButtonText}>
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {verified ? (
            <PrimaryButton
              label="Continue to payment"
              variant="volt"
              icon={null}
              onPress={onContinue}
            />
          ) : null}

          {otpSent && !verified ? (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Enter OTP</Text>
              <View style={styles.phoneRow}>
                <TextInput
                  value={otpCode}
                  onChangeText={setOtpCode}
                  placeholder="6 digit OTP"
                  placeholderTextColor={colors.muted}
                  style={[styles.fieldInput, styles.phoneInput]}
                  keyboardType="number-pad"
                  maxLength={6}
                  accessibilityLabel="One time password"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Verify OTP"
                  onPress={confirmOtp}
                  disabled={verifyBusy}
                  style={[styles.otpButton, verifyBusy && styles.otpButtonDisabled]}
                >
                  <Text style={styles.otpButtonText}>
                    {verifyBusy ? 'Verifying…' : 'Verify'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {error ? (
            <Text style={styles.detailsError}>{error}</Text>
          ) : null}

          <Text style={styles.fieldNote}>
            {verified
              ? 'Session updates will be sent on WhatsApp to this number.'
              : 'We send a one time password on WhatsApp to confirm your number.'}
          </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function BookingScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const { loading: trainersLoading } = usePublishedTrainers();
  const { isDesktop } = useResponsive();

  const trainer = getTrainerById(Array.isArray(id) ? id[0] : id);
  const days = useMemo(() => getNextDays(14), []);

  const first = (value) => (Array.isArray(value) ? value[0] : value);

  const [sessionTypeId, setSessionTypeId] = useState('in-person');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [durationMinutes, setDurationMinutes] = useState(() => {
    const requested = Number(first(params.duration));
    return DURATIONS.some((item) => item.minutes === requested)
      ? requested
      : 60;
  });
  const [dateKey, setDateKey] = useState(() => {
    const requested = first(params.date);
    if (requested && days.some((day) => day.key === requested)) {
      return requested;
    }
    return trainer?.availableToday ? days[0].key : days[1].key;
  });
  const [time, setTime] = useState(() => {
    const requested = first(params.time);
    return TIME_SLOTS.includes(requested) ? requested : '10:00 AM';
  });
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpBusy, setOtpBusy] = useState(false);
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!user) return;
    setCustomerName((current) => current || user.name || '');
    const digits = String(user.phone || '').replace(/\D/g, '');
    const normalized =
      digits.length === 12 && digits.startsWith('91')
        ? digits.slice(2)
        : digits.length === 11 && digits.startsWith('0')
          ? digits.slice(1)
          : digits;
    setCustomerPhone(
      (current) => current || (normalized.length === 10 ? normalized : '')
    );
  }, [user]);

  if (trainersLoading && String(Array.isArray(id) ? id[0] : id).startsWith('published-')) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Loading session…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!trainer) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Session unavailable</Text>
          <Text style={styles.notFoundText}>
            We could not find this trainer. Please go back and try again.
          </Text>
          <PrimaryButton
            label="Back to explore"
            onPress={() => router.replace('/explore')}
            style={styles.notFoundButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const sessionType =
    SESSION_TYPES.find((item) => item.id === sessionTypeId) ||
    SESSION_TYPES[0];
  const duration =
    DURATIONS.find((item) => item.minutes === durationMinutes) ||
    DURATIONS[1];

  const sessionPrice = trainer.price + duration.surcharge;
  const total = sessionPrice + SERVICE_FEE;
  const venue = getTrainerVenue(trainer);

  const normalizedPhone = customerPhone.trim();
  const phoneVerified =
    Boolean(verifiedPhone) && verifiedPhone === normalizedPhone;
  const canBook = customerName.trim().length >= 2 && phoneVerified;

  const location =
    sessionTypeId === 'online'
      ? {
          icon: 'videocam-outline',
          title: 'Online session',
          detail: 'A video link will be sent after booking.',
        }
      : {
          icon:
            sessionTypeId === 'partner'
              ? 'people-outline'
              : 'location-outline',
          title: venue.name,
          detail:
            sessionTypeId === 'partner'
              ? `${venue.address} · You + 1 guest`
              : venue.address,
        };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const completeBooking = async () => {
    try {
      const saved = await saveCustomerBooking({
        verifyToken,
        name: customerName.trim(),
        phone: verifiedPhone,
        trainerId: trainer.id.replace(/^published-/, ''),
        dateKey,
        time,
        duration: duration.minutes,
        sessionType: sessionType.id,
        total,
        paymentMethod,
      });

      addBooking(saved);
      setPaymentOpen(false);
      router.replace({
        pathname: '/booking/success',
        params: { id: saved.id },
      });
    } catch (err) {
      setPaymentOpen(false);
      setSaveError(
        err.message || 'Booking could not be saved. Please try again.'
      );
    }
  };

  const startPayment = () => {
    setSaveError('');
    if (!canBook) {
      setDetailsOpen(true);
      return;
    }
    setPaymentOpen(true);
  };
  const cancelPayment = () => setPaymentOpen(false);

  const handleVerified = (phone, token) => {
    setVerifiedPhone(phone);
    setVerifyToken(token);
    setDetailsOpen(false);
    setPaymentOpen(true);
  };

  const handlePhoneChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setCustomerPhone(digits);
    if (verifiedPhone && digits !== verifiedPhone) {
      setVerifiedPhone('');
      setVerifyToken('');
      setOtpSent(false);
      setOtpCode('');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenMeta
        title={`Book with ${trainer.name}`}
        description="Choose your session type, duration, date, and time. Free rescheduling up to 12 hours before your session."
      />
      <StatusBar style="dark" />

      <View style={styles.header}>
        <IconButton
          name="close"
          variant="surface"
          accessibilityLabel="Close booking"
          onPress={goBack}
        />
        <Text style={styles.headerTitle}>Book a session</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
      >
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>
          <View
            style={[styles.contentRow, isDesktop && styles.contentRowDesktop]}
          >
            <View style={styles.formColumn}>
          <View style={styles.trainerCard}>
            <Image
              source={trainer.image}
              style={styles.trainerImage}
              contentFit="cover"
              transition={180}
            />
            <View style={styles.trainerInfo}>
              <Text numberOfLines={1} style={styles.trainerName}>
                {trainer.name}
              </Text>
              <Text numberOfLines={1} style={styles.trainerRole}>
                {trainer.role}
              </Text>
              <View style={styles.trainerMeta}>
                <Ionicons name="star" size={11} color={colors.star} />
                <Text style={styles.trainerRating}>
                  {trainer.rating.toFixed(2)}
                </Text>
                <Text style={styles.trainerMetaText}>
                  · {trainer.neighborhood}
                </Text>
              </View>
            </View>
            <View style={styles.secureBadge}>
              <Ionicons
                name="shield-checkmark"
                size={13}
                color={colors.ink}
              />
              <Text style={styles.secureText}>Secure</Text>
            </View>
          </View>

          <StepHeader number="1" title="Session type" />
          <View style={styles.typeGrid}>
            {SESSION_TYPES.map((item) => {
              const selected = item.id === sessionTypeId;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setSessionTypeId(item.id)}
                  style={({ pressed }) => [
                    styles.typeCard,
                    selected && styles.typeCardSelected,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.typeIcon,
                      selected && styles.typeIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={selected ? colors.volt : colors.ink}
                    />
                  </View>
                  <Text
                    style={[
                      styles.typeLabel,
                      selected && styles.typeLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.typeNote,
                      selected && styles.typeNoteSelected,
                    ]}
                  >
                    {item.note}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <StepHeader number="2" title="Duration" />
          <View style={styles.durationGrid}>
            {DURATIONS.map((item) => {
              const selected = item.minutes === durationMinutes;
              return (
                <Pressable
                  key={item.minutes}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setDurationMinutes(item.minutes)}
                  style={({ pressed }) => [
                    styles.durationCard,
                    selected && styles.durationCardSelected,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.durationLabel,
                      selected && styles.durationLabelSelected,
                    ]}
                  >
                    {item.minutes} min
                  </Text>
                  <Text
                    style={[
                      styles.durationPrice,
                      selected && styles.durationPriceSelected,
                    ]}
                  >
                    {formatINR(trainer.price + item.surcharge)}
                  </Text>
                  <Text
                    style={[
                      styles.durationNote,
                      selected && styles.durationNoteSelected,
                    ]}
                  >
                    {item.note}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <StepHeader number="3" title="Pick a date" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
            contentContainerStyle={styles.dateRow}
          >
            {days.map((day) => {
              const selected = day.key === dateKey;
              const disabled =
                !trainer.availableToday && day.key === days[0].key;

              return (
                <Pressable
                  key={day.key}
                  accessibilityRole="button"
                  accessibilityLabel={`${day.weekdayLong}, ${day.monthLong} ${day.day}`}
                  accessibilityState={{ selected, disabled }}
                  disabled={disabled}
                  onPress={() => setDateKey(day.key)}
                  style={({ pressed }) => [
                    styles.dateCard,
                    selected && styles.dateCardSelected,
                    disabled && styles.dateCardDisabled,
                    pressed && !disabled && styles.cardPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateRelative,
                      selected && styles.dateRelativeSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {day.relative}
                  </Text>
                  <Text
                    style={[
                      styles.dateDay,
                      selected && styles.dateDaySelected,
                    ]}
                  >
                    {day.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonth,
                      selected && styles.dateMonthSelected,
                    ]}
                  >
                    {day.month}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <StepHeader number="4" title="Choose a time" />
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((slot) => {
              const disabled = DISABLED_SLOTS.includes(slot);
              const selected = slot === time;

              return (
                <Pressable
                  key={slot}
                  accessibilityRole="button"
                  accessibilityLabel={`${slot}${disabled ? ', unavailable' : ''}`}
                  accessibilityState={{ selected, disabled }}
                  disabled={disabled}
                  onPress={() => setTime(slot)}
                  style={({ pressed }) => [
                    styles.timeChip,
                    selected && styles.timeChipSelected,
                    disabled && styles.timeChipDisabled,
                    pressed && !disabled && styles.cardPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selected && styles.timeTextSelected,
                      disabled && styles.timeTextDisabled,
                    ]}
                  >
                    {slot}
                  </Text>
                  {selected ? <View style={styles.timeDot} /> : null}
                </Pressable>
              );
            })}
          </View>

          <StepHeader number="5" title="Location" />
          <View style={styles.locationCard}>
            <View style={styles.locationIcon}>
              <Ionicons
                name={location.icon}
                size={19}
                color={colors.ink}
              />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>{location.title}</Text>
              <Text style={styles.locationDetail}>{location.detail}</Text>
            </View>
            <View style={styles.locationBadge}>
              <Text style={styles.locationBadgeText}>
                {sessionTypeId === 'online' ? 'Link' : 'Open'}
              </Text>
            </View>
          </View>

          <StepHeader number="6" title="Pay with" />
          <View style={styles.paymentGrid}>
            {PAYMENT_OPTIONS.map((item) => {
              const selected = item.id === paymentMethod;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setPaymentMethod(item.id)}
                  style={({ pressed }) => [
                    styles.paymentCard,
                    selected && styles.paymentCardSelected,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.paymentCardIcon,
                      selected && styles.paymentCardIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={17}
                      color={selected ? colors.volt : colors.ink}
                    />
                  </View>
                  <Text
                    style={[
                      styles.paymentCardLabel,
                      selected && styles.paymentCardLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.paymentCardNote,
                      selected && styles.paymentCardNoteSelected,
                    ]}
                  >
                    {item.note}
                  </Text>
                </Pressable>
              );
            })}
          </View>

            </View>

            <View
              style={[
                styles.summaryColumn,
                isDesktop && styles.summaryColumnDesktop,
              ]}
            >
              <View style={isDesktop ? styles.summarySticky : undefined}>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {duration.minutes} min · {sessionType.label}
              </Text>
              <Text style={styles.summaryValue}>{formatINR(sessionPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service fee</Text>
              <Text style={styles.summaryValue}>{formatINR(SERVICE_FEE)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotal}>{formatINR(total)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Ionicons
                name="card-outline"
                size={14}
                color={colors.muted}
              />
              <Text style={styles.paymentText}>
                Paying with{' '}
                {PAYMENT_OPTIONS.find((item) => item.id === paymentMethod)
                  ?.label || 'UPI'}{' '}
                · INR.
              </Text>
            </View>
            <View style={styles.summaryNote}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={colors.muted}
              />
              <Text style={styles.summaryNoteText}>
                Free rescheduling up to 12 hours before your session.
              </Text>
            </View>
          </View>

          {saveError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.errorBannerText}>{saveError}</Text>
            </View>
          ) : null}

          {isDesktop ? (
            <PrimaryButton
              label={`Confirm and pay · ${formatINR(total)}`}
              onPress={startPayment}
              style={styles.desktopConfirm}
            />
          ) : null}

          <View style={styles.confirmDetails}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.muted}
            />
            <Text style={styles.confirmDetailsText}>
              {formatFullDate(dateKey)} at {time}
            </Text>
          </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {!isDesktop ? (
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 14) },
          ]}
        >
          <View style={styles.bottomInner}>
            <View style={styles.totalBlock}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatINR(total)}</Text>
            </View>
            <PrimaryButton
              label={`Confirm and pay · ${formatINR(total)}`}
              onPress={startPayment}
              style={styles.confirmButton}
            />
          </View>
        </View>
      ) : null}
      {detailsOpen ? (
        <DetailsSheet
          name={customerName}
          onNameChange={setCustomerName}
          phone={customerPhone}
          onPhoneChange={handlePhoneChange}
          verified={phoneVerified}
          onVerified={handleVerified}
          onContinue={() => {
            setDetailsOpen(false);
            setPaymentOpen(true);
          }}
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}
      {paymentOpen ? (
        <PaymentSheet
          method={paymentMethod}
          amountLabel={formatINR(total)}
          onComplete={completeBooking}
          onCancel={cancelPayment}
        />
      ) : null}
    </SafeAreaView>
  );
}

const sheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.screenPadding,
    backgroundColor: 'rgba(16,18,13,0.55)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: 22,
    gap: 14,
    alignItems: 'center',
    borderRadius: radius.xxl,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...type.h3,
    fontSize: 17,
    fontFamily: fonts.regular,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  form: {
    width: '100%',
    gap: 14,
  },
  amount: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.8,
    color: colors.ink,
  },
  scanFrame: {
    padding: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  scanLine: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.volt,
  },
  processing: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  hint: {
    ...type.small,
    textAlign: 'center',
  },
  track: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.line,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.ink,
  },
  note: {
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    textAlign: 'center',
    color: colors.muted,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  detailsCard: {
    padding: 16,
    gap: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  fieldGroup: {
    gap: 7,
  },
  fieldLabel: {
    ...type.label,
    fontSize: 11,
    fontFamily: fonts.regular,
  },
  fieldInput: {
    height: 46,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.bg,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.ink,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  phoneInput: {
    flex: 1,
    minWidth: 0,
  },
  otpButton: {
    height: 46,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: colors.volt,
  },
  otpButtonDisabled: {
    opacity: 0.5,
  },
  otpButtonText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  verifiedChip: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: colors.surfaceMuted,
  },
  verifiedText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.success,
  },
  detailsError: {
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.danger,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: 'rgba(217,74,74,0.08)',
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.danger,
  },
  fieldNote: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.muted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 6,
    paddingBottom: 10,
  },
  headerTitle: {
    ...type.h3,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  headerSpacer: {
    width: 42,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  scrollContentDesktop: {
    paddingBottom: 60,
  },
  container: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
  },
  containerDesktop: {
    maxWidth: layout.wideWidth,
    paddingTop: 10,
  },
  contentRow: {},
  contentRowDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 40,
  },
  formColumn: {
    flex: 1,
    minWidth: 0,
  },
  summaryColumn: {},
  summaryColumnDesktop: {
    width: 360,
    flexShrink: 0,
  },
  summarySticky: {
    position: 'sticky',
    top: 16,
  },
  desktopConfirm: {
    marginTop: 14,
  },
  trainerCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    ...shadows.card,
  },
  trainerImage: {
    width: 54,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  trainerInfo: {
    flex: 1,
    minWidth: 0,
  },
  trainerName: {
    ...type.h3,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  trainerRole: {
    fontSize: 11.5,
    fontFamily: fonts.regular,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 1,
  },
  trainerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  trainerRating: {
    fontSize: 11.5,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  trainerMetaText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '500',
    fontFamily: fonts.medium,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.voltSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  secureText: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  stepHeader: {
    marginTop: 26,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNumber: {
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  stepTitle: {
    ...type.h3,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  typeCard: {
    flex: 1,
    minHeight: 108,
    padding: 11,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
  },
  typeCardSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  typeIconSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeLabel: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  typeLabelSelected: {
    color: colors.white,
  },
  typeNote: {
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.muted,
    marginTop: 2,
  },
  typeNoteSelected: {
    color: 'rgba(255, 255, 255, 0.58)',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.985 }],
  },
  durationGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  durationCard: {
    flex: 1,
    paddingHorizontal: 11,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  durationCardSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  durationLabel: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  durationLabelSelected: {
    color: colors.white,
  },
  durationPrice: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.4,
    color: colors.ink,
    marginTop: 5,
  },
  durationPriceSelected: {
    color: colors.volt,
  },
  durationNote: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
    marginTop: 1,
  },
  durationNoteSelected: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  dateScroll: {
    marginHorizontal: -layout.screenPadding,
  },
  dateRow: {
    paddingHorizontal: layout.screenPadding,
    gap: 8,
    paddingBottom: 2,
  },
  dateCard: {
    width: 66,
    height: 82,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  dateCardSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  dateCardDisabled: {
    opacity: 0.38,
  },
  dateRelative: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.muted,
    maxWidth: 58,
    textAlign: 'center',
  },
  dateRelativeSelected: {
    color: colors.volt,
  },
  dateDay: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  dateDaySelected: {
    color: colors.white,
  },
  dateMonth: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: colors.muted,
  },
  dateMonthSelected: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    width: '31.5%',
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  timeChipSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  timeChipDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: 'transparent',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  timeTextSelected: {
    color: colors.white,
  },
  timeTextDisabled: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  timeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.volt,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 12,
  },
  locationIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    minWidth: 0,
  },
  locationTitle: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  locationDetail: {
    fontSize: 10.5,
    fontFamily: fonts.regular,
    lineHeight: 14,
    color: colors.muted,
    marginTop: 1,
  },
  locationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  locationBadgeText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.inkSoft,
  },
  summary: {
    marginTop: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    ...shadows.card,
  },
  summaryTitle: {
    ...type.h3,
    fontSize: 16,
    fontFamily: fonts.regular,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 10,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.4,
    color: colors.ink,
  },
  summaryNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },
  paymentGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentCard: {
    flex: 1,
    minHeight: 104,
    padding: 11,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
  },
  paymentCardSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  paymentCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
  paymentCardIconSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  paymentCardLabel: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  paymentCardLabelSelected: {
    color: colors.white,
  },
  paymentCardNote: {
    fontSize: 9.5,
    lineHeight: 13,
    fontWeight: '500',
    fontFamily: fonts.medium,
    color: colors.muted,
    marginTop: 2,
  },
  paymentCardNoteSelected: {
    color: 'rgba(255, 255, 255, 0.58)',
  },
  paymentText: {
    ...type.tiny,
    flex: 1,
  },
  summaryNoteText: {
    flex: 1,
    ...type.tiny,
  },
  confirmDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 16,
  },
  confirmDetailsText: {
    ...type.tiny,
    fontWeight: '600',
    fontFamily: fonts.semibold,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
  },
  bottomInner: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  totalBlock: {
    minWidth: 74,
  },
  totalLabel: {
    ...type.label,
    fontSize: 9,
    fontFamily: fonts.regular,
  },
  totalValue: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.7,
    color: colors.ink,
  },
  confirmButton: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    ...type.h1,
    textAlign: 'center',
  },
  notFoundText: {
    ...type.small,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  notFoundButton: {
    marginTop: 22,
    minWidth: 220,
  },
});
