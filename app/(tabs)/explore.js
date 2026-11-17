import { buildMetadata } from '@/utils/metadata';

import ExploreScreen from '@/screens/ExploreScreen';

export function generateMetadata() {
  return buildMetadata(
    'Explore trainers',
    'Browse 10 vetted strength, HIIT, yoga, boxing, and mobility coaches across Guwahati. Filter by price, rating, and availability.'
  );
}

export default function ExploreRoute() {
  return <ExploreScreen />;
}
