import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://vitaorganica.com', // Replace with production URL
  output: 'hybrid', // SSG by default, SSR for specific routes if needed
  adapter: vercel(),
  integrations: [sitemap()],
});