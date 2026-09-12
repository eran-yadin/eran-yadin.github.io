// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeCallouts from 'rehype-callouts';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import remarkObsidian from './src/plugins/remark-obsidian.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://eran-yadin.github.io',
  // The blog lived at /notes/ for the first two weeks — keep old links working.
  redirects: {
    '/notes': '/posts',
    '/notes/[id]': '/posts/[id]',
  },
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // Obsidian flavour: [[wikilinks]], ![[embeds]], > [!note] callouts
    // remark-breaks: a single newline renders as a line break, like in Obsidian
    remarkPlugins: [remarkObsidian, remarkMath, remarkBreaks],
    rehypePlugins: [
      [rehypeCallouts, { theme: 'obsidian' }],
      // throwOnError:false renders a bad formula in red instead of failing the build
      [rehypeKatex, { throwOnError: false, strict: false }],
    ],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
