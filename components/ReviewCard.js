import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, type , fonts } from '@/constants/theme';

function initialsFor(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function ReviewCard({ review }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initialsFor(review.author)}</Text>
        </View>
        <View style={styles.authorBlock}>
          <Text style={styles.author}>{review.author}</Text>
          <Text style={styles.when}>{review.when}</Text>
        </View>
        <View style={styles.stars}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Ionicons
              key={index}
              name={index < review.rating ? 'star' : 'star-outline'}
              size={12}
              color={index < review.rating ? colors.star : colors.lineStrong}
            />
          ))}
        </View>
      </View>
      <Text style={styles.text}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
    letterSpacing: 0.2,
  },
  authorBlock: {
    flex: 1,
  },
  author: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
  },
  when: {
    ...type.tiny,
    marginTop: 1,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 22,
    color: colors.inkSoft,
  },
});
