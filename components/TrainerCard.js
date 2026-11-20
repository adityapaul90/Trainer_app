import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { colors, radius, type , fonts } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { formatINR } from '@/data/trainers';

export function TrainerCard({ trainer, style }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useBookings();
  const saved = isFavorite(trainer.id);

  const openTrainer = () => router.push(`/trainer/${trainer.id}`);

  return (
    <View style={[styles.card, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${trainer.name}, ${trainer.role}`}
        onPress={openTrainer}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View style={styles.imageWrap}>
          <Image
            source={trainer.image}
            style={styles.image}
            contentFit="cover"
            transition={220}
          />
          {trainer.rating >= 4.95 ? (
            <View style={styles.favoriteBadge}>
              <Ionicons name="star" size={10} color={colors.ink} />
              <Text style={styles.favoriteText}>Client favourite</Text>
            </View>
          ) : null}

          {trainer.availableToday ? (
            <View style={styles.availablePill}>
              <View style={styles.availableDot} />
              <Text style={styles.availableText}>Available today</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>
              {trainer.name}
            </Text>
            {trainer.verified ? (
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={colors.ink}
              />
            ) : null}
          </View>
          <Text numberOfLines={1} style={styles.role}>
            {trainer.role}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={11} color={colors.star} />
              <Text style={styles.ratingText}>
                {trainer.rating.toFixed(2)}
              </Text>
              <Text style={styles.reviewText}>({trainer.reviewCount})</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text numberOfLines={1} style={styles.meta}>
                {trainer.neighborhood}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatINR(trainer.price)}</Text>
              <Text style={styles.per}>/session</Text>
            </View>
          </View>
        </View>
      </Pressable>

      <IconButton
        name={saved ? 'heart' : 'heart-outline'}
        variant="glass"
        size={18}
        color={saved ? colors.heart : colors.ink}
        accessibilityLabel={
          saved ? 'Remove from saved trainers' : 'Save this trainer'
        }
        onPress={() => toggleFavorite(trainer.id)}
        style={styles.heart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
  },
  pressable: {
    borderRadius: radius.xl,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surfaceMuted,
  },
  imageWrap: {
    width: '100%',
    height: 300,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  favoriteText: {
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  heart: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    zIndex: 2,
  },
  availablePill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  availableText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  info: {
    paddingTop: 12,
    paddingHorizontal: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  name: {
    ...type.h3,
    fontSize: 17,
    fontFamily: fonts.regular,
    flexShrink: 1,
  },
  role: {
    ...type.small,
    marginTop: 1,
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  ratingRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  reviewText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
  },
  metaDot: {
    fontSize: 9,
    fontFamily: fonts.regular,
    color: colors.lineStrong,
    marginHorizontal: 1,
  },
  meta: {
    ...type.tiny,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  price: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  per: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
  },
});
