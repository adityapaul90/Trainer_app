import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RatingBadge } from '@/components/RatingBadge';
import { colors, radius, type , fonts } from '@/constants/theme';
import { formatINR } from '@/data/trainers';

export function TrainerRow({ trainer, style }) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${trainer.name}, ${trainer.role}`}
      onPress={() => router.push(`/trainer/${trainer.id}`)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Image
        source={trainer.image}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.name}>
            {trainer.name}
          </Text>
          {trainer.verified ? (
            <Ionicons name="checkmark-circle" size={14} color={colors.ink} />
          ) : null}
        </View>
        <Text numberOfLines={1} style={styles.role}>
          {trainer.role}
        </Text>
        <View style={styles.ratingRow}>
          <RatingBadge
            rating={trainer.rating}
            reviewCount={trainer.reviewCount}
            tone="plain"
            size={11}
          />
        </View>
        <View style={styles.slotRow}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: trainer.availableToday
                  ? colors.success
                  : colors.lineStrong,
              },
            ]}
          />
          <Text numberOfLines={1} style={styles.slot}>
            {trainer.nextAvailable}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.price}>{formatINR(trainer.price)}</Text>
        <Text style={styles.per}>session</Text>
        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={15} color={colors.ink} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    paddingRight: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.995 }],
  },
  image: {
    width: 76,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    ...type.h3,
    fontSize: 16,
    fontFamily: fonts.regular,
    flexShrink: 1,
  },
  role: {
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 17,
    color: colors.muted,
  },
  ratingRow: {
    marginTop: 3,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  slot: {
    ...type.tiny,
    flexShrink: 1,
  },
  right: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 0,
    minWidth: 58,
  },
  price: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  per: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.muted,
    fontWeight: '600',
    fontFamily: fonts.semibold,
  },
  chevron: {
    marginTop: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
