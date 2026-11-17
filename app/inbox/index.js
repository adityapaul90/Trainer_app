import { buildMetadata } from '@/utils/metadata';

import InboxScreen from '@/screens/InboxScreen';

export function generateMetadata() {
  return buildMetadata(
    'Messages',
    'Talk to your coaches, share goals, and sort out session details on instafit.'
  );
}

export default function InboxRoute() {
  return <InboxScreen />;
}
