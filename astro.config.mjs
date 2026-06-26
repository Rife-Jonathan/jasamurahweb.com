import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const buildDate = new Date().toISOString().split('T')[0];

export default defineConfig({
  site: 'https://www.jasamurahweb.com',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const url = item.url;
        if (url === 'https://www.jasamurahweb.com/') {
          return { ...item, lastmod: buildDate, changefreq: 'weekly', priority: 1.0 };
        }
        if (
          url === 'https://www.jasamurahweb.com/blog/' ||
          url === 'https://www.jasamurahweb.com/services/' ||
          url === 'https://www.jasamurahweb.com/area-layanan/'
        ) {
          return { ...item, lastmod: buildDate, changefreq: 'weekly', priority: 0.9 };
        }
        if (url.match(/\/jasa-[^/]+\/?$/) && !url.includes('/blog/')) {
          return { ...item, lastmod: buildDate, changefreq: 'monthly', priority: 0.8 };
        }
        if (url.includes('/blog/')) {
          return { ...item, lastmod: buildDate, changefreq: 'monthly', priority: 0.7 };
        }
        return { ...item, lastmod: buildDate, changefreq: 'yearly', priority: 0.5 };
      },
    }),
  ],
});
