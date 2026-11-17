import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RatingBadge } from '@/components/RatingBadge';
import { ReviewCard } from '@/components/ReviewCard';
import { ScreenMeta } from '@/components/ScreenMeta';
import { colors, layout, radius, shadows, type } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import {
  formatINR,
  getRatingBreakdown,
  getRatingCategories,
  getResponseTime,
  getTrainerById,
  getTrainerGallery,
  getTrainerVenue,
} from '@/data/trainers';
import { useResponsive } from '@/hooks/useResponsive';

function formatCount(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return String(value);
}

const INCLUDED = [
  { icon: 'clipboard-outline', label: 'Custom session plan' },
  { icon: 'barbell-outline', label: 'All equipment provided' },
  { icon: 'chatbubbles-outline', label: 'Live form feedback' },
  { icon: 'trending-up-outline', label: 'Progress tracking' },
];

export default function TrainerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDesktop } = useResponsive();
  const { isFavorite, toggleFavorite, startThread } = useBookings();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [photosOpen, setPhotosOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const trainer = getTrainerById(Array.isArray(id) ? id[0] : id);

  if (!trainer) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Trainer not found</Text>
          <Text style={styles.notFoundText}>
            This profile may have moved or is no longer available.
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

  const saved = isFavorite(trainer.id);
  const gallery = getTrainerGallery(trainer);
  const venue = getTrainerVenue(trainer);
  const breakdown = getRatingBreakdown(trainer);
  const categories = getRatingCategories(trainer);
  const responseTime = getResponseTime(trainer);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };
  const openBooking = () => router.push(`/booking/${trainer.id}`);
  const openMessage = () => {
    const threadId = startThread(trainer.id);
    router.push(`/inbox/${threadId}`);
  };
  const photosButton = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Show all photos"
      onPress={() => setPhotosOpen(true)}
      style={({ pressed }) => [
        styles.photosPill,
        pressed && styles.photosPillPressed,
      ]}
    >
      <Ionicons name="images-outline" size={13} color={colors.ink} />
      <Text style={styles.photosPillText}>Show all photos</Text>
    </Pressable>
  );

  const heartButton = (
    <IconButton
      name={saved ? 'heart' : 'heart-outline'}
      variant="glass"
      size={20}
      color={saved ? colors.heart : colors.ink}
      accessibilityLabel={
        saved ? 'Remove from saved trainers' : 'Save this trainer'
      }
      onPress={() => toggleFavorite(trainer.id)}
    />
  );

  const titleBlock = (
    <View style={styles.titleBlock}>
      <View style={styles.nameRow}>
        <Text style={[styles.name, isDesktop && styles.nameDesktop]}>
          {trainer.name}
        </Text>
        {trainer.verified ? (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark" size={11} color={colors.ink} />
          </View>
        ) : null}
      </View>
      <Text style={styles.role}>{trainer.role}</Text>
      <View style={styles.metaRow}>
        <RatingBadge
          rating={trainer.rating}
          reviewCount={trainer.reviewCount}
          tone="plain"
          size={12}
        />
        <View style={styles.metaDot} />
        <View style={styles.metaLocation}>
          <Ionicons
            name="location-outline"
            size={13}
            color={colors.muted}
          />
          <Text style={styles.metaText} numberOfLines={1}>
            {venue.name}, {trainer.neighborhood} · {trainer.distance} km
          </Text>
        </View>
      </View>
    </View>
  );

  const reservationCard = (
    <View style={[styles.reservationCard, isDesktop && styles.reservationCardDesktop]}>
      <View style={styles.reservationTop}>
        <Text style={styles.reservationPrice}>{formatINR(trainer.price)}</Text>
        <Text style={styles.reservationPer}> /session</Text>
        <View style={styles.reservationRating}>
          <Ionicons name="star" size={11} color={colors.star} />
          <Text style={styles.reservationRatingText}>
            {trainer.rating.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.reservationRows}>
        <View style={styles.reservationRow}>
          <Ionicons name="time-outline" size={14} color={colors.inkSoft} />
          <Text style={styles.reservationRowText} numberOfLines={1}>
            45 · 60 · 90 min sessions
          </Text>
        </View>
        <View style={styles.reservationRow}>
          <Ionicons
            name={trainer.availableToday ? 'flash' : 'calendar-outline'}
            size={14}
            color={colors.inkSoft}
          />
          <Text style={styles.reservationRowText} numberOfLines={1}>
            {trainer.nextAvailable}
          </Text>
        </View>
        <View style={styles.reservationRow}>
          <Ionicons name="chatbubble-outline" size={14} color={colors.inkSoft} />
          <Text style={styles.reservationRowText} numberOfLines={1}>
            {responseTime}
          </Text>
        </View>
      </View>
      <PrimaryButton
        label="Book a session"
        onPress={openBooking}
        style={styles.reservationButton}
      />
      <Text style={styles.reservationNote}>You won&apos;t be charged yet</Text>
      <View style={styles.reservationPolicy}>
        <Ionicons
          name="shield-checkmark-outline"
          size={13}
          color={colors.muted}
        />
        <Text style={styles.reservationPolicyText}>
          Free rescheduling up to 12 hours before your session.
        </Text>
      </View>
    </View>
  );

  const hostCard = (
    <View style={styles.hostCard}>
      <View style={styles.hostHeader}>
        <Image
          source={trainer.image}
          style={styles.hostAvatar}
          contentFit="cover"
        />
        <View style={styles.hostCopy}>
          <Text style={styles.hostName}>Meet your coach</Text>
          <Text style={styles.hostMeta} numberOfLines={1}>
            {trainer.name} · {trainer.experience} yrs coaching · {responseTime}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Message ${trainer.name}`}
          onPress={openMessage}
          style={({ pressed }) => [
            styles.hostButton,
            pressed && styles.hostButtonPressed,
          ]}
        >
          <Ionicons name="chatbubble-outline" size={13} color={colors.ink} />
          <Text style={styles.hostButtonText}>Message</Text>
        </Pressable>
      </View>
      <Text style={styles.hostBio} numberOfLines={2}>
        {trainer.bio}
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenMeta
        title={trainer.name}
        description={`Book ${trainer.name}, ${trainer.role.toLowerCase()} in ${trainer.neighborhood}, Guwahati. Rated ${trainer.rating} from ${trainer.reviewCount} client reviews.`}
      />
      <StatusBar style="light" />

      {isDesktop ? (
        <View style={styles.desktopTop}>
          <IconButton
            name="arrow-back"
            variant="surface"
            accessibilityLabel="Go back"
            onPress={goBack}
          />
          {heartButton}
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isDesktop ? (
          <>
            <View style={styles.galleryGrid}>
              <Image
                source={gallery[0]}
                style={styles.galleryMain}
                contentFit="cover"
                transition={220}
              />
              <View style={styles.gallerySide}>
                {[gallery[1], gallery[2], gallery[3], gallery[4]].map(
                  (source, index) => (
                    <Image
                      key={index}
                      source={source}
                      style={styles.gallerySmall}
                      contentFit="cover"
                      transition={220}
                    />
                  )
                )}
              </View>
              <View style={styles.photosOverlay}>{photosButton}</View>
            </View>

            <View style={styles.desktopContainer}>
              {titleBlock}
              <View style={styles.desktopColumns}>
                <View style={styles.mainColumn}>
                  <View style={styles.statsCard}>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>
                        {trainer.experience} yrs
                      </Text>
                      <Text style={styles.statLabel}>Experience</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{trainer.clients}+</Text>
                      <Text style={styles.statLabel}>Clients</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>
                        {formatCount(trainer.sessions)}
                      </Text>
                      <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                  </View>

                  {hostCard}

                  <Text style={styles.sectionTitle}>About</Text>
                  <Text style={styles.bio}>{trainer.bio}</Text>

                  <Text style={styles.sectionTitle}>What&apos;s included</Text>
                  <View style={styles.includedGrid}>
                    {INCLUDED.map((item) => (
                      <View key={item.label} style={styles.includedItem}>
                        <View style={styles.includedIcon}>
                          <Ionicons
                            name={item.icon}
                            size={16}
                            color={colors.ink}
                          />
                        </View>
                        <Text style={styles.includedText}>{item.label}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.sectionTitle}>Specialties</Text>
                  <View style={styles.tags}>
                    {trainer.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.sectionTitle}>Certifications</Text>
                  <View style={styles.certList}>
                    {trainer.certifications.map((certification) => (
                      <View key={certification} style={styles.certRow}>
                        <View style={styles.certIcon}>
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color={colors.ink}
                          />
                        </View>
                        <Text style={styles.certText}>{certification}</Text>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.sectionTitle}>Where you&apos;ll train</Text>
                  <View style={styles.venueCard}>
                    <View style={styles.venueIcon}>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={colors.ink}
                      />
                    </View>
                    <View style={styles.venueCopy}>
                      <Text style={styles.venueName}>{venue.name}</Text>
                      <Text style={styles.venueAddress}>{venue.address}</Text>
                      <Text style={styles.venueNote}>{venue.note}</Text>
                    </View>
                  </View>

                  <View style={styles.reviewHeader}>
                    <Text style={styles.sectionTitleNoMargin}>
                      ★ {trainer.rating.toFixed(2)} · {trainer.reviewCount}{' '}
                      reviews
                    </Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <View style={styles.breakdownBars}>
                      {breakdown.map((row) => (
                        <View key={row.stars} style={styles.barRow}>
                          <Text style={styles.barStars}>{row.stars}★</Text>
                          <View style={styles.barTrack}>
                            <View
                              style={[
                                styles.barFill,
                                { width: `${row.percent}%` },
                              ]}
                            />
                          </View>
                          <Text style={styles.barPercent}>{row.percent}%</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.breakdownCats}>
                      {categories.map((row) => (
                        <View key={row.label} style={styles.catRow}>
                          <Text style={styles.catLabel}>{row.label}</Text>
                          <View style={styles.catTrack}>
                            <View
                              style={[
                                styles.catFill,
                                { width: `${(row.value / 5) * 100}%` },
                              ]}
                            />
                          </View>
                          <Text style={styles.catValue}>{row.value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.reviewList}>
                    {trainer.reviews.map((review) => (
                      <ReviewCard
                        key={`${trainer.id}-${review.author}`}
                        review={review}
                      />
                    ))}
                  </View>

                  <View style={styles.policyRow}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={16}
                      color={colors.muted}
                    />
                    <Text style={styles.policyText}>
                      Free rescheduling up to 12 hours before your session.
                    </Text>
                  </View>
                </View>

                <View style={styles.sideColumn}>
                  <View style={styles.sticky}>{reservationCard}</View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.hero}>
              <Image
                source={gallery[0]}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                transition={220}
              />
              <LinearGradient
                colors={[
                  'rgba(16,18,13,0.52)',
                  'rgba(16,18,13,0.02)',
                  'rgba(16,18,13,0.64)',
                ]}
                locations={[0, 0.34, 1]}
                style={StyleSheet.absoluteFill}
              />

              <View
                style={[
                  styles.heroActions,
                  { paddingTop: insets.top + 8 },
                ]}
              >
                <IconButton
                  name="arrow-back"
                  variant="glass"
                  accessibilityLabel="Go back"
                  onPress={goBack}
                />
                {heartButton}
              </View>

              <View style={styles.heroBottom}>
                <View style={styles.heroTag}>
                  <View
                    style={[
                      styles.heroTagDot,
                      {
                        backgroundColor: trainer.availableToday
                          ? colors.volt
                          : colors.lineStrong,
                      },
                    ]}
                  />
                  <Text style={styles.heroTagText}>
                    {trainer.nextAvailable}
                  </Text>
                </View>
                {photosButton}
              </View>
            </View>

            <View style={styles.sheet}>
              <View style={styles.handle} />

              {titleBlock}

              <View style={styles.statsCard}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{trainer.experience} yrs</Text>
                  <Text style={styles.statLabel}>Experience</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{trainer.clients}+</Text>
                  <Text style={styles.statLabel}>Clients</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {formatCount(trainer.sessions)}
                  </Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
              </View>

              {hostCard}

              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{trainer.bio}</Text>

              <Text style={styles.sectionTitle}>What&apos;s included</Text>
              <View style={styles.includedGrid}>
                {INCLUDED.map((item) => (
                  <View key={item.label} style={styles.includedItem}>
                    <View style={styles.includedIcon}>
                      <Ionicons name={item.icon} size={16} color={colors.ink} />
                    </View>
                    <Text style={styles.includedText}>{item.label}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Specialties</Text>
              <View style={styles.tags}>
                {trainer.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Certifications</Text>
              <View style={styles.certList}>
                {trainer.certifications.map((certification) => (
                  <View key={certification} style={styles.certRow}>
                    <View style={styles.certIcon}>
                      <Ionicons name="checkmark" size={12} color={colors.ink} />
                    </View>
                    <Text style={styles.certText}>{certification}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Where you&apos;ll train</Text>
              <View style={styles.venueCard}>
                <View style={styles.venueIcon}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={colors.ink}
                  />
                </View>
                <View style={styles.venueCopy}>
                  <Text style={styles.venueName}>{venue.name}</Text>
                  <Text style={styles.venueAddress}>{venue.address}</Text>
                  <Text style={styles.venueNote}>{venue.note}</Text>
                </View>
              </View>

              <View style={styles.availabilityCard}>
                <View style={styles.availGlow} />
                <View>
                  <Text style={styles.availLabel}>Next available</Text>
                  <Text style={styles.availTime}>{trainer.nextAvailable}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Book a session with ${trainer.name}`}
                  onPress={openBooking}
                  style={({ pressed }) => [
                    styles.availButton,
                    pressed && styles.availButtonPressed,
                  ]}
                >
                  <Text style={styles.availButtonText}>Book</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color={colors.ink}
                  />
                </Pressable>
              </View>

              <View style={styles.reviewHeader}>
                <Text style={styles.sectionTitleNoMargin}>Reviews</Text>
                <Text style={styles.reviewSummary}>
                  {trainer.rating.toFixed(2)} · {trainer.reviewCount} reviews
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownBars}>
                  {breakdown.map((row) => (
                    <View key={row.stars} style={styles.barRow}>
                      <Text style={styles.barStars}>{row.stars}★</Text>
                      <View style={styles.barTrack}>
                        <View
                          style={[styles.barFill, { width: `${row.percent}%` }]}
                        />
                      </View>
                      <Text style={styles.barPercent}>{row.percent}%</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.reviewList}>
                {trainer.reviews.map((review) => (
                  <ReviewCard
                    key={`${trainer.id}-${review.author}`}
                    review={review}
                  />
                ))}
              </View>

              <View style={styles.policyRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={colors.muted}
                />
                <Text style={styles.policyText}>
                  Free rescheduling up to 12 hours before your session.
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={photosOpen}
        animationType="fade"
        onRequestClose={() => setPhotosOpen(false)}
        onShow={() => setPhotoIndex(0)}
      >
        <View style={styles.photosModal}>
          <View
            style={[
              styles.photosModalBar,
              { paddingTop: insets.top + 12 },
            ]}
          >
            <IconButton
              name="close"
              variant="glass"
              accessibilityLabel="Close photos"
              onPress={() => setPhotosOpen(false)}
            />
            <Text style={styles.photosModalTitle} numberOfLines={1}>
              {trainer.name} · {gallery.length} photos
            </Text>
            <View style={styles.photosModalSpacer} />
          </View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.photosPager}
            contentContainerStyle={styles.photosScroll}
            onScroll={(event) =>
              setPhotoIndex(
                Math.min(
                  gallery.length - 1,
                  Math.max(
                    0,
                    Math.round(
                      event.nativeEvent.contentOffset.x / windowWidth
                    )
                  )
                )
              )
            }
            scrollEventThrottle={80}
          >
            {gallery.map((source, index) => (
              <View
                key={`${trainer.id}-photo-${index}`}
                style={[
                  styles.photoSlide,
                  { width: windowWidth, height: windowHeight - 84 },
                ]}
              >
                <Image
                  source={source}
                  style={styles.photoFull}
                  contentFit="contain"
                  transition={200}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.photosCounter} pointerEvents="none">
            <Text style={styles.photosCounterText}>
              {photoIndex + 1} / {gallery.length}
            </Text>
          </View>
        </View>
      </Modal>

      {!isDesktop ? (
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 14) },
          ]}
        >
          <View style={styles.barPriceBlock}>
            <Text style={styles.barLabel}>From</Text>
            <View style={styles.barPriceRow}>
              <Text style={styles.barPrice}>{formatINR(trainer.price)}</Text>
              <Text style={styles.barPer}>/session</Text>
            </View>
          </View>
          <PrimaryButton
            label="Book a session"
            onPress={openBooking}
            style={styles.barButton}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  desktopTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 14,
  },
  galleryGrid: {
    width: '100%',
    maxWidth: layout.wideWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    gap: 8,
    height: 430,
  },
  galleryMain: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  gallerySide: {
    width: '38%',
    flexWrap: 'wrap',
    gap: 8,
  },
  gallerySmall: {
    width: '48.5%',
    height: '48.5%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  desktopContainer: {
    width: '100%',
    maxWidth: layout.wideWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 28,
  },
  desktopColumns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 40,
    marginTop: 6,
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
  },
  sideColumn: {
    width: 360,
    flexShrink: 0,
  },
  sticky: {
    position: 'sticky',
    top: 20,
  },
  titleBlock: {
    marginTop: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  name: {
    ...type.h1,
    fontSize: 28,
    flexShrink: 1,
  },
  nameDesktop: {
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -1.4,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  role: {
    ...type.small,
    marginTop: 3,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
    minWidth: 0,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.lineStrong,
    marginHorizontal: 2,
  },
  metaText: {
    ...type.small,
  },
  reservationCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 20,
    ...shadows.card,
  },
  reservationCardDesktop: {
    padding: 22,
  },
  reservationTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  reservationPrice: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: colors.ink,
  },
  reservationPer: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
    color: colors.muted,
  },
  reservationRating: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reservationRatingText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },
  reservationRows: {
    marginTop: 14,
    gap: 9,
  },
  reservationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reservationRowText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  reservationButton: {
    marginTop: 16,
  },
  reservationNote: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    color: colors.muted,
  },
  reservationPolicy: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reservationPolicyText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 14,
    color: colors.muted,
  },
  statsCard: {
    marginTop: 22,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    ...shadows.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: colors.ink,
  },
  statLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.line,
  },
  sectionTitle: {
    ...type.h2,
    fontSize: 19,
    marginTop: 28,
    marginBottom: 10,
  },
  sectionTitleNoMargin: {
    ...type.h2,
    fontSize: 19,
  },
  bio: {
    ...type.body,
  },
  includedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  includedItem: {
    flexGrow: 1,
    flexBasis: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  includedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.voltSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  includedText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  certList: {
    gap: 10,
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  certIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.inkSoft,
  },
  venueCard: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
  },
  venueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  venueCopy: {
    flex: 1,
    minWidth: 0,
  },
  venueName: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    color: colors.ink,
  },
  venueAddress: {
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 2,
  },
  venueNote: {
    ...type.tiny,
    marginTop: 6,
  },
  availabilityCard: {
    marginTop: 28,
    borderRadius: radius.xl,
    backgroundColor: colors.darkCard,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    overflow: 'hidden',
  },
  availGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.volt,
    opacity: 0.08,
    right: -35,
    top: -55,
  },
  availLabel: {
    ...type.label,
    color: 'rgba(255,255,255,0.5)',
  },
  availTime: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: colors.white,
    marginTop: 4,
  },
  availButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.volt,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  availButtonPressed: {
    opacity: 0.82,
  },
  availButtonText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.ink,
  },
  reviewHeader: {
    marginTop: 28,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 10,
  },
  reviewSummary: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
    color: colors.muted,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 22,
    marginBottom: 16,
  },
  breakdownBars: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  breakdownCats: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barStars: {
    width: 26,
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.ink,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.ink,
  },
  barPercent: {
    width: 34,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catLabel: {
    width: 96,
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.inkSoft,
  },
  catTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.volt,
  },
  catValue: {
    width: 28,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
  },
  reviewList: {
    gap: 10,
  },
  policyRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    justifyContent: 'center',
  },
  policyText: {
    ...type.tiny,
  },
  hero: {
    height: 440,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'space-between',
  },
  heroActions: {
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroBottom: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 48,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(16, 18, 13, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  heroTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroTagText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: colors.white,
  },
  sheet: {
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colors.bg,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.lineStrong,
    alignSelf: 'center',
    marginBottom: 18,
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
    paddingHorizontal: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  barPriceBlock: {
    minWidth: 84,
  },
  barLabel: {
    ...type.label,
    fontSize: 9,
  },
  barPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  barPrice: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.7,
    color: colors.ink,
  },
  barPer: {
    fontSize: 9.5,
    color: colors.muted,
    fontWeight: '600',
  },
  barButton: {
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
  photosPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  photosPillPressed: {
    opacity: 0.85,
  },
  photosPillText: {
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  photosOverlay: {
    position: 'absolute',
    right: layout.screenPadding,
    bottom: 16,
  },
  photosModal: {
    flex: 1,
    backgroundColor: '#0B0C08',
  },
  photosModalBar: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photosModalTitle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    color: colors.white,
  },
  photosModalSpacer: {
    width: 40,
  },
  photosPager: {
    flex: 1,
  },
  photosScroll: {
    alignItems: 'center',
  },
  photoSlide: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFull: {
    width: '100%',
    height: '100%',
  },
  photosCounter: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  photosCounterText: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: 'rgba(16, 18, 13, 0.72)',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: colors.white,
  },
  hostCard: {
    marginTop: 24,
    flexDirection: 'column',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    ...shadows.card,
  },
  hostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
  },
  hostCopy: {
    flex: 1,
    minWidth: 0,
  },
  hostName: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  hostMeta: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    color: colors.muted,
    marginTop: 2,
  },
  hostBio: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.inkSoft,
  },
  hostButton: {
    height: 36,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.ink,
    backgroundColor: colors.volt,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  hostButtonPressed: {
    opacity: 0.82,
  },
  hostButtonText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    color: colors.ink,
  },
});
