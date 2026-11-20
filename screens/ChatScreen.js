import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ScreenMeta } from '@/components/ScreenMeta';
import { colors, layout, radius, type , fonts } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { getTrainerById, USER } from '@/data/trainers';

const QUICK_REPLIES = [
  'Sounds good',
  'What should I bring?',
  'Can we adjust the time?',
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const threadId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { getThread, sendMessage, markThreadRead } = useBookings();
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  const thread = getThread(threadId);
  const trainer = thread ? getTrainerById(thread.trainerId) : null;

  useEffect(() => {
    if (thread && thread.unread > 0) {
      markThreadRead(thread.id);
    }
  }, [thread, markThreadRead]);

  if (!thread || !trainer) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="Conversation not found"
            message="This chat may have been archived. Start a new conversation from a coach profile."
            actionLabel="Browse coaches"
            onAction={() => router.replace('/explore')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/inbox');
  };

  const submit = (text) => {
    const value = (text ?? draft).trim();
    if (!value) return;
    sendMessage(thread.id, value);
    setDraft('');
    setTyping(true);
    setTimeout(() => setTyping(false), 1600);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenMeta
        title={`Chat with ${trainer.name}`}
        description={`Message ${trainer.name} about goals, schedules, and session plans.`}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerInner}>
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

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${trainer.name}'s profile`}
              onPress={() => router.push(`/trainer/${trainer.id}`)}
              style={({ pressed }) => [
                styles.headerPerson,
                pressed && styles.pressed,
              ]}
            >
              <Image
                source={trainer.image}
                style={styles.headerAvatar}
                contentFit="cover"
                contentPosition="top"
              />
              <View style={styles.headerCopy}>
                <Text numberOfLines={1} style={styles.headerName}>
                  {trainer.name}
                </Text>
                <View style={styles.headerStatus}>
                  <View style={styles.headerStatusDot} />
                  <Text style={styles.headerStatusText}>
                    {typing ? 'Typing…' : 'Usually replies in 2 hours'}
                  </Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View coach profile"
              onPress={() => router.push(`/trainer/${trainer.id}`)}
              style={({ pressed }) => [
                styles.viewButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="person-outline" size={15} color={colors.ink} />
              <Text style={styles.viewButtonText}>Profile</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View style={styles.centerNote}>
            <Text style={styles.centerNoteText}>Your conversation</Text>
          </View>

          {thread.messages.length === 0 ? (
            <View style={styles.intro}>
              <Image
                source={trainer.image}
                style={styles.introImage}
                contentFit="cover"
                contentPosition="top"
              />
              <Text style={styles.introTitle}>
                Say hello to {trainer.name.split(' ')[0]}
              </Text>
              <Text style={styles.introText}>
                Share a goal, ask about a session, or sort out logistics. Your
                coach will see it right away.
              </Text>
            </View>
          ) : null}

          <View style={styles.messages}>
            {thread.messages.map((message) => {
              const mine = message.from === 'user';
              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,
                    mine ? styles.messageRowMine : styles.messageRowTheirs,
                  ]}
                >
                  {!mine ? (
                    <Image
                      source={trainer.image}
                      style={styles.messageAvatar}
                      contentFit="cover"
                      contentPosition="top"
                    />
                  ) : null}
                  <View style={styles.messageBody}>
                    <View
                      style={[
                        styles.bubble,
                        mine ? styles.bubbleMine : styles.bubbleTheirs,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bubbleText,
                          mine && styles.bubbleTextMine,
                        ]}
                      >
                        {message.text}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.messageTime,
                        mine && styles.messageTimeMine,
                      ]}
                    >
                      {mine ? `${USER.firstName} · ` : ''}
                      {message.at}
                    </Text>
                  </View>
                </View>
              );
            })}

            {typing ? (
              <View style={[styles.messageRow, styles.messageRowTheirs]}>
                <Image
                  source={trainer.image}
                  style={styles.messageAvatar}
                  contentFit="cover"
                  contentPosition="top"
                />
                <View style={styles.typingBubble}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.composer}>
          <View style={styles.composerInner}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickScroll}
              contentContainerStyle={styles.quickRow}
            >
              {QUICK_REPLIES.map((reply) => (
                <Pressable
                  key={reply}
                  accessibilityRole="button"
                  onPress={() => submit(reply)}
                  style={({ pressed }) => [
                    styles.quickChip,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.quickChipText}>{reply}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Write a message…"
                placeholderTextColor={colors.muted}
                style={styles.input}
                multiline
                maxLength={500}
                accessibilityLabel="Message"
                onSubmitEditing={() => submit()}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Send message"
                accessibilityState={{ disabled: !draft.trim() }}
                onPress={() => submit()}
                style={({ pressed }) => [
                  styles.sendButton,
                  !draft.trim() && styles.sendButtonDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="arrow-up" size={18} color={colors.ink} />
              </Pressable>
            </View>

            <View style={styles.composerMeta}>
              <Ionicons
                name="lock-closed-outline"
                size={10}
                color={colors.muted}
              />
              <Text style={styles.composerMetaText}>
                Messages are private between you and your coach.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    padding: layout.screenPadding,
  },
  header: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerInner: {
    width: '100%',
    maxWidth: layout.profileWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 12,
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
  },
  headerPerson: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  headerName: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  headerStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.volt,
    borderWidth: 1,
    borderColor: colors.inkSoft,
  },
  headerStatusText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  viewButtonText: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  chatContent: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 16,
    paddingBottom: 20,
  },
  centerNote: {
    alignItems: 'center',
    marginBottom: 18,
  },
  centerNoteText: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  intro: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  introImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: colors.volt,
  },
  introTitle: {
    ...type.h2,
    marginTop: 12,
  },
  introText: {
    ...type.small,
    textAlign: 'center',
    maxWidth: 380,
    marginTop: 6,
  },
  messages: {
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowTheirs: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
  },
  messageBody: {
    maxWidth: '78%',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radius.lg,
  },
  bubbleTheirs: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderBottomLeftRadius: 6,
  },
  bubbleMine: {
    backgroundColor: colors.ink,
    borderBottomRightRadius: 6,
  },
  bubbleText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 19,
    color: colors.inkSoft,
  },
  bubbleTextMine: {
    color: colors.white,
  },
  messageTime: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
    marginTop: 4,
    marginLeft: 4,
  },
  messageTimeMine: {
    textAlign: 'right',
    marginRight: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderBottomLeftRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.muted,
  },
  composer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
  },
  composerInner: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'web' ? 12 : 8,
  },
  quickScroll: {
    marginHorizontal: -layout.screenPadding,
    marginBottom: 8,
  },
  quickRow: {
    gap: 7,
    paddingHorizontal: layout.screenPadding,
  },
  quickChip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.inkSoft,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 9,
    padding: 6,
    paddingLeft: 14,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 110,
    fontSize: 13.5,
    fontFamily: fonts.regular,
    lineHeight: 19,
    color: colors.ink,
    paddingVertical: 9,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceMuted,
  },
  composerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
  },
  composerMetaText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
  },
  pressed: {
    opacity: 0.76,
  },
});
