import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, tended, titleFromId } from '../lib/content';
import { SITE } from '../site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name} — posts`,
    description: SITE.description,
    site: context.site!,
    items: posts.map((n) => ({
      title: n.data.title ?? titleFromId(n.id),
      description: n.data.description,
      pubDate: tended(n),
      link: `/posts/${n.id}/`,
      categories: n.data.tags,
    })),
  });
}
