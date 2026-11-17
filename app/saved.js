import { buildMetadata } from '@/utils/metadata';

import SavedScreen from '@/screens/SavedScreen';

export function generateMetadata() {
  return buildMetadata(
    'Saved trainers',
    'Your shortlist of vetted personal trainers on instafit.'
  );
}

export default function SavedRoute() {
  return <SavedScreen />;
}
