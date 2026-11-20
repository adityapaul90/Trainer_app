import { PROMO_IMAGE } from '@/data/trainers';

import { api } from './api';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildLocation(row) {
  const city = clean(row.city);
  const state = clean(row.state);
  const area = clean(row.area);
  const showArea = area !== '' && area.toLowerCase() !== city.toLowerCase();

  return {
    label: [city || area, state].filter(Boolean).join(', '),
    address: [showArea ? area : '', city, state].filter(Boolean).join(', '),
  };
}

export async function getPublishedTrainers({ gymId, branchId } = {}) {
  const parts = [];
  if (gymId) parts.push(`gymId=${encodeURIComponent(gymId)}`);
  if (branchId) parts.push(`branchId=${encodeURIComponent(branchId)}`);
  const query = parts.length ? `?${parts.join('&')}` : '';

  try {
    const rows = await api(`/published-trainers${query}`, { auth: false });
    if (!Array.isArray(rows)) return [];

    return rows.map((row) => {
      const location = buildLocation(row);
      const gymName = clean(row.gymName);

      return {
        id: `published-${row.id}`,
        name: clean(row.name).replace(/\s+/g, ' ') || 'Trainer',
        role: row.role || 'Personal Trainer',
        image: row.profilePhotoUrl || PROMO_IMAGE,
        rating: 4.9,
        reviewCount: 0,
        price: row.rate || 0,
        neighborhood: location.label,
        city: clean(row.city),
        state: clean(row.state),
        area: clean(row.area),
        venue: { name: gymName, address: location.address },
        searchArea: [row.area, row.city, row.state, row.location]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
        experience: row.experienceYears || 0,
        clients: row.clientsTrained || 0,
        sessions: row.sessionsCompleted || 0,
        verified: true,
        availableToday: row.availableToday !== false,
        nextAvailable: row.nextAvailableSlot || 'Book on request',
        categories: Array.isArray(row.categories) ? row.categories : [],
        tags: [...(row.tags || []), gymName].filter(Boolean),
        bio: row.bio || '',
        certifications: row.certifications || [],
        responseTime: row.responseTime || '',
        reviews: [],
      };
    });
  } catch {
    return [];
  }
}
