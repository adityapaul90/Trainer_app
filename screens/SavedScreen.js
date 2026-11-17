import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DesktopHeader } from '@/components/DesktopHeader';
import { EmptyState } from '@/components/EmptyState';
import { IconButton } from '@/components/IconButton';
import { ScreenMeta } from '@/components/ScreenMeta';
import { TrainerGridCard } from '@/components/TrainerGridCard';
import { colors, layout, radius, type } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { getTrainerById } from '@/data/trainers';
import { useResponsive } from '@/hooks/useResponsive';

export default function SavedScreen() {
  const router = useRouter();
  const { favoriteIds } = useBookings();
  const { width, isDesktop } = useResponsive();

  const contentWidth = Math.min(width, layout.wideWidth);
  const columns = isDesktop ? 4 : 2;
  const gridGap = isDesktop ? 18 : 14;
  const cardWidth =
    (contentWidth - layout.screenPadding * 2 - gridGap * (columns - 1)) /
    columns;

  const savedTrainers = favoriteIds
    .map((trainerId) => getTrainerById(trainerId))
    .filter(Boolean);

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
        title="Saved trainers"
        description="Your shortlist of vetted personal trainers on instafit."
      />
      <DesktopHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[styles.container, isDesktop && styles.containerDesktop]}
        >
          <View style={styles.header}>
            <IconButton
              name="arrow-back"
              accessibilityLabel="Go back"
              onPress={goBack}
            />
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Your shortlist</Text>
              <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
                Saved trainers
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Ionicons name="heart" size={12} color={colors.heart} />
              <Text style={styles.countText}>{savedTrainers.length}</Text>
            </View>
          </View>

          {savedTrainers.length > 0 ? (
            <>
              <Text style={styles.subtitle}>
                Tap the heart on a card to remove a coach from your shortlist.
              </Text>

              <View style={[styles.grid, { columnGap: gridGap }]}>
                {savedTrainers.map((trainer) => (
                  <TrainerGridCard
                    key={trainer.id}
                    trainer={trainer}
                    width={cardWidth}
                  />
                ))}
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
                <Text style={styles.browseText}>Find more coaches</Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={colors.ink}
                />
              </Pressable>
            </>
          ) : (
            <EmptyState
              icon="heart-outline"
              title="Nothing saved yet"
              message="Tap the heart on any trainer to build a shortlist and compare them later."
              actionLabel="Browse trainers"
              onAction={() => router.push('/explore')}
              style={styles.empty}
            />
          )}
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
    paddingBottom: 40,
  },
  container: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 6,
  },
  containerDesktop: {
    maxWidth: layout.wideWidth,
    paddingTop: 28,
  },
  titleDesktop: {
    fontSize: 38,
    lineHeight: 43,
    letterSpacing: -1.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    ...type.label,
  },
  title: {
    ...type.h1,
    fontSize: 26,
    lineHeight: 31,
    marginTop: 3,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    ...type.small,
    marginTop: 16,
    marginBottom: 18,
    maxWidth: 320,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 22,
  },
  browseButton: {
    marginTop: 30,
    alignSelf: 'center',
    height: 44,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.volt,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  browseText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.ink,
  },
  pressed: {
    opacity: 0.78,
  },
  empty: {
    paddingTop: 70,
  },
});
