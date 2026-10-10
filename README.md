---
type: Project Overview
title: Hiragana Aero
description: Desktop-first local-first Japanese hiragana learning game with capability modules and specification-driven development.
---
# Hiragana Aero

Hiragana Aero is a small **local-first Desktop** game for learning the 46 basic Japanese hiragana characters. Its visual direction is Frutiger Aero and optimistic early-2000s desktop games: glossy chrome, glass panels, bright skies, rounded controls, and a friendly world map. The UI styling uses CSS; no online image or font service is required.

This repository follows the documentation/specification and source-of-truth model of **Another Boring Note**, but does not reuse its Kotlin implementation.

## Initial playable prototype

- Ten ordered worlds, grouped by conventional basic hiragana rows (five characters in most worlds; three in the Y and final W/N rows).
- Study cards reveal each character's romaji reading.
- One multiple-choice recognition challenge per world; all its characters appear once.
- Four options per question and a pass threshold of **80%**.
- Sequential unlocking, highest score, and local persistence across Desktop restarts.
- All learning content bundled in the application. No account, ads, or backend.

The current focus is [`docs/specs/active/subspecs/playable-level-loop.md`](docs/specs/active/subspecs/playable-level-loop.md). The first implementation exists, but the native Electron UI and packaging still require execution/acceptance on a Desktop host.

## Architecture

```text
content             -> (no internal dependencies)
learning            -> content
progress            -> content, learning
shared              -> content, learning, progress
Desktop host        -> local data files through a narrow preload API
```

`content/` owns learning data, `learning/` owns quiz/game rules, `progress/` owns saved progression semantics, `shared/` owns HTML/CSS and screen coordination, and `desktopApp/` owns Electron lifecycle and filesystem persistence. Domain modules must never import Electron, DOM, Node.js, or other platform APIs.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), and capability `contract.md` files.

## Quick start

Requirements: Node.js 22+, npm, Electron-compatible macOS/Windows/Linux Desktop, and Internet access **only for the initial `npm install`**.

```bash
npm install
npm run dev
```

Offline browser preview is possible after compiling TypeScript:

```bash
npm run build
python3 -m http.server 5173
```

Then open `http://localhost:5173/`. The browser preview uses separate browser-local storage; only Electron uses the Desktop application data file.

```bash
./run_checks.sh
./archive.sh
./concat.sh
```

Read [`docs/INSTALLATION.md`](docs/INSTALLATION.md), [`docs/TESTS.md`](docs/TESTS.md), and [`docs/specs/README.md`](docs/specs/README.md) before working on a change.
