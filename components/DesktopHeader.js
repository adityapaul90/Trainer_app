import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, layout, radius, type , fonts } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { USER } from '@/data/trainers';
import { useResponsive } from '@/hooks/useResponsive';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'explore', label: 'Explore', href: '/explore' },
  { id: 'bookings', label: 'Bookings', href: '/bookings' },
  { id: 'profile', label: 'Profile', href: '/profile' },
];

function resolveActive(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/explore')) return 'explore';
  if (pathname.startsWith('/bookings')) return 'bookings';
  if (pathname.startsWith('/profile')) return 'profile';
  return null;
}

export function DesktopHeader({ active, location }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDesktop } = useResponsive();
  const { unreadCount } = useBookings();

  if (!isDesktop) return null;

  const current = active || resolveActive(pathname);

  return (
    <View style={styles.shell}>
      <View style={styles.inner}>
        <View style={styles.side}>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="instafit home"
            onPress={() => router.push('/')}
            style={({ pressed }) => [styles.brandBlock, pressed && styles.pressed]}
          >
            <Text style={styles.brand}>
              instafit<Text style={styles.brandDot}>.</Text>
            </Text>
          </Pressable>
        </View>

        <View style={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const selected = current === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="link"
                accessibilityState={{ selected }}
                onPress={() => router.push(item.href)}
                style={({ pressed }) => [
                  styles.navItem,
                  selected && styles.navItemActive,
                  pressed && styles.navItemPressed,
                ]}
              >
                <Text
                  style={[
                    styles.navLabel,
                    selected && styles.navLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                {selected ? <View style={styles.navDot} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.side, styles.sideRight]}>
          <View style={styles.location}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.muted}
            />
            <Text style={styles.locationText}>{location || 'India'}</Text>
          </View>

          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Messages${unreadCount ? `, ${unreadCount} unread` : ''}`}
            onPress={() => router.push('/inbox')}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="chatbubble-outline"
              size={19}
              color={colors.ink}
            />
            {unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            ) : null}
          </Pressable>

          <View style={styles.rightDivider} />

          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Open your profile"
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [styles.user, pressed && styles.pressed]}
          >
            <View style={styles.avatarRing}>
              <Image
                source={USER.avatar}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
            <View style={styles.userCopy}>
              <Text style={styles.userName}>{USER.firstName}</Text>
              <Text style={styles.userMeta}>Member</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    zIndex: 20,
  },
  inner: {
    width: '100%',
    maxWidth: layout.wideWidth,
    alignSelf: 'center',
    height: layout.navHeight,
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  sideRight: {
    justifyContent: 'flex-end',
    gap: 18,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
  },
  brandBlock: {
    paddingVertical: 6,
  },
  brand: {
    fontSize: 27,
    lineHeight: 31,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -1.5,
    color: colors.ink,
  },
  brandDot: {
    color: colors.volt,
  },
  navItem: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navItemActive: {
    backgroundColor: colors.ink,
  },
  navItemPressed: {
    opacity: 0.8,
  },
  navLabel: {
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.muted,
  },
  navLabelActive: {
    color: colors.white,
  },
  navDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.volt,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
  },
  rightDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.line,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  unreadBadge: {
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
  unreadText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 4,
    paddingRight: 4,
  },
  avatarRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: colors.volt,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },
  userCopy: {
    gap: 1,
  },
  userName: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  userMeta: {
    ...type.tiny,
    fontSize: 9.5,
    fontFamily: fonts.regular,
    lineHeight: 12,
  },
  pressed: {
    opacity: 0.76,
  },
});
