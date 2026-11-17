import { buildMetadata } from '@/utils/metadata';

import ProfileScreen from '@/screens/ProfileScreen';

export function generateMetadata() {
  return buildMetadata(
    'Your profile',
    'Track your training, weekly goal, saved coaches, and account settings on instafit.'
  );
}

export default function ProfileRoute() {
  return <ProfileScreen />;
}
