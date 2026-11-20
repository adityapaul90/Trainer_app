import { getToken } from './tokenStore';

const BASE = process.env.EXPO_PUBLIC_API_URL;

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const token = auth ? await getToken() : null;

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.err || data.message || 'Request failed');
  }

  return data;
}
