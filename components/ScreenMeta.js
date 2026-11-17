import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { DEFAULT_DESCRIPTION, buildMetadata } from '@/utils/metadata';

function setMetaTag(attribute, key, content) {
  if (typeof document === 'undefined') return;

  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

/**
 * Keeps the document title and social metadata in sync with the focused
 * route on web. Server-rendered titles come from each route's
 * `generateMetadata` export; this covers client-side navigation.
 */
export function ScreenMeta({ title, description = DEFAULT_DESCRIPTION }) {
  const isFocused = useIsFocused();
  const metadata = buildMetadata(title, description);

  useEffect(() => {
    if (
      Platform.OS !== 'web' ||
      !isFocused ||
      typeof document === 'undefined'
    ) {
      return;
    }

    document.title = metadata.title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', metadata.title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('name', 'twitter:title', metadata.title);
    setMetaTag('name', 'twitter:description', description);
  }, [description, isFocused, metadata.title]);

  return null;
}
