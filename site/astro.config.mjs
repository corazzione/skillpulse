import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://corazzione.github.io',
  base: '/skillpulse',
  integrations: [tailwind(), sitemap()],
  output: 'static',
});
