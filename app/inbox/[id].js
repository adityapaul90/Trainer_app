import { buildMetadata } from '@/utils/metadata';

import ChatScreen from '@/screens/ChatScreen';

export function generateMetadata() {
  return buildMetadata(
    'Conversation',
    'Message your instafit coach about goals, schedules, and session plans.'
  );
}

export default function ChatRoute() {
  return <ChatScreen />;
}
