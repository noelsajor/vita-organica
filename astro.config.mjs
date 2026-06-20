import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
    site: 'https://vita-organica.com',
    integrations: [react(), sitemap()],
    output: 'hybrid',
    adapter: vercel(),
});
