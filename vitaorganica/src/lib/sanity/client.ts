import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID || 'placeholder',
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: import.meta.env.SANITY_API_VERSION || '2023-05-03',
  useCdn: import.meta.env.SANITY_USE_CDN === 'true',
});

export const isSanityConfigured = !!import.meta.env.SANITY_PROJECT_ID;