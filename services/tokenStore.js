import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'instafit_token';
const USER_KEY = 'instafit_user';

async function readItem(key) {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
}

async function writeItem(key, value) {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key) {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export function getToken() {
  return readItem(TOKEN_KEY);
}

export function setToken(token) {
  return writeItem(TOKEN_KEY, token);
}

export async function getStoredUser() {
  const raw = await readItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  return writeItem(USER_KEY, JSON.stringify(user));
}

export async function clearSession() {
  await removeItem(TOKEN_KEY);
  await removeItem(USER_KEY);
}
