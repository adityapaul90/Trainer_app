import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = 'instafit_booking_ids';

async function readIds() {
  const raw =
    Platform.OS === 'web'
      ? globalThis.localStorage?.getItem(KEY)
      : await SecureStore.getItemAsync(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIds(ids) {
  const raw = JSON.stringify(ids);
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(KEY, raw);
    return;
  }
  await SecureStore.setItemAsync(KEY, raw);
}

export function getSavedBookingIds() {
  return readIds();
}

export async function addSavedBookingId(id) {
  const ids = await readIds();
  if (!ids.includes(id)) {
    await writeIds([id, ...ids]);
  }
}
