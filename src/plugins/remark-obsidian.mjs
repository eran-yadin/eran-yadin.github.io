/**
 * remark plugin: makes Obsidian-flavoured Markdown work as-is.
 *
 *   [[Some Post]]              -> link to that post (matched by title or file name, any collection)
 *   [[Some Post|shown text]]   -> same, custom text
 *   [[Some Post#Heading]]      -> same, with #heading anchor
 *   [[projects/foo]]           -> explicit collection
 *   ![[image.png]]             -> <img src="./image.png"> — if the file isn't next to the .md,
 *                                 ./attachments/image.png is tried (Obsidian's attachment folder)
 *   ![[image.png|422]]         -> Obsidian size spec (|W or |WxH) becomes width/height, not alt text
 *
 * Math nodes ($…$ / $$…$$, parsed by remark-math) get invisible unicode stripped so KaTeX
 * doesn't choke on characters Obsidian lets through (zero-width space, unicode minus).
 *
 * Unresolved links fall back to /posts/<slug>/ so a build never breaks on a dangling link.
 * Callouts (> [!note]) are handled separately by rehype-callouts.
 */
import fs from 'node:fs';
import path from 'node:path';

const WIKI = /(!?)\[\[([^\]|#]+?)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const SIZE_SPEC = /^\d+(?:x\d+)?$/;
const CONTENT_DIR = path.resolve('src/content');
const COLLECTIONS = ['posts', 'projects'];

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
      // Later collections never override an earlier one (posts win over projects on a clash).
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
  } else href = `/posts/${slugify(t)}/`;
  return heading ? `${href}#${slugify(heading)}` : href;
}

function displayText(target, heading, alias) {
  if (alias) return alias;
  const entry = lookup(target);
  const base = entry ? entry.title : target.trim().replace(/^.*\//, '');
  return heading ? `${base} › ${heading.trim()}` : base;
}

function imageNode(target, alias, dir) {
  const file = target.trim();
  // Obsidian's |422 / |600x400 size specs (possibly several segments) vs a real alt text
  let width, height;
  const altParts = [];
  for (const part of (alias ?? '').split('|')) {
    const p = part.trim();
    if (!p) continue;
    if (SIZE_SPEC.test(p)) {
      if (width === undefined) [width, height] = p.split('x');
    } else altParts.push(p);
  }
  let rel = file;
  if (!rel.startsWith('.') && !rel.startsWith('/')) {
    // Obsidian resolves attachments vault-wide; we try next to the .md, then ./attachments/
    if (dir && !fs.existsSync(path.join(dir, rel)) && fs.existsSync(path.join(dir, 'attachments', rel))) {
      rel = `attachments/${rel}`;
    }
    rel = `./${rel}`;
  }
  const node = {
    type: 'image',
    url: rel,
    alt: altParts.join(' ') || file.replace(/^.*\//, '').replace(IMAGE_EXT, ''),
  };
  if (width) node.data = { hProperties: { width, ...(height ? { height } : {}) } };
  return node;
}

/* ---------- AST transform ---------- */
function splitText(node, dir) {
  const out = [];
  let last = 0;
  const text = node.value;
  for (const m of text.matchAll(WIKI)) {
    const [full, bang, target, heading, alias] = m;
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    if (bang === '!' && IMAGE_EXT.test(target.trim())) {
      out.push(imageNode(target, alias, dir));
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

function walk(node, dir) {
  if (node.type === 'math' || node.type === 'inlineMath') {
    // strip characters KaTeX rejects: zero-width space/joiner/BOM; unicode minus -> ASCII
    node.value = node.value.replace(/[​‌‍﻿]/g, '').replace(/−/g, '-');
    return;
  }
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    WIKI.lastIndex = 0;
    if (child.type === 'text' && WIKI.test(child.value)) {
      WIKI.lastIndex = 0;
      next.push(...splitText(child, dir));
    } else {
      if (child.type !== 'code' && child.type !== 'inlineCode') walk(child, dir);
      next.push(child);
    }
  }
  node.children = next;
}

export default function remarkObsidian() {
  index = null; // rebuild the index on each (re)start so new files are picked up
  return (tree, file) => {
    const dir = file?.path ? path.dirname(file.path) : null;
    walk(tree, dir);
  };
}
