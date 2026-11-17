import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { BookingProvider } from '@/context/BookingContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
        </Stack>
      </BookingProvider>
    </SafeAreaProvider>
  );
}
