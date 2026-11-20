import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows, type , fonts } from '@/constants/theme';
import { formatINR } from '@/data/trainers';

const PIN_POSITIONS = [
  { top: '24%', left: '20%' },
  { top: '38%', left: '57%' },
  { top: '30%', left: '35%' },
  { top: '18%', left: '48%' },
  { top: '58%', left: '66%' },
  { top: '52%', left: '27%' },
  { top: '72%', left: '41%' },
  { top: '44%', left: '12%' },
  { top: '64%', left: '52%' },
  { top: '36%', left: '74%' },
];

const MAP_LABELS = [
  { label: 'Jalukbari', top: '9%', left: '9%' },
  { label: 'Zoo Road', top: '20%', left: '28%' },
  { label: 'GS Road', top: '42%', left: '38%' },
  { label: 'Dispur', top: '55%', left: '58%' },
  { label: 'Uzan Bazar', top: '72%', left: '30%' },
  { label: 'Khanapara', top: '68%', left: '68%' },
];

function Street({ style }) {
  return <View style={[styles.street, style]} />;
}

export function TrainerMap({
  trainers,
  selectedId,
  onSelect,
  height = 620,
  style,
}) {
  const router = useRouter();
  const selected =
    trainers.find((trainer) => trainer.id === selectedId) || null;

  return (
    <View style={[styles.shell, { height }, style]}>
      <View style={styles.map}>
        <View style={styles.bay} />
        <View style={styles.park} />
        <View style={styles.parkSmall} />

        <Street style={{ top: '16%', left: '-5%', right: '-5%' }} />
        <Street style={{ top: '33%', left: '-5%', right: '-5%' }} />
        <Street style={{ top: '50%', left: '-5%', right: '-5%' }} />
        <Street style={{ top: '67%', left: '-5%', right: '-5%' }} />
        <Street style={{ top: '84%', left: '-5%', right: '-5%' }} />
        <Street
          style={{
            top: '-10%',
            bottom: '-10%',
            left: '22%',
            width: 1,
            height: '120%',
          }}
        />
        <Street
          style={{
            top: '-10%',
            bottom: '-10%',
            left: '44%',
            width: 1,
            height: '120%',
          }}
        />
        <Street
          style={{
            top: '-10%',
            bottom: '-10%',
            left: '66%',
            width: 1,
            height: '120%',
          }}
        />
        <Street
          style={{
            top: '-10%',
            bottom: '-10%',
            left: '84%',
            width: 1,
            height: '120%',
          }}
        />
        <Street
          style={{
            top: '-22%',
            left: '10%',
            width: 1,
            height: '145%',
            transform: [{ rotate: '34deg' }],
          }}
        />
        <Street
          style={{
            top: '10%',
            left: '-15%',
            width: '130%',
            height: 1,
            transform: [{ rotate: '-9deg' }],
          }}
        />

        {MAP_LABELS.map((item) => (
          <Text
            key={item.label}
            style={[styles.mapLabel, { top: item.top, left: item.left }]}
          >
            {item.label}
          </Text>
        ))}

        {trainers.map((trainer, index) => {
          const position =
            PIN_POSITIONS[index % PIN_POSITIONS.length] || PIN_POSITIONS[0];
          const selectedPin = trainer.id === selectedId;

          return (
            <Pressable
              key={trainer.id}
              accessibilityRole="button"
              accessibilityLabel={`${trainer.name}, ${formatINR(trainer.price)} per session, ${trainer.neighborhood}`}
              onPress={() => onSelect(trainer.id)}
              style={({ pressed }) => [
                styles.pin,
                position,
                selectedPin && styles.pinSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.pinText,
                  selectedPin && styles.pinTextSelected,
                ]}
              >
                {formatINR(trainer.price)}
              </Text>
            </Pressable>
          );
        })}

        <View style={styles.legend}>
          <Ionicons name="navigate" size={11} color={colors.muted} />
          <Text style={styles.legendText}>Guwahati</Text>
        </View>
        <Text style={styles.attribution}>Illustrated map · instafit.</Text>
      </View>

      {selected ? (
        <View style={styles.preview}>
          <Image
            source={selected.image}
            style={styles.previewImage}
            contentFit="cover"
            transition={150}
          />
          <View style={styles.previewCopy}>
            <View style={styles.previewNameRow}>
              <Text numberOfLines={1} style={styles.previewName}>
                {selected.name}
              </Text>
              <View style={styles.previewRating}>
                <Ionicons name="star" size={10} color={colors.star} />
                <Text style={styles.previewRatingText}>
                  {selected.rating.toFixed(2)}
                </Text>
              </View>
            </View>
            <Text numberOfLines={1} style={styles.previewMeta}>
              {selected.role} · {selected.neighborhood}
            </Text>
            <View style={styles.previewBottom}>
              <Text style={styles.previewPrice}>
                {formatINR(selected.price)}
                <Text style={styles.previewPer}> /session</Text>
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View ${selected.name}`}
                onPress={() => router.push(`/trainer/${selected.id}`)}
                style={({ pressed }) => [
                  styles.previewButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.previewButtonText}>View coach</Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={colors.ink}
                />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.previewHint}>
          <Ionicons name="map-outline" size={15} color={colors.ink} />
          <Text style={styles.previewHintText}>
            Tap a price pin to preview a coach
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  map: {
    flex: 1,
    backgroundColor: '#E9E9DE',
    overflow: 'hidden',
  },
  street: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(16,18,13,0.11)',
  },
  bay: {
    position: 'absolute',
    top: '-10%',
    right: '-14%',
    width: '44%',
    height: '120%',
    backgroundColor: '#D5E4E0',
    borderTopLeftRadius: 120,
    borderBottomLeftRadius: 80,
  },
  park: {
    position: 'absolute',
    top: '6%',
    left: '4%',
    width: '20%',
    height: '17%',
    borderRadius: 60,
    backgroundColor: '#D5E3C4',
  },
  parkSmall: {
    position: 'absolute',
    bottom: '9%',
    left: '38%',
    width: '18%',
    height: '12%',
    borderRadius: 40,
    backgroundColor: '#D5E3C4',
  },
  mapLabel: {
    position: 'absolute',
    fontSize: 8.5,
    lineHeight: 11,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(16,18,13,0.42)',
  },
  pin: {
    position: 'absolute',
    minWidth: 46,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  pinSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    transform: [{ scale: 1.08 }],
  },
  pinText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  pinTextSelected: {
    color: colors.volt,
  },
  pressed: {
    opacity: 0.82,
  },
  legend: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245,245,239,0.9)',
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  legendText: {
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.inkSoft,
  },
  attribution: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: 'rgba(16,18,13,0.35)',
  },
  preview: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  previewImage: {
    width: 72,
    height: 84,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  previewCopy: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  previewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  previewName: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  previewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  previewRatingText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  previewMeta: {
    ...type.tiny,
    marginTop: 2,
  },
  previewBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  previewPrice: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  previewPer: {
    fontSize: 9.5,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    color: colors.muted,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 32,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.volt,
  },
  previewButtonText: {
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
  previewHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  previewHintText: {
    ...type.tiny,
  },
});
