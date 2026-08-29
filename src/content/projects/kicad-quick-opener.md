---
title: KiCad Quick Opener
description: A zero-dependency Flow Launcher plugin that finds and opens KiCad projects, PCBs and schematics straight from the keyboard.
date: 2026-03-14
tags: [python, kicad, tool, flow-launcher, windows]
status: done
repo: https://github.com/eran-yadin/KiCadQuickOpener
featured: true
---

I open a lot of KiCad projects. Digging through folders for the right `.kicad_pro` every time was slow, so
this plugin for [Flow Launcher](https://www.flowlauncher.com/) makes it a keystroke: type a keyword, get a
list of matching projects, hit Enter.

## Features

- **Fast** — built-in Python only; no external dependencies or SDKs.
- **Smart search** — finds `.kicad_pro` files across your project directories by keyword.
- **Drill-down** — <kbd>Shift</kbd>+<kbd>Enter</kbd> on a project reveals its layouts (`.kicad_pcb`),
  schematics (`.kicad_sch` / `.sch`), or opens the project folder in Explorer.

## Installation

1. In Flow Launcher type `open settings folder`, then go to `Plugins`.
2. Clone or download the repository into a new folder named `KiCadQuickOpener`.
3. Open `main.py` and point `SEARCH_DIR` at your KiCad projects folder.
4. Restart Flow Launcher.

Licensed under Apache 2.0.
