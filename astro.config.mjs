import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canonical URLs always point at production. staging.coverd.ch is kept out of search
  // engines by its password gate and the X-Robots-Tag header set in Apache.
  site: 'https://coverd.ch',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'de', locales: { de: 'de-CH', en: 'en' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
