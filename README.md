# eran-yadin.github.io

Personal site — projects and posts. Built with [Astro](https://astro.build), written in Markdown
(Obsidian-flavoured), deployed to GitHub Pages on every push to `main`.

Live: <https://eran-yadin.github.io>

## Day-to-day

| I want to… | Do this |
|---|---|
| Add a project | Copy `src/content/projects/_template.md` → `my-project.md`, fill in, remove `draft: true` |
| Add a post | Copy `src/content/posts/_template.md` → `my-post.md`, fill in, remove `draft: true` |
| Paste a post from Obsidian | Drop the `.md` in `src/content/posts/` and add the frontmatter fields (`title`, `date`); put its images next to it or in an `attachments/` folder there |
| Publish | `git add -A && git commit -m "…" && git push` — live in ~1 minute |
| Preview locally | `npm run dev` → <http://localhost:4321> (drafts are visible here, hidden in production) |
| Check the build | `npm run build` (fails loudly on bad frontmatter or a missing image) |

File name = URL: `src/content/posts/my-post.md` → `/posts/my-post/`.

### Obsidian syntax that works unchanged

- `[[Post title]]`, `[[Post title|alias]]`, `[[Post title#Heading]]` → `/posts/post-title/`
- `[[projects/fourier-lab]]` → `/projects/fourier-lab/`
- `![[image.png]]`, `![[attachments/image.png]]` → optimized `<img>`
- `> [!note] Title` callouts (all Obsidian types)
- Tables, task lists, footnotes, code fences with syntax highlighting

Backlinks ("Linked from") are computed at build time from these links.

### Frontmatter

**Posts:** `title` (optional — file name is used if missing), `date` (published), `updated`, `description`, `tags`, `draft`.

**Projects:** `title`, `description`, `date`, `tags`, `status` (`research` | `active` | `done` | `archived`), `repo`, `link`, `cover`, `featured`, `draft`.

## Layout

```
src/
  content/posts/      one .md per post      (+ _template.md)
  content/projects/   one .md per project   (+ _template.md)
  content.config.ts   frontmatter schemas
  pages/              routes (index, projects, posts, tags, about, rss.xml, 404)
  layouts/Base.astro  the single shared layout (header / nav / footer / theme)
  components/         cards, list items, backlinks
  plugins/remark-obsidian.mjs   wikilinks + embeds
  styles/global.css   design tokens and all styling
  site.ts             site name, nav, links
public/               goose.png, favicons
.github/workflows/deploy.yml   GitHub Pages deploy
```

## Commands

```
npm install      # once
npm run dev      # dev server with live reload
npm run build    # static build into dist/
npm run preview  # serve dist/ locally
```
