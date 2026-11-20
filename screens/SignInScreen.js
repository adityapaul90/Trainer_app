import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenMeta } from '@/components/ScreenMeta';
import { colors, layout, radius , fonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScreenMeta
        title="Sign in"
        description="Sign in to your instafit account to sync your sessions and saved coaches."
      />
      <View style={styles.content}>
        <Text style={styles.brand}>
          instafit<Text style={styles.brandDot}>.</Text>
        </Text>
        <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in with the email and password from your instafit account.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Your password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            label={busy ? 'Signing in…' : 'Sign in'}
            variant="volt"
            icon="log-in-outline"
            disabled={busy || !email || !password}
            onPress={submit}
            style={styles.submit}
          />

          <PrimaryButton
            label="Continue without signing in"
            variant="ghost"
            icon={null}
            onPress={() => router.replace('/')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 32,
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
    letterSpacing: -0.6,
  },
  brandDot: {
    color: colors.volt,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    letterSpacing: 1.4,
    color: colors.muted,
    marginTop: 64,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    fontFamily: fonts.extrabold,
    color: colors.ink,
    letterSpacing: -1,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 20,
    color: colors.muted,
    marginTop: 10,
  },
  form: {
    marginTop: 32,
    maxWidth: 420,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.ink,
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontFamily: fonts.regular,
    marginTop: 14,
  },
  submit: {
    marginTop: 22,
    marginBottom: 8,
  },
});
