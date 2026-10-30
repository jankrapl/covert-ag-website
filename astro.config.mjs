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
    // Language pairs are declared as hreflang on each page: the sitemap's own i18n option only pairs
    // identical slugs, and ours differ per language.
    sitemap({ filter: (page) => !page.includes('/404') }),
  ],
});
