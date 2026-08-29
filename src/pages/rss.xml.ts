import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getNotes, tended, titleFromId } from '../lib/content';
import { SITE } from '../site';

export async function GET(context: APIContext) {
  const notes = await getNotes();
  return rss({
    title: `${SITE.name} — notes`,
    description: SITE.description,
    site: context.site!,
    items: notes.map((n) => ({
      title: n.data.title ?? titleFromId(n.id),
      description: n.data.description,
      pubDate: tended(n),
      link: `/notes/${n.id}/`,
      categories: n.data.tags,
    })),
  });
}
