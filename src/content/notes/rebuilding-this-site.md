---
title: Rebuilding this site
description: Why the first version got thrown away, and how the new one is set up so that writing in Obsidian is all it takes to publish.
date: 2026-08-29
tags: [meta, astro, obsidian]
stage: seedling
---

The first version of this site was a hand-written pile of HTML: every page had its own copy of the navigation,
every link was hardcoded to a folder on my old PC, and most of the pages were placeholders waiting for content
that never came. It was never even deployed. So instead of patching it, I threw it away and started over.

## What I wanted

- Write in **Obsidian**, where all my notes already live, and publish by copying a file — no rewriting into
  "web Markdown".
- A **projects** section that pulls its weight as a portfolio: [[projects/open-tractor-can]], [[projects/fourier-lab]]
  and the smaller tools.
- Notes that behave like a **garden**, not a feed: they get planted, tended and grow over time, and they link to each other.
- Nothing to maintain: no server, no database, no framework churn on the published pages.

## How it works now

The site is built with [Astro](https://astro.build) and hosted on GitHub Pages. Every project and note is a
Markdown file with a bit of frontmatter; a small plugin makes Obsidian's syntax work unchanged:

> [!tip] Obsidian features that just work
> `[[wikilinks]]` (with `|aliases` and `#headings`), `![[image.png]]` embeds, and `> [!note]` callouts like this one.
> Backlinks are computed at build time, so every page shows what links to it.

Pushing to `main` builds and deploys the site in about a minute. Adding a project is one file; adding a note is
one file. That is the whole workflow.

## Still to do

- [ ] Pull photos and diagrams into the project pages
- [ ] Write up the tractor CAN research as notes rather than a single README
- [ ] Decide whether the goose deserves its own page
