// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { shouldIndex } from './src/lib/seo.mjs';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://ryu-koda.com',
	redirects: { '/youtube/': '/work/#youtube' },
	integrations: [mdx(), sitemap({ filter: (page) => shouldIndex(new URL(page).pathname) })],
});
