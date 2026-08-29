// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeCallouts from 'rehype-callouts';
import remarkObsidian from './src/plugins/remark-obsidian.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://eran-yadin.github.io',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // Obsidian flavour: [[wikilinks]], ![[embeds]], > [!note] callouts
    remarkPlugins: [remarkObsidian],
    rehypePlugins: [[rehypeCallouts, { theme: 'obsidian' }]],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
