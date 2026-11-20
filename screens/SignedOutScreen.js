import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenMeta } from '@/components/ScreenMeta';
import { colors, layout, type , fonts } from '@/constants/theme';

export default function SignedOutScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ScreenMeta
        title="Signed out"
        description="You have been signed out of instafit."
      />
      <StatusBar style="light" />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Text style={styles.brand}>
              instafit<Text style={styles.brandDot}>.</Text>
            </Text>
            <Text style={styles.topNote}>See you soon</Text>
          </View>

          <View style={styles.main}>
            <View style={styles.iconWrap}>
              <Ionicons
                name="log-out-outline"
                size={30}
                color={colors.ink}
              />
            </View>
            <Text style={styles.title}>You&apos;re signed out.</Text>
            <Text style={styles.subtitle}>
              Your sessions and saved coaches are waiting when you&apos;re
              ready to train again.
            </Text>
          </View>

          <View style={styles.actions}>
            <PrimaryButton
              label="Sign back in"
              variant="volt"
              onPress={() => router.replace('/sign-in')}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to home"
              onPress={() => router.replace('/')}
              style={({ pressed }) => [
                styles.secondary,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.secondaryText}>Back to home</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={13}
              color="rgba(255,255,255,0.4)"
            />
            <Text style={styles.footerText}>
              Your account details stay private on this device.
            </Text>
          </View>
        </View>
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
    top: -150,
    right: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: colors.volt,
    opacity: 0.07,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -180,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.volt,
    opacity: 0.05,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 10,
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
  topNote: {
    ...type.label,
    color: 'rgba(255,255,255,0.38)',
  },
  main: {
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  iconWrap: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -1.4,
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    maxWidth: 300,
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.58)',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: 6,
  },
  secondary: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.white,
  },
  pressed: {
    opacity: 0.72,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 10,
    fontFamily: fonts.regular,
    lineHeight: 14,
    color: 'rgba(255,255,255,0.38)',
  },
});
