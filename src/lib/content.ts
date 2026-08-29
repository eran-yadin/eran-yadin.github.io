import { getCollection, type CollectionEntry } from 'astro:content';
import { resolveLink } from '../plugins/remark-obsidian.mjs';

export type Note = CollectionEntry<'notes'>;
export type Project = CollectionEntry<'projects'>;
export type Entry = Note | Project;

const showDrafts = import.meta.env.DEV; // drafts are visible in `npm run dev`, never in the build

export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', (e) => showDrafts || !e.data.draft);
  for (const n of notes) n.data.title ??= titleFromId(n.id);
  return notes.sort((a, b) => tended(b).valueOf() - tended(a).valueOf());
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', (e) => showDrafts || !e.data.draft);
  return projects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** "my-first-note" -> "My first note" (used when a note has no title: field). */
export function titleFromId(id: string): string {
  const last = id.split('/').pop() ?? id;
  const words = last.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function tended(n: Note): Date {
  return n.data.updated ?? n.data.date;
}

export function hrefOf(e: Entry): string {
  return `/${e.collection}/${e.id}/`;
}

export function stageIcon(stage?: 'seedling' | 'budding' | 'evergreen'): string {
  return stage === 'evergreen' ? '🌳' : stage === 'budding' ? '🌿' : stage === 'seedling' ? '🌱' : '';
}

/** All tags across notes and projects, with counts. */
export async function getTags(): Promise<Map<string, number>> {
  const all: Entry[] = [...(await getNotes()), ...(await getProjects())];
  const m = new Map<string, number>();
  for (const e of all) for (const t of e.data.tags) m.set(t, (m.get(t) ?? 0) + 1);
  return new Map([...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

const WIKI = /\[\[([^\]|#]+?)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;
const MD_LINK = /\]\((\/(?:notes|projects)\/[^)#\s]+?)\/?(?:#[^)]*)?\)/g;

/**
 * Backlinks: for every page, which other pages link to it.
 * Computed from [[wikilinks]] and plain markdown links in the bodies.
 */
export async function getBacklinks(): Promise<Map<string, Entry[]>> {
  const all: Entry[] = [...(await getNotes()), ...(await getProjects())];
  const map = new Map<string, Entry[]>();
  for (const src of all) {
    const body = src.body ?? '';
    const targets = new Set<string>();
    for (const m of body.matchAll(WIKI)) targets.add(resolveLink(m[1]));
    for (const m of body.matchAll(MD_LINK)) targets.add(m[1].replace(/\/?$/, '/'));
    for (const t of targets) {
      if (t === hrefOf(src)) continue;
      const list = map.get(t) ?? [];
      if (!list.includes(src)) list.push(src);
      map.set(t, list);
    }
  }
  return map;
}
