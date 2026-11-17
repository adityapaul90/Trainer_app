import { buildMetadata } from '@/utils/metadata';

import HomeScreen from '@/screens/HomeScreen';

export function generateMetadata() {
  return buildMetadata();
}

export default function HomeRoute() {
  return <HomeScreen />;
}
