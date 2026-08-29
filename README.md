# eran-yadin.github.io

Personal site — projects and notes. Built with [Astro](https://astro.build), written in Markdown
(Obsidian-flavoured), deployed to GitHub Pages on every push to `main`.

Live: <https://eran-yadin.github.io>

## Day-to-day

| I want to… | Do this |
|---|---|
| Add a project | Copy `src/content/projects/_template.md` → `my-project.md`, fill in, remove `draft: true` |
| Add a note | Copy `src/content/notes/_template.md` → `my-note.md`, fill in, remove `draft: true` |
| Paste a note from Obsidian | Drop the `.md` in `src/content/notes/` and add the frontmatter fields (`title`, `date`); put its images next to it or in an `attachments/` folder there |
| Publish | `git add -A && git commit -m "…" && git push` — live in ~1 minute |
| Preview locally | `npm run dev` → <http://localhost:4321> (drafts are visible here, hidden in production) |
| Check the build | `npm run build` (fails loudly on bad frontmatter or a missing image) |

File name = URL: `src/content/notes/my-note.md` → `/notes/my-note/`.

### Obsidian syntax that works unchanged

- `[[Note title]]`, `[[Note title|alias]]`, `[[Note title#Heading]]` → `/notes/note-title/`
- `[[projects/fourier-lab]]` → `/projects/fourier-lab/`
- `![[image.png]]`, `![[attachments/image.png]]` → optimized `<img>`
- `> [!note] Title` callouts (all Obsidian types)
- Tables, task lists, footnotes, code fences with syntax highlighting

Backlinks ("Linked from") are computed at build time from these links.

### Frontmatter

**Notes:** `title`, `date` (planted), `updated` (last tended), `description`, `tags`, `stage` (`seedling` | `budding` | `evergreen`), `draft`.

**Projects:** `title`, `description`, `date`, `tags`, `status` (`research` | `active` | `done` | `archived`), `repo`, `link`, `cover`, `featured`, `draft`.

## Layout

```
src/
  content/notes/      one .md per note      (+ _template.md)
  content/projects/   one .md per project   (+ _template.md)
  content.config.ts   frontmatter schemas
  pages/              routes (index, projects, notes, tags, about, rss.xml, 404)
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
