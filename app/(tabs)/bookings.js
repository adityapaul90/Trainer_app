import { buildMetadata } from '@/utils/metadata';

import BookingsScreen from '@/screens/BookingsScreen';

export function generateMetadata() {
  return buildMetadata(
    'My bookings',
    'See your upcoming personal training sessions, training history, and free cancellation window.'
  );
}

export default function BookingsRoute() {
  return <BookingsScreen />;
}
