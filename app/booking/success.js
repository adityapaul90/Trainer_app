import { buildMetadata } from '@/utils/metadata';

import BookingSuccessScreen from '@/screens/BookingSuccessScreen';

export function generateMetadata() {
  return buildMetadata(
    'Booking confirmed',
    'Your personal training session is locked in. Review the details and get ready to train.'
  );
}

export default function BookingSuccessRoute() {
  return <BookingSuccessScreen />;
}
