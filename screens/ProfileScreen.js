import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { DesktopHeader } from '@/components/DesktopHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenMeta } from '@/components/ScreenMeta';
import { SectionHeader } from '@/components/SectionHeader';
import { TrainerCard } from '@/components/TrainerCard';
import {
  colors,
  layout,
  radius,
  shadows,
  type,
  fonts,
} from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useBookings } from '@/context/BookingContext';
import { getTrainerById, PROMO_IMAGE, USER } from '@/data/trainers';
import { useResponsive } from '@/hooks/useResponsive';

const MENU_ITEMS = [
  {
    id: 'details',
    label: 'Personal details',
    note: 'Name, email, phone',
    icon: 'person-outline',
  },
  {
    id: 'messages',
    label: 'Messages',
    note: 'Chat with your coaches',
    icon: 'chatbubble-outline',
  },
  {
    id: 'payment',
    label: 'Payment methods',
    note: 'Visa ending in 4242',
    icon: 'card-outline',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    note: 'Reminders and offers',
    icon: 'notifications-outline',
  },
  {
    id: 'help',
    label: 'Help & support',
    note: 'FAQs and contact',
    icon: 'help-circle-outline',
  },
];

const WEEKLY_GOAL = 3;
const WEEKLY_DONE = 2;

const SHEETS = {
  details: {
    title: 'Personal details',
    subtitle: 'Keep your contact info up to date.',
  },
  payment: {
    title: 'Payment methods',
    subtitle: 'The card on file for session bookings.',
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Choose what you hear about.',
  },
  help: {
    title: 'Help & support',
    subtitle: 'Quick answers, or talk to a real person.',
  },
  signout: {
    title: 'Sign out',
    subtitle: 'Your bookings stay on your account.',
  },
};

const NOTIFICATION_ITEMS = [
  {
    id: 'reminders',
    title: 'Session reminders',
    note: '24 hours and 1 hour before',
  },
  {
    id: 'messages',
    title: 'Coach messages',
    note: 'Replies, plans, and schedule changes',
  },
  {
    id: 'offers',
    title: 'Offers and updates',
    note: 'New coaches and member perks',
  },
];

const FAQ_ITEMS = [
  {
    question: 'How does rescheduling work?',
    answer:
      'You can move any session for free up to 12 hours before it starts. After that, your coach keeps the booking.',
  },
  {
    question: 'Where do in-person sessions happen?',
    answer:
      'Each coach trains at a partner gym in their neighborhood. The exact address is in your booking confirmation.',
  },
  {
    question: 'Can I train with a friend?',
    answer:
      'Yes. Choose “Partner” when booking, then bring one guest. The session price stays the same.',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { isDesktop } = useResponsive();
  const { favoriteIds, bookings } = useBookings();
  const { token, user, signOut } = useAuth();

  const contentWidth = Math.min(windowWidth, layout.wideWidth);
  const mainWidth =
    contentWidth - layout.screenPadding * 2 - 340 - 24;
  const savedCardWidth = Math.max((mainWidth - 28) / 3, 190);

  const [activeSheet, setActiveSheet] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [profile, setProfile] = useState({
    name: USER.name,
    email: USER.email,
    phone: USER.phone,
  });
  const [draft, setDraft] = useState(profile);
  const [notifications, setNotifications] = useState({
    reminders: true,
    messages: true,
    offers: false,
  });

  const savedTrainers = favoriteIds
    .map((trainerId) => getTrainerById(trainerId))
    .filter(Boolean);

  const authItem = token
    ? {
        id: 'auth',
        label: 'Sign out',
        note: user?.email || 'Connected to instafit',
        icon: 'log-out-outline',
      }
    : {
        id: 'auth',
        label: 'Sign in',
        note: 'Connect your instafit account',
        icon: 'log-in-outline',
      };
  const accountItems = [authItem, ...MENU_ITEMS];

  const completed = bookings.filter(
    (booking) => booking.status === 'completed'
  ).length;
  const upcoming = bookings.filter(
    (booking) => booking.status === 'confirmed'
  ).length;
  const hours = bookings
    .filter((booking) => booking.status === 'completed')
    .reduce((total, booking) => total + booking.duration / 60, 0);
  const progress = Math.min(WEEKLY_DONE / WEEKLY_GOAL, 1);

  const openSheet = (id) => {
    if (id === 'details') {
      setDraft(profile);
    }
    setActiveSheet(id);
  };

  const closeSheet = () => setActiveSheet(null);

  const saveDetails = () => {
    setProfile({
      name: draft.name.trim() || USER.name,
      email: draft.email.trim() || USER.email,
      phone: draft.phone.trim() || USER.phone,
    });
    closeSheet();
  };

  const toggleNotification = (id, value) => {
    setNotifications((current) => ({ ...current, [id]: value }));
  };

  const sheet = activeSheet ? SHEETS[activeSheet] : null;

  const renderSheetContent = () => {
    if (activeSheet === 'details') {
      return (
        <>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full name</Text>
            <TextInput
              value={draft.name}
              onChangeText={(name) =>
                setDraft((current) => ({ ...current, name }))
              }
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              style={styles.fieldInput}
              autoCapitalize="words"
              accessibilityLabel="Full name"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              value={draft.email}
              onChangeText={(email) =>
                setDraft((current) => ({ ...current, email }))
              }
              placeholder="you@email.com"
              placeholderTextColor={colors.muted}
              style={styles.fieldInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              accessibilityLabel="Email"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              value={draft.phone}
              onChangeText={(phone) =>
                setDraft((current) => ({ ...current, phone }))
              }
              placeholder="(415) 555-0100"
              placeholderTextColor={colors.muted}
              style={styles.fieldInput}
              keyboardType="phone-pad"
              accessibilityLabel="Phone"
            />
          </View>
          <PrimaryButton
            label="Save changes"
            icon="checkmark"
            onPress={saveDetails}
            style={styles.sheetPrimary}
          />
          <Text style={styles.fieldNote}>
            We only use this to confirm sessions and send reminders.
          </Text>
        </>
      );
    }

    if (activeSheet === 'payment') {
      return (
        <>
          <View style={styles.paymentCard}>
            <View style={styles.paymentTop}>
              <Text style={styles.paymentBrand}>VISA</Text>
              <View style={styles.defaultBadge}>
                <View style={styles.defaultDot} />
                <Text style={styles.defaultText}>Default</Text>
              </View>
            </View>
            <Text style={styles.paymentNumber}>•••• •••• •••• 4242</Text>
            <View style={styles.paymentBottom}>
              <View>
                <Text style={styles.paymentLabel}>Cardholder</Text>
                <Text numberOfLines={1} style={styles.paymentValue}>
                  {profile.name}
                </Text>
              </View>
              <View>
                <Text style={styles.paymentLabel}>Expires</Text>
                <Text style={styles.paymentValue}>08/28</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={colors.muted}
            />
            <Text style={styles.infoText}>
              You are only charged when you confirm a session. Cancel or
              reschedule free up to 12 hours before.
            </Text>
          </View>
        </>
      );
    }

    if (activeSheet === 'notifications') {
      return (
        <>
          <View style={styles.switchGroup}>
            {NOTIFICATION_ITEMS.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.switchRow,
                  index < NOTIFICATION_ITEMS.length - 1 &&
                    styles.switchRowBorder,
                ]}
              >
                <View style={styles.switchCopy}>
                  <Text style={styles.switchTitle}>{item.title}</Text>
                  <Text style={styles.switchNote}>{item.note}</Text>
                </View>
                <Switch
                  value={notifications[item.id]}
                  onValueChange={(value) =>
                    toggleNotification(item.id, value)
                  }
                  accessibilityLabel={item.title}
                  activeTrackColor={colors.ink}
                  activeThumbColor={colors.volt}
                  trackColor={{
                    false: colors.lineStrong,
                    true: colors.ink,
                  }}
                  thumbColor={
                    notifications[item.id] ? colors.volt : colors.surface
                  }
                  ios_backgroundColor={colors.lineStrong}
                />
              </View>
            ))}
          </View>
          <Text style={styles.fieldNote}>
            Reminders are always on for sessions happening in the next 24
            hours.
          </Text>
        </>
      );
    }

    if (activeSheet === 'help') {
      return (
        <>
          <View style={styles.faqList}>
            {FAQ_ITEMS.map((item, index) => {
              const open = expandedFaq === index;
              return (
                <Pressable
                  key={item.question}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  onPress={() => setExpandedFaq(open ? -1 : index)}
                  style={({ pressed }) => [
                    styles.faqRow,
                    index < FAQ_ITEMS.length - 1 && styles.faqRowBorder,
                    pressed && styles.faqPressed,
                  ]}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Ionicons
                      name={open ? 'remove' : 'add'}
                      size={17}
                      color={colors.ink}
                    />
                  </View>
                  {open ? (
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.contactRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Email instafit support"
              onPress={() =>
                Linking.openURL('mailto:support@instafit.app')
              }
              style={({ pressed }) => [
                styles.contactButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="mail-outline" size={16} color={colors.ink} />
              <Text style={styles.contactText}>Email support</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Call instafit support"
              onPress={() => Linking.openURL('tel:+14155550148')}
              style={({ pressed }) => [
                styles.contactButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="call-outline" size={16} color={colors.ink} />
              <Text style={styles.contactText}>Call</Text>
            </Pressable>
          </View>
        </>
      );
    }

    if (activeSheet === 'signout') {
      return (
        <>
          <View style={styles.signOutNotice}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.ink}
            />
            <Text style={styles.signOutNoticeText}>
              Your upcoming sessions and saved coaches will be here when you
              sign back in.
            </Text>
          </View>
          <PrimaryButton
            label="Stay signed in"
            variant="outline"
            icon={null}
            onPress={closeSheet}
          />
          <PrimaryButton
            label="Sign out"
            variant="danger"
            icon="log-out-outline"
            onPress={() => {
              closeSheet();
              signOut().then(() => router.replace('/signed-out'));
            }}
            style={styles.sheetPrimary}
          />
        </>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenMeta
        title="Your profile"
        description="Track your training, weekly goal, saved coaches, and account settings on instafit."
      />
      <DesktopHeader active="profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[styles.container, isDesktop && styles.containerDesktop]}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Your account</Text>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                Profile
              </Text>
            </View>
            <View style={styles.headerBadge}>
              <View style={styles.headerBadgeDot} />
              <Text style={styles.headerBadgeText}>
                {upcoming === 1 ? '1 upcoming' : `${upcoming} upcoming`}
              </Text>
            </View>
          </View>

          <View style={[styles.body, isDesktop && styles.bodyDesktop]}>
            <View style={isDesktop ? styles.aside : undefined}>

          <View style={styles.profileCard}>
            <Image
              source={PROMO_IMAGE}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={['rgba(16,18,13,0.24)', 'rgba(16,18,13,0.94)']}
              locations={[0.05, 0.92]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.memberBadge}>
              <View style={styles.memberDot} />
              <Text style={styles.memberText}>Member since {USER.memberSince}</Text>
            </View>

            <View style={styles.profileBottom}>
              <View style={styles.avatarRing}>
                <Image
                  source={USER.avatar}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>
              <View style={styles.profileCopy}>
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.email}>{profile.email}</Text>
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color="rgba(255,255,255,0.62)"
                  />
                  <Text style={styles.locationText}>{USER.location}</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit profile"
                onPress={() => openSheet('details')}
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="pencil" size={14} color={colors.ink} />
              </Pressable>
            </View>
          </View>

          <View style={[styles.statsRow, isDesktop && styles.statsRowDesktop]}>
            <View
              style={[styles.statCard, isDesktop && styles.statCardDesktop]}
            >
              <Text style={styles.statValue}>{completed}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View
              style={[styles.statCard, isDesktop && styles.statCardDesktop]}
            >
              <Text style={styles.statValue}>{hours.toFixed(1)}h</Text>
              <Text style={styles.statLabel}>Trained</Text>
            </View>
            <View
              style={[styles.statCard, isDesktop && styles.statCardDesktop]}
            >
              <Text style={styles.statValue}>{savedTrainers.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View
              style={[styles.statCard, isDesktop && styles.statCardDesktop]}
            >
              <Text style={styles.statValue}>{upcoming}</Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </View>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View>
                <Text style={styles.goalLabel}>Weekly goal</Text>
                <Text style={styles.goalTitle}>
                  {WEEKLY_DONE} of {WEEKLY_GOAL} sessions
                </Text>
              </View>
              <View style={styles.goalBadge}>
                <Ionicons name="flame" size={14} color={colors.ink} />
                <Text style={styles.goalBadgeText}>4 week streak</Text>
              </View>
            </View>

            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${progress * 100}%` }]} />
            </View>

            <View style={styles.goalFooter}>
              <Text style={styles.goalFootnote}>
                One more session to hit your goal.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/bookings')}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Text style={styles.goalLink}>View schedule</Text>
              </Pressable>
            </View>
          </View>
            </View>

            <View style={isDesktop ? styles.main : undefined}>
          <SectionHeader
            title="Saved coaches"
            action="See all"
            onAction={() => router.push('/saved')}
            style={styles.sectionHeader}
          />

          {savedTrainers.length > 0 ? (
            isDesktop ? (
              <View style={styles.savedGrid}>
                {savedTrainers.slice(0, 6).map((trainer) => (
                  <TrainerCard
                    key={trainer.id}
                    trainer={trainer}
                    style={{ width: savedCardWidth }}
                  />
                ))}
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.bleed}
                contentContainerStyle={styles.cardRow}
              >
                {savedTrainers.slice(0, 4).map((trainer) => (
                  <TrainerCard key={trainer.id} trainer={trainer} />
                ))}
              </ScrollView>
            )
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [
                styles.emptySaved,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.emptyIcon}>
                <Ionicons name="heart-outline" size={20} color={colors.ink} />
              </View>
              <View style={styles.emptyCopy}>
                <Text style={styles.emptyTitle}>No saved coaches yet</Text>
                <Text style={styles.emptyText}>
                  Tap the heart on any coach to keep them here.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={colors.ink} />
            </Pressable>
          )}

          <Text style={styles.menuLabel}>Account</Text>
          <View style={styles.menu}>
            {accountItems.map((item, index) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => {
                  if (item.id === 'auth') {
                    if (token) {
                      openSheet('signout');
                    } else {
                      router.push('/sign-in');
                    }
                    return;
                  }
                  if (item.id === 'messages') {
                    router.push('/inbox');
                    return;
                  }
                  openSheet(item.id);
                }}
                style={({ pressed }) => [
                  styles.menuRow,
                  index < accountItems.length - 1 && styles.menuRowBorder,
                  pressed && styles.menuRowPressed,
                ]}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon} size={17} color={colors.ink} />
                </View>
                <View style={styles.menuCopy}>
                  <Text style={styles.menuTitle}>{item.label}</Text>
                  <Text style={styles.menuNote}>{item.note}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.lineStrong}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            onPress={() => openSheet('signout')}
            style={({ pressed }) => [
              styles.signOut,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="log-out-outline" size={17} color={colors.danger} />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
            </View>
          </View>

          <Text style={styles.version}>instafit. · v1.0.0</Text>
        </View>
      </ScrollView>

      <Modal
        visible={Boolean(activeSheet)}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
      >
        {activeSheet && sheet ? (
          <View style={styles.sheetOverlay}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close panel"
              onPress={closeSheet}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.sheet,
                {
                  maxHeight: Math.max(windowHeight - insets.top - 10, 360),
                  paddingBottom: Math.max(insets.bottom, 16),
                },
              ]}
            >
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderCopy}>
                  <Text style={styles.sheetTitle}>{sheet.title}</Text>
                  <Text style={styles.sheetSubtitle}>{sheet.subtitle}</Text>
                </View>
                <IconButton
                  name="close"
                  variant="surface"
                  accessibilityLabel="Close panel"
                  onPress={closeSheet}
                />
              </View>
              <ScrollView
                style={styles.sheetScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.sheetContent}
              >
                {renderSheetContent()}
              </ScrollView>
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
  body: {},
  bodyDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  aside: {
    width: 340,
    flexShrink: 0,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
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
  titleDesktop: {
    fontSize: 44,
    fontFamily: fonts.regular,
    lineHeight: 49,
    letterSpacing: -1.8,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  headerBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.volt,
  },
  headerBadgeText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.inkSoft,
  },
  pressed: {
    opacity: 0.72,
  },
  profileCard: {
    marginTop: 20,
    height: 210,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.darkCard,
    justifyContent: 'space-between',
    ...shadows.card,
  },
  memberBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    margin: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(16,18,13,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  memberDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.volt,
  },
  memberText: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: 0.2,
    color: colors.white,
  },
  profileBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 16,
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.volt,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileCopy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.9,
    color: colors.white,
  },
  email: {
    fontSize: 11,
    fontFamily: fonts.regular,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.62)',
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  locationText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: 'rgba(255,255,255,0.62)',
  },
  editButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  statsRowDesktop: {
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 1,
  },
  statCardDesktop: {
    flexBasis: '46%',
    flexGrow: 1,
  },
  statValue: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  statLabel: {
    fontSize: 8.5,
    lineHeight: 11,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  goalCard: {
    marginTop: 20,
    borderRadius: radius.xl,
    backgroundColor: colors.ink,
    padding: 17,
    overflow: 'hidden',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  goalLabel: {
    ...type.label,
    color: 'rgba(255,255,255,0.5)',
  },
  goalTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.4,
    color: colors.white,
    marginTop: 4,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.volt,
  },
  goalBadgeText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  goalTrack: {
    marginTop: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.13)',
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.volt,
  },
  goalFooter: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  goalFootnote: {
    flex: 1,
    fontSize: 10.5,
    fontFamily: fonts.regular,
    lineHeight: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  goalLink: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.volt,
  },
  sectionHeader: {
    marginTop: 28,
  },
  savedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  bleed: {
    marginHorizontal: -layout.screenPadding,
  },
  cardRow: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 4,
    gap: 14,
  },
  emptySaved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 14,
  },
  emptyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.voltSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCopy: {
    flex: 1,
  },
  emptyTitle: {
    ...type.h3,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  emptyText: {
    ...type.tiny,
    marginTop: 2,
  },
  menuLabel: {
    ...type.label,
    marginTop: 30,
    marginBottom: 10,
  },
  menu: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  menuRowPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCopy: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  menuNote: {
    ...type.tiny,
    marginTop: 1,
  },
  signOut: {
    marginTop: 18,
    height: 50,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.danger,
  },
  version: {
    ...type.tiny,
    textAlign: 'center',
    marginTop: 20,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16,18,13,0.56)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '88%',
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingTop: 8,
    paddingHorizontal: layout.screenPadding,
    ...shadows.floating,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lineStrong,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 18,
  },
  sheetHeaderCopy: {
    flex: 1,
  },
  sheetTitle: {
    ...type.h1,
    fontSize: 24,
    fontFamily: fonts.regular,
    lineHeight: 29,
  },
  sheetSubtitle: {
    ...type.small,
    marginTop: 4,
  },
  sheetContent: {
    paddingBottom: 8,
  },
  sheetScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  sheetPrimary: {
    marginTop: 12,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    ...type.label,
    marginBottom: 7,
  },
  fieldInput: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.ink,
    outlineStyle: 'none',
  },
  fieldNote: {
    ...type.tiny,
    marginTop: 10,
    textAlign: 'center',
  },
  paymentCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.ink,
    padding: 18,
    overflow: 'hidden',
  },
  paymentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentBrand: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    fontStyle: 'italic',
    letterSpacing: -0.6,
    color: colors.white,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(216,255,79,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(216,255,79,0.3)',
  },
  defaultDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.volt,
  },
  defaultText: {
    fontSize: 8.5,
    lineHeight: 11,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.volt,
  },
  paymentNumber: {
    marginTop: 26,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    letterSpacing: 2.2,
    color: colors.white,
  },
  paymentBottom: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
  },
  paymentLabel: {
    fontSize: 7.5,
    lineHeight: 10,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
  },
  paymentValue: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: 'rgba(255,255,255,0.9)',
  },
  infoRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  infoText: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: fonts.regular,
    lineHeight: 17,
    color: colors.muted,
  },
  switchGroup: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  switchRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  switchCopy: {
    flex: 1,
    minWidth: 0,
  },
  switchTitle: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  switchNote: {
    ...type.tiny,
    marginTop: 2,
  },
  faqList: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  faqRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  faqRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  faqPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 19,
    color: colors.muted,
    paddingRight: 22,
  },
  contactRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  contactText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  signOutNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 13,
    marginBottom: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  signOutNoticeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 18,
    color: colors.inkSoft,
  },
});
