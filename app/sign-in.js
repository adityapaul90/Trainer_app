import { buildMetadata } from '@/utils/metadata';

import SignInScreen from '@/screens/SignInScreen';

export function generateMetadata() {
  return buildMetadata('Sign in', 'Sign in to your instafit account.');
}

export default function SignInRoute() {
  return <SignInScreen />;
}
