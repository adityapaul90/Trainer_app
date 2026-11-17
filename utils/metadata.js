const SITE_NAME = 'instafit.';

export const DEFAULT_TITLE = 'instafit. — Find your perfect trainer';

export const DEFAULT_DESCRIPTION =
  'Book vetted personal trainers for 1-on-1 sessions in Guwahati. Compare coaches, pick a time, and train on your terms.';

export function buildMetadata(title, description = DEFAULT_DESCRIPTION) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : DEFAULT_TITLE;

  return {
    title: fullTitle,
    description,
    applicationName: SITE_NAME,
    manifest: '/manifest.webmanifest',
    icons: {
      icon: '/favicon.png',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'instafit. — Find your perfect trainer.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/og-image.png'],
    },
  };
}
