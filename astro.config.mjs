import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.jasamurahweb.com',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
});
