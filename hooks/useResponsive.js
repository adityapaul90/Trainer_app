import { useSyncExternalStore } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { layout } from '@/constants/theme';

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the hydration pass, then true on the client.
 * This keeps desktop-only chrome out of the server markup so React can
 * hydrate without a mismatch.
 */
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Shared web breakpoints. Desktop chrome only renders on web so native
 * tablets keep the touch-first tab bar.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const hydrated = useHydrated();
  const isDesktop =
    hydrated && Platform.OS === 'web' && width >= layout.desktopBreakpoint;

  return { width, height, isDesktop };
}
