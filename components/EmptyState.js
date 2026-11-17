import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, type } from '@/constants/theme';
import { PrimaryButton } from '@/components/PrimaryButton';

export function EmptyState({
  icon = 'sparkles-outline',
  title,
  message,
  actionLabel,
  onAction,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={28} color={colors.ink} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel ? (
        <PrimaryButton
          label={actionLabel}
          onPress={onAction}
          variant="dark"
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 44,
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.volt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    ...type.h2,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    ...type.small,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 22,
  },
  button: {
    minWidth: 200,
    paddingHorizontal: 26,
  },
});
