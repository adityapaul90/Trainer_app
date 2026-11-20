import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DesktopHeader } from '@/components/DesktopHeader';
import { ScreenMeta } from '@/components/ScreenMeta';
import { colors, layout, radius, shadows, type , fonts } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { getTrainerById } from '@/data/trainers';
import { useResponsive } from '@/hooks/useResponsive';

function lastMessage(thread) {
  if (!thread.messages.length) return 'Say hello and share your goals.';
  return thread.messages[thread.messages.length - 1].text;
}

export default function InboxScreen() {
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const { threads, markThreadRead } = useBookings();

  const sorted = [...threads].sort(
    (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenMeta
        title="Messages"
        description="Talk to your coaches, share goals, and sort out session details on instafit."
      />
      <DesktopHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={goBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="arrow-back" size={18} color={colors.ink} />
            </Pressable>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Your inbox</Text>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                Messages
              </Text>
              <Text style={styles.subtitle}>
                Plans, questions, and session notes with your coaches.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Find a coach to message"
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [
                styles.newButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="create-outline" size={16} color={colors.ink} />
              {isDesktop ? (
                <Text style={styles.newButtonText}>New message</Text>
              ) : null}
            </Pressable>
          </View>

          <View style={styles.noteCard}>
            <View style={styles.noteIcon}>
              <Ionicons
                name="flash-outline"
                size={16}
                color={colors.ink}
              />
            </View>
            <View style={styles.noteCopy}>
              <Text style={styles.noteTitle}>Coach replies, not bots</Text>
              <Text style={styles.noteText}>
                Every message goes straight to your trainer. Most replies land
                within two hours.
              </Text>
            </View>
          </View>

          <View style={styles.list}>
            {sorted.map((thread) => {
              const trainer = getTrainerById(thread.trainerId);
              if (!trainer) return null;
              const message = lastMessage(thread);

              return (
                <Pressable
                  key={thread.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open conversation with ${trainer.name}`}
                  onPress={() => {
                    markThreadRead(thread.id);
                    router.push(`/inbox/${thread.id}`);
                  }}
                  style={({ pressed }) => [
                    styles.thread,
                    thread.unread > 0 && styles.threadUnread,
                    pressed && styles.threadPressed,
                  ]}
                >
                  <View style={styles.avatarWrap}>
                    <Image
                      source={trainer.image}
                      style={styles.avatar}
                      contentFit="cover"
                      contentPosition="top"
                      transition={150}
                    />
                    {trainer.availableToday ? (
                      <View style={styles.onlineDot} />
                    ) : null}
                  </View>

                  <View style={styles.threadCopy}>
                    <View style={styles.threadTop}>
                      <Text numberOfLines={1} style={styles.threadName}>
                        {trainer.name}
                      </Text>
                      <Text style={styles.threadTime}>
                        {thread.messages.length
                          ? thread.messages[thread.messages.length - 1].at
                          : 'New'}
                      </Text>
                    </View>
                    <Text numberOfLines={1} style={styles.threadRole}>
                      {trainer.role}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.threadMessage,
                        thread.unread > 0 && styles.threadMessageUnread,
                      ]}
                    >
                      {message}
                    </Text>
                  </View>

                  {thread.unread > 0 ? (
                    <View style={styles.unreadDot} />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={15}
                      color={colors.lineStrong}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/explore')}
            style={({ pressed }) => [
              styles.browseButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="search" size={15} color={colors.ink} />
            <Text style={styles.browseText}>Message a new coach</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.ink} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 44,
  },
  container: {
    width: '100%',
    maxWidth: layout.wideWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 4,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    ...type.label,
  },
  title: {
    ...type.display,
    fontSize: 34,
    fontFamily: fonts.regular,
    lineHeight: 39,
    marginTop: 4,
  },
  titleDesktop: {
    fontSize: 44,
    fontFamily: fonts.regular,
    lineHeight: 49,
    letterSpacing: -1.8,
  },
  subtitle: {
    ...type.small,
    marginTop: 6,
    maxWidth: 520,
  },
  newButton: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.volt,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 6,
  },
  newButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  noteCard: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  noteIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteCopy: {
    flex: 1,
    minWidth: 0,
  },
  noteTitle: {
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  noteText: {
    ...type.tiny,
    marginTop: 1,
  },
  list: {
    marginTop: 18,
    gap: 10,
  },
  thread: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  threadUnread: {
    borderColor: colors.ink,
  },
  threadPressed: {
    opacity: 0.82,
  },
  avatarWrap: {
    width: 58,
    height: 58,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.volt,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  threadCopy: {
    flex: 1,
    minWidth: 0,
  },
  threadTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  threadName: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  threadTime: {
    ...type.tiny,
    fontSize: 9.5,
    fontFamily: fonts.regular,
  },
  threadRole: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
    marginTop: 1,
  },
  threadMessage: {
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 17,
    color: colors.muted,
    marginTop: 4,
  },
  threadMessageUnread: {
    color: colors.inkSoft,
    fontWeight: '600',
    fontFamily: fonts.semibold,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.volt,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  browseButton: {
    marginTop: 20,
    height: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  browseText: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  pressed: {
    opacity: 0.76,
  },
});
