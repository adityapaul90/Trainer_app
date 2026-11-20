import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors , fonts } from '@/constants/theme';
import { getInitials } from '@/utils/user';

export function UserAvatar({ user, style }) {
  const initials = getInitials(user);

  return (
    <View style={[styles.avatar, style]}>
      {initials ? (
        <Text style={styles.initials}>{initials}</Text>
      ) : (
        <Ionicons name="person" size={18} color={colors.ink} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.volt,
  },
  initials: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
  },
});
