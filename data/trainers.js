export const USER = {
  name: 'Aditya Paul',
  firstName: 'Aditya',
  initials: 'AP',
  email: 'aditya@instafit.app',
  phone: '+91 98640 12345',
  avatar: require('../assets/avatars/aditya.jpg'),
  location: 'Guwahati, Assam',
  memberSince: '2025',
};

export const PROMO_IMAGE = require('../assets/trainers/promo.jpg');

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'grid-outline' },
  { id: 'strength', label: 'Strength', icon: 'barbell-outline' },
  { id: 'hiit', label: 'HIIT', icon: 'flash-outline' },
  { id: 'yoga', label: 'Yoga', icon: 'leaf-outline' },
  { id: 'boxing', label: 'Boxing', icon: 'hand-left-outline' },
  { id: 'pilates', label: 'Pilates', icon: 'body-outline' },
  { id: 'mobility', label: 'Mobility', icon: 'walk-outline' },
  { id: 'cardio', label: 'Cardio', icon: 'heart-outline' },
];

export const SESSION_TYPES = [
  { id: 'in-person', label: 'In person', note: 'At the gym', icon: 'location-outline' },
  { id: 'online', label: 'Online', note: 'Video call', icon: 'videocam-outline' },
  { id: 'partner', label: 'Partner', note: 'Bring a friend', icon: 'people-outline' },
];

export const DURATIONS = [
  { minutes: 45, surcharge: 0, label: '45 min', note: 'Focused' },
  { minutes: 60, surcharge: 300, label: '60 min', note: 'Most popular' },
  { minutes: 90, surcharge: 800, label: '90 min', note: 'Deep work' },
];

export const TIME_SLOTS = [
  '7:00 AM',
  '8:30 AM',
  '10:00 AM',
  '11:30 AM',
  '1:00 PM',
  '3:30 PM',
  '5:00 PM',
  '6:30 PM',
];

export const DISABLED_SLOTS = ['7:00 AM', '11:30 AM'];

export const SERVICE_FEE = 99;

export function formatINR(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

export const GYM_PHOTOS = [
  require('../assets/gyms/gym-1.jpg'),
  require('../assets/gyms/gym-2.jpg'),
  require('../assets/gyms/gym-3.jpg'),
  require('../assets/gyms/gym-4.jpg'),
  require('../assets/gyms/gym-5.jpg'),
];

function hashId(value) {
  return [...String(value)].reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function getTrainerVenue(trainer) {
  return {
    name: trainer.venue?.name || 'Venue to be confirmed',
    address:
      trainer.venue?.address ||
      'Your coach will confirm the location after booking.',
  };
}

export function getTrainerGallery(trainer) {
  const index = hashId(trainer.id) % GYM_PHOTOS.length;
  return [
    trainer.image,
    GYM_PHOTOS[index % GYM_PHOTOS.length],
    GYM_PHOTOS[(index + 1) % GYM_PHOTOS.length],
    GYM_PHOTOS[(index + 2) % GYM_PHOTOS.length],
    GYM_PHOTOS[(index + 3) % GYM_PHOTOS.length],
  ];
}

export function getRatingBreakdown(trainer) {
  const five = Math.min(
    98,
    Math.max(78, Math.round(78 + (trainer.rating - 4.8) * 100))
  );
  const four = Math.round((100 - five) * 0.7);
  const three = Math.max(0, 100 - five - four);

  return [
    { stars: 5, percent: five },
    { stars: 4, percent: four },
    { stars: 3, percent: three },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 },
  ];
}

export function getRatingCategories(trainer) {
  const base = Math.round(trainer.rating * 10) / 10;
  const clamp = (value) => Math.min(5, Math.round(value * 10) / 10);

  return [
    { label: 'Coaching', value: clamp(base) },
    { label: 'Communication', value: clamp(base - 0.1) },
    { label: 'Programming', value: clamp(base + 0.1) },
    { label: 'Facilities', value: clamp(base - 0.2) },
  ];
}

export function getResponseTime(trainer) {
  return trainer.responseTime || 'Replies on request';
}

let publishedTrainers = [];

export function registerPublishedTrainers(list) {
  publishedTrainers = Array.isArray(list) ? list : [];
}

export function getAllTrainers() {
  return publishedTrainers;
}

export function getTrainerById(id) {
  return publishedTrainers.find((trainer) => trainer.id === id);
}

export function getCategoryLabel(categoryId) {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  return category ? category.label : 'All';
}
