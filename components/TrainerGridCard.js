import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { RatingBadge } from '@/components/RatingBadge';
import { colors, radius, type } from '@/constants/theme';
import { useBookings } from '@/context/BookingContext';
import { formatINR } from '@/data/trainers';

export function TrainerGridCard({ trainer, width }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useBookings();
  const saved = isFavorite(trainer.id);
  const imageHeight = Math.round(width * 1.16);

  const openTrainer = () => router.push(`/trainer/${trainer.id}`);

  return (
    <View style={{ width }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${trainer.name}, ${trainer.role}`}
        onPress={openTrainer}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={styles.imageWrap}>
          <Image
            source={trainer.image}
            style={[styles.image, { height: imageHeight }]}
            contentFit="cover"
            transition={220}
          />
          <RatingBadge
            rating={trainer.rating}
            tone="dark"
            size={11}
            style={styles.rating}
          />
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>
              {trainer.name}
            </Text>
            {trainer.verified ? (
              <Ionicons name="checkmark-circle" size={14} color={colors.ink} />
            ) : null}
          </View>
          <Text numberOfLines={2} style={styles.role}>
            {trainer.role}
          </Text>
          <View style={styles.metaRow}>
            <Text numberOfLines={1} style={styles.meta}>
              {trainer.neighborhood} · {trainer.distance} km
            </Text>
            <Text style={styles.price}>{formatINR(trainer.price)}</Text>
          </View>
        </View>
      </Pressable>

      <IconButton
        name={saved ? 'heart' : 'heart-outline'}
        variant="glass"
        size={17}
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
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  image: {
    width: '100%',
    borderRadius: radius.lg,
  },
  rating: {
    position: 'absolute',
    left: 10,
    bottom: 10,
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    zIndex: 2,
  },
  info: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    ...type.h3,
    fontSize: 15,
    lineHeight: 19,
    flexShrink: 1,
  },
  role: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
    marginTop: 1,
    minHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 6,
  },
  meta: {
    ...type.tiny,
    flex: 1,
  },
  price: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: colors.ink,
  },
});
