/**
 * remark plugin: makes Obsidian-flavoured Markdown work as-is.
 *
 *   [[Some Note]]              -> link to that note (matched by title or file name, any collection)
 *   [[Some Note|shown text]]   -> same, custom text
 *   [[Some Note#Heading]]      -> same, with #heading anchor
 *   [[projects/foo]]           -> explicit collection
 *   ![[image.png]]             -> <img src="./image.png">   (file next to the .md, or in attachments/)
 *   ![[attachments/a.png]]     -> <img src="./attachments/a.png">
 *
 * Unresolved links fall back to /notes/<slug>/ so a build never breaks on a dangling link.
 * Callouts (> [!note]) are handled separately by rehype-callouts.
 */
import fs from 'node:fs';
import path from 'node:path';

const WIKI = /(!?)\[\[([^\]|#]+?)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const CONTENT_DIR = path.resolve('src/content');
const COLLECTIONS = ['notes', 'projects'];

export function slugify(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\.md$/, '')
    .replace(/[^a-z0-9֐-׿/]+/g, '-') // keep Hebrew letters and path slashes
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/* ---------- content index: title / file-slug -> { href, title } ---------- */
let index = null;

function readTitle(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const t = m && m[1].match(/^title:\s*(.+?)\s*$/m);
  return t ? t[1].replace(/^["']|["']$/g, '') : null;
}

function walkDir(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(p, out);
    else if (e.name.endsWith('.md') && !e.name.startsWith('_')) out.push(p);
  }
  return out;
}

export function buildIndex() {
  const byKey = new Map(); // key -> { href, title }
  for (const col of COLLECTIONS) {
    const base = path.join(CONTENT_DIR, col);
    for (const file of walkDir(base)) {
      const rel = path.relative(base, file).replace(/\\/g, '/').replace(/\.md$/, '');
      const id = rel.split('/').map(slugify).join('/');
      const title = readTitle(file) ?? path.basename(rel).replace(/[-_]+/g, ' ').replace(/^./, (c) => c.toUpperCase());
      const entry = { href: `/${col}/${id}/`, title };
      // Later collections never override an earlier one (notes win over projects on a clash).
      for (const key of [`${col}/${id}`, id, slugify(title), title.toLowerCase()]) {
        if (!byKey.has(key)) byKey.set(key, entry);
      }
    }
  }
  return byKey;
}

function lookup(target) {
  if (!index) index = buildIndex();
  const t = target.trim();
  return index.get(t.toLowerCase()) ?? index.get(slugify(t)) ?? null;
}

/** Resolve a wikilink target to a site path (also used for backlinks). */
export function resolveLink(target, heading) {
  const t = target.trim();
  let entry = lookup(t);
  let href;
  if (entry) href = entry.href;
  else if (t.startsWith('/')) href = t;
  else if (t.includes('/')) {
    const [dir, ...rest] = t.split('/');
    href = `/${slugify(dir)}/${slugify(rest.join('/'))}/`;
  } else href = `/notes/${slugify(t)}/`;
  return heading ? `${href}#${slugify(heading)}` : href;
}

function displayText(target, heading, alias) {
  if (alias) return alias;
  const entry = lookup(target);
  const base = entry ? entry.title : target.trim().replace(/^.*\//, '');
  return heading ? `${base} › ${heading.trim()}` : base;
}

/* ---------- AST transform ---------- */
function splitText(node) {
  const out = [];
  let last = 0;
  const text = node.value;
  for (const m of text.matchAll(WIKI)) {
    const [full, bang, target, heading, alias] = m;
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    if (bang === '!' && IMAGE_EXT.test(target.trim())) {
      const file = target.trim();
      const url = file.startsWith('.') || file.startsWith('/') ? file : `./${file}`;
      out.push({ type: 'image', url, alt: alias ?? file.replace(/^.*\//, '').replace(IMAGE_EXT, '') });
    } else {
      out.push({
        type: 'link',
        url: resolveLink(target, heading),
        children: [{ type: 'text', value: displayText(target, heading, alias) }],
      });
    }
    last = m.index + full.length;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

function walk(node) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    WIKI.lastIndex = 0;
    if (child.type === 'text' && WIKI.test(child.value)) {
      WIKI.lastIndex = 0;
      next.push(...splitText(child));
    } else {
      if (child.type !== 'code' && child.type !== 'inlineCode') walk(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function remarkObsidian() {
  index = null; // rebuild the index on each (re)start so new files are picked up
  return (tree) => walk(tree);
}
