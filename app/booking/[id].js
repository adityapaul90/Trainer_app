import { getTrainerById } from '@/data/trainers';
import { buildMetadata } from '@/utils/metadata';

import BookingScreen from '@/screens/BookingScreen';

export function generateMetadata(request, params) {
  const rawId = params ? params.id : undefined;
  const trainer = getTrainerById(Array.isArray(rawId) ? rawId[0] : rawId);

  return buildMetadata(
    trainer ? `Book with ${trainer.name}` : 'Book a session',
    'Choose your session type, duration, date, and time. Free rescheduling up to 12 hours before your session.'
  );
}

export default function BookingRoute() {
  return <BookingScreen />;
}
