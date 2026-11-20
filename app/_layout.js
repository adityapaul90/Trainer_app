import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { AuthProvider } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';
import { PublishedTrainersProvider } from '@/context/PublishedTrainersContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const style = document.createElement('style');
    style.textContent = [
      'html, body, #root, button, input, textarea, select {',
      "  font-family: 'Nunito_400Regular', system-ui, sans-serif;",
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PublishedTrainersProvider>
        <AuthProvider>
          <BookingProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="trainer/[id]"
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="booking/[id]"
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="booking/success"
                options={{ animation: 'fade', gestureEnabled: false }}
              />
              <Stack.Screen
                name="saved"
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="inbox/index"
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="inbox/[id]"
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="signed-out"
                options={{ animation: 'fade', gestureEnabled: false }}
              />
              <Stack.Screen
                name="sign-in"
                options={{ animation: 'fade', gestureEnabled: false }}
              />
            </Stack>
          </BookingProvider>
        </AuthProvider>
      </PublishedTrainersProvider>
    </SafeAreaProvider>
  );
}
