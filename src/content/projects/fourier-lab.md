---
title: Fourier Lab
description: Type a function, get its transform and the graphs — CTFT, DTFT and Laplace, forward and inverse. A self-contained Python app with an optional "read the equation off a photo" panel.
date: 2026-07-12
tags: [python, dsp, signals, tool]
status: done
repo: https://github.com/eran-yadin/fourier_signal_app
featured: true
---

A small web app (runs locally at `localhost:8501`) for signals-and-systems work: you type an expression such
as `exp(-2*t)*u(t)`, pick a transform, and get the closed-form result plus magnitude and phase plots.

| | forward | inverse |
|---|---|---|
| **CTFT** | x(t) → X(ω): magnitude + phase spectrum | X(ω) → x(t) |
| **DTFT** | x[n] → X(e^jΩ): magnitude + phase | X(e^jΩ) → x[n] |
| **Laplace** | x(t) → X(s) with region of convergence | X(s) → x(t) |

## Setup

Needs Python 3.10+ and nothing else — `setup.bat` / `setup.sh` builds a private `.venv` inside the project
folder, `run.bat` / `run.sh` starts the app. There is also a `docker` branch: `docker compose up`, no Python needed.

## The "from a picture" panel

Optional: paste a screenshot or a photo of a handwritten equation and it gets transcribed into the input box.
Reading handwriting is a machine-learning problem, so this one panel calls a vision model (bring your own API
key). It does *only* the transcription — nothing is plotted or computed by the model, and it always shows what
it read and waits for confirmation before anything is evaluated.

> [!note]
> The core install has no AI dependency, no API key and no account. Without the optional panel it simply says it's off.

## Tests

`python tests.py` runs ten suites (~198 checks) covering the transforms, the parser and the plotting helpers.
