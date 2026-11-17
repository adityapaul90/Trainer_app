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

const REVIEW_BANK = [
  {
    author: 'Priya K.',
    rating: 5,
    when: '2 weeks ago',
    text: 'Caught a form issue in the first ten minutes that two other coaches missed. I left feeling stronger and, honestly, more confident.',
  },
  {
    author: 'Daniel R.',
    rating: 5,
    when: '1 month ago',
    text: 'Best session I have had in years. The workout was hard but never chaotic. Every exercise had a purpose.',
  },
  {
    author: 'Sana M.',
    rating: 5,
    when: '3 weeks ago',
    text: 'I came in nervous about training again after an injury. I never felt rushed or judged. Just really thoughtful coaching.',
  },
  {
    author: 'Leo T.',
    rating: 5,
    when: '2 months ago',
    text: 'Great energy and even better cueing. I finally understand what bracing actually means.',
  },
  {
    author: 'Jessie W.',
    rating: 4,
    when: '3 weeks ago',
    text: 'Really enjoyed the pace and the variety. I would have loved a longer cool-down, but I will be back.',
  },
  {
    author: 'Omar A.',
    rating: 5,
    when: '1 week ago',
    text: 'Booked a last-minute session and it was the highlight of my week. Clear plan, good music, zero ego.',
  },
  {
    author: 'Nina F.',
    rating: 5,
    when: '1 month ago',
    text: 'I have tried five trainers in the city. This is the first time I have actually looked forward to the next session.',
  },
  {
    author: 'Ben C.',
    rating: 5,
    when: '2 weeks ago',
    text: 'Thoughtful programming, spot-on feedback, and a genuinely good human. Worth every rupee.',
  },
];

function makeReviews(seed) {
  return [
    REVIEW_BANK[seed % REVIEW_BANK.length],
    REVIEW_BANK[(seed + 3) % REVIEW_BANK.length],
  ];
}

const IMAGES = {
  maya: require('../assets/trainers/maya.jpg'),
  marcus: require('../assets/trainers/marcus.jpg'),
  sofia: require('../assets/trainers/sofia.jpg'),
  jordan: require('../assets/trainers/jordan.jpg'),
  elena: require('../assets/trainers/elena.jpg'),
  andre: require('../assets/trainers/andre.jpg'),
  priya: require('../assets/trainers/priya.jpg'),
  lena: require('../assets/trainers/luca.jpg'),
  noah: require('../assets/trainers/noah.jpg'),
  nadia: require('../assets/trainers/nadia.jpg'),
};

export const GYM_PHOTOS = [
  require('../assets/gyms/gym-1.jpg'),
  require('../assets/gyms/gym-2.jpg'),
  require('../assets/gyms/gym-3.jpg'),
  require('../assets/gyms/gym-4.jpg'),
  require('../assets/gyms/gym-5.jpg'),
];

export const NEIGHBORHOODS = [
  'Zoo Road',
  'GS Road',
  'Six Mile',
  'Beltola',
  'Dispur',
  'Uzan Bazar',
  'Khanapara',
  'Pan Bazaar',
  'Chandmari',
];

const VENUES = {
  'Zoo Road': {
    name: 'Zoo Road Strength Club',
    address: 'Zoo Road Tiniali, Guwahati',
    note: 'Racks, platforms, and a turf lane just off Zoo Road.',
    area: 'Zoo Road',
  },
  'GS Road': {
    name: 'GS Road Fitness Hub',
    address: 'Anil Plaza, GS Road, Guwahati',
    note: 'A high-energy floor with sleds, ropes, and a full conditioning rig.',
    area: 'GS Road',
  },
  'Six Mile': {
    name: 'Six Mile Movement Studio',
    address: 'Six Mile, Khanapara Road, Guwahati',
    note: 'A quiet, light-filled studio built for mobility and breathwork.',
    area: 'Six Mile',
  },
  Beltola: {
    name: 'Beltola Core Studio',
    address: 'Beltola Survey, Guwahati',
    note: 'Reformer and mat Pilates in a calm neighbourhood setting.',
    area: 'Beltola',
  },
  Dispur: {
    name: 'Dispur Barbell Club',
    address: 'Dispur Last Gate, Guwahati',
    note: 'Competition plates, calibrated bars, and coaches who know both.',
    area: 'Dispur',
  },
  'Uzan Bazar': {
    name: 'Uzan Bazar Performance Lab',
    address: 'MG Road, Uzan Bazar, Guwahati',
    note: 'A private training floor for lifting and boxing technique.',
    area: 'Uzan Bazar',
  },
  Khanapara: {
    name: 'Khanapara Sports Arena',
    address: 'VIP Road, Khanapara, Guwahati',
    note: 'A bright group studio with room to move and a serious sound system.',
    area: 'Khanapara',
  },
  'Pan Bazaar': {
    name: 'Pan Bazaar Calisthenics Park',
    address: 'HB Road, Pan Bazaar, Guwahati',
    note: 'Pull-up rigs, parallettes, and open turf for bodyweight work.',
    area: 'Pan Bazaar',
  },
  Chandmari: {
    name: 'Chandmari Strength Co.',
    address: 'Chandmari, Guwahati',
    note: 'A neighbourhood gym with a hypertrophy setup and no waiting lines.',
    area: 'Chandmari',
  },
};

export function getTrainerVenue(trainer) {
  return (
    VENUES[trainer.neighborhood] || {
      name: `${trainer.neighborhood} Athletic Club`,
      address: `${trainer.neighborhood}, Guwahati`,
      note: 'A partner gym in this neighbourhood, reserved for instafit sessions.',
      area: trainer.neighborhood,
    }
  );
}

export function getTrainerGallery(trainer) {
  const index = Math.max(
    TRAINERS.findIndex((item) => item.id === trainer.id),
    0
  );
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
  const index = Math.max(
    TRAINERS.findIndex((item) => item.id === trainer.id),
    0
  );
  const options = [
    'Usually responds within 1 hour',
    'Usually responds within 2 hours',
    'Usually responds within 30 minutes',
    'Usually responds the same day',
  ];
  return options[index % options.length];
}

export const TRAINERS = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    role: 'Strength & Conditioning Coach',
    image: IMAGES.maya,
    rating: 4.98,
    reviewCount: 127,
    price: 1500,
    distance: 1.4,
    neighborhood: 'Zoo Road',
    experience: 8,
    clients: 240,
    sessions: 1240,
    verified: true,
    availableToday: true,
    nextAvailable: 'Today · 5:30 PM',
    categories: ['strength', 'hiit'],
    tags: ['Strength', 'Conditioning', 'Fat loss'],
    bio: 'Maya builds strength that carries into everyday life. Her sessions blend compound lifts, smart conditioning, and mobility so you leave feeling capable — not crushed.',
    certifications: [
      'NASM Certified Personal Trainer',
      'Precision Nutrition Level 1',
      'Functional Range Conditioning',
    ],
    reviews: makeReviews(0),
  },
  {
    id: 'marcus-reed',
    name: 'Marcus Reed',
    role: 'HIIT & Conditioning Coach',
    image: IMAGES.marcus,
    rating: 4.92,
    reviewCount: 98,
    price: 1200,
    distance: 2.8,
    neighborhood: 'GS Road',
    experience: 6,
    clients: 180,
    sessions: 980,
    verified: true,
    availableToday: true,
    nextAvailable: 'Today · 6:00 PM',
    categories: ['hiit', 'cardio'],
    tags: ['HIIT', 'Battle ropes', 'Endurance'],
    bio: 'Marcus is the coach you call when you want to move better and breathe harder. Expect short, sharp intervals, plenty of encouragement, and a plan that progresses every week.',
    certifications: [
      'ACE Certified Personal Trainer',
      'TRX Suspension Training',
      'CPR / AED',
    ],
    reviews: makeReviews(1),
  },
  {
    id: 'sofia-alvarez',
    name: 'Sofia Alvarez',
    role: 'Yoga & Mobility Coach',
    image: IMAGES.sofia,
    rating: 4.99,
    reviewCount: 203,
    price: 1100,
    distance: 0.9,
    neighborhood: 'Six Mile',
    experience: 10,
    clients: 310,
    sessions: 1680,
    verified: true,
    availableToday: true,
    nextAvailable: 'Today · 7:00 PM',
    categories: ['yoga', 'mobility'],
    tags: ['Vinyasa', 'Mobility', 'Breathwork'],
    bio: 'Sofia makes yoga feel less like a performance and more like a homecoming. Her classes are slow, intentional, and built around the way your body actually moves.',
    certifications: [
      'RYT-500 Yoga Alliance',
      'Mobility Coach Certification',
      'Trauma-Informed Movement',
    ],
    reviews: makeReviews(2),
  },
  {
    id: 'jordan-ellis',
    name: 'Jordan Ellis',
    role: 'Pilates & Core Coach',
    image: IMAGES.jordan,
    rating: 4.9,
    reviewCount: 84,
    price: 950,
    distance: 2.2,
    neighborhood: 'Beltola',
    experience: 5,
    clients: 140,
    sessions: 720,
    verified: true,
    availableToday: false,
    nextAvailable: 'Tomorrow · 9:00 AM',
    categories: ['pilates', 'mobility'],
    tags: ['Mat Pilates', 'Core', 'Postnatal'],
    bio: 'Jordan brings precision and warmth to every session. Whether you are rebuilding after injury or chasing a stronger core, she meets you exactly where you are.',
    certifications: [
      'Balanced Body Mat Pilates',
      'Pre/Postnatal Coach',
      'NASM Certified Personal Trainer',
    ],
    reviews: makeReviews(3),
  },
  {
    id: 'elena-petrova',
    name: 'Elena Petrova',
    role: 'Powerlifting & Strength Coach',
    image: IMAGES.elena,
    rating: 4.96,
    reviewCount: 156,
    price: 1800,
    distance: 4.6,
    neighborhood: 'Dispur',
    experience: 9,
    clients: 210,
    sessions: 1320,
    verified: true,
    availableToday: true,
    nextAvailable: 'Today · 4:00 PM',
    categories: ['strength'],
    tags: ['Powerlifting', 'Technique', 'Squat'],
    bio: 'Elena coaches the big lifts with patience and precision. Her approach is simple: earn trust under the bar, then add weight — never the other way around.',
    certifications: [
      'USAPL Club Coach',
      'NSCA-CSCS',
      'Barbell Rehab Method',
    ],
    reviews: makeReviews(4),
  },
  {
    id: 'andre-thompson',
    name: 'Andre Thompson',
    role: 'Boxing & Conditioning Coach',
    image: IMAGES.andre,
    rating: 4.95,
    reviewCount: 142,
    price: 1300,
    distance: 3.2,
    neighborhood: 'Uzan Bazar',
    experience: 12,
    clients: 280,
    sessions: 1520,
    verified: true,
    availableToday: true,
    nextAvailable: 'Today · 6:30 PM',
    categories: ['boxing', 'cardio'],
    tags: ['Boxing', 'Footwork', 'Conditioning'],
    bio: 'Andre blends old-school boxing fundamentals with modern conditioning. No ego, no guesswork — just clean technique, sharper footwork, and a better engine.',
    certifications: [
      'USA Boxing Certified Coach',
      'ACE Certified Personal Trainer',
      'First Aid / CPR',
    ],
    reviews: makeReviews(5),
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'Group Fitness & Dance Cardio Coach',
    image: IMAGES.priya,
    rating: 4.88,
    reviewCount: 76,
    price: 800,
    distance: 6.1,
    neighborhood: 'Khanapara',
    experience: 4,
    clients: 95,
    sessions: 410,
    verified: false,
    availableToday: true,
    nextAvailable: 'Today · 5:00 PM',
    categories: ['cardio', 'hiit'],
    tags: ['Dance cardio', 'Small group', 'Energy'],
    bio: 'Priya turned her love of music into a workout people actually look forward to. Expect big playlists, simple choreography, and a room full of good energy.',
    certifications: [
      'AFAA Group Fitness Instructor',
      'Zumba Licensed Instructor',
      'CPR / AED',
    ],
    reviews: makeReviews(6),
  },
  {
    id: 'lena-moretti',
    name: 'Lena Moretti',
    role: 'Calisthenics & Strength Coach',
    image: IMAGES.lena,
    rating: 4.97,
    reviewCount: 111,
    price: 1150,
    distance: 2.5,
    neighborhood: 'Pan Bazaar',
    experience: 7,
    clients: 160,
    sessions: 890,
    verified: true,
    availableToday: false,
    nextAvailable: 'Tomorrow · 8:00 AM',
    categories: ['strength'],
    tags: ['Calisthenics', 'Pull-ups', 'Bodyweight'],
    bio: 'Lena teaches you to own your bodyweight. From your first pull-up to your first strict muscle-up, she breaks down the progressions and makes the work feel doable.',
    certifications: [
      'NSCA Certified Personal Trainer',
      'Calisthenics Level 2 Coach',
      'Mobility Specialist',
    ],
    reviews: makeReviews(7),
  },
  {
    id: 'noah-brooks',
    name: 'Noah Brooks',
    role: 'Hypertrophy & Strength Coach',
    image: IMAGES.noah,
    rating: 4.93,
    reviewCount: 87,
    price: 1250,
    distance: 3.8,
    neighborhood: 'Chandmari',
    experience: 6,
    clients: 190,
    sessions: 1040,
    verified: true,
    availableToday: true,
    nextAvailable: 'Today · 3:00 PM',
    categories: ['strength'],
    tags: ['Muscle gain', 'Hypertrophy', 'Nutrition'],
    bio: 'Noah is a straight-talking coach for anyone who wants to add size without losing the plot. Progressive overload, honest feedback, and a program you can stick to.',
    certifications: [
      'NASM Certified Personal Trainer',
      'Precision Nutrition Level 1',
      'USAPL Coaching',
    ],
    reviews: makeReviews(0),
  },
  {
    id: 'nadia-cole',
    name: 'Nadia Cole',
    role: 'Olympic Lifting Coach',
    image: IMAGES.nadia,
    rating: 4.99,
    reviewCount: 74,
    price: 2000,
    distance: 3.9,
    neighborhood: 'Uzan Bazar',
    experience: 11,
    clients: 130,
    sessions: 760,
    verified: true,
    availableToday: false,
    nextAvailable: 'Tomorrow · 10:00 AM',
    categories: ['strength'],
    tags: ['Olympic lifts', 'Snatch', 'Clean & jerk'],
    bio: 'Nadia has spent over a decade under the bar — and beside it. Her technical eye and calm coaching style make heavy lifts feel like a puzzle worth solving.',
    certifications: [
      'USAW Level 2 Sports Performance Coach',
      'NSCA-CSCS',
      'Functional Movement Screen',
    ],
    reviews: makeReviews(1),
  },
];

export function getTrainerById(id) {
  return TRAINERS.find((trainer) => trainer.id === id);
}

export function getCategoryLabel(categoryId) {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  return category ? category.label : 'All';
}
