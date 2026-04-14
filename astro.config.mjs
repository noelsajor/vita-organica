import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://vita-organica.com', // Replace with actual production URL
    integrations: [react(), sitemap()],
    output: 'static',
});