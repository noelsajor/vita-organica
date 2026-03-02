import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://vita-organica.com', // Replace with actual production URL
    integrations: [
        react(),
        sitemap({
            filter: (page) => {
                // Filter out blog slug pages if they are likely to be empty/broken due to missing Sanity config
                return !page.includes('/blog/') || page.endsWith('/blog/');
            }
        })
    ],
    output: 'static',
});