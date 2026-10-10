---
type: Implementation
title: Current implementation
description: Source layout and implementation status, without treating unverified Desktop behavior as accepted.
---
# Current implementation

## Source layout

- `content/src/kana.ts`: static list of ten worlds and 46 characters.
- `learning/src/game.ts`: pure quiz session creation, answer checks, percent scores, pass/unlock logic.
- `progress/src/progress.ts`: V1 progress parsing and monotonic result recording.
- `shared/src/main.ts`: level map, cards, challenge and results, with keyboard controls.
- `shared/src/style.css`: visual theme without downloaded/generated assets.
- `shared/src/persistence.ts`: native bridge call, plus browser-only preview fallback.
- `desktopApp/main.cjs`: local Electron window and serialized atomic file writes.
- `desktopApp/preload.cjs`: two-method secure bridge.
- `index.html`: offline entry point with CSP.

## Implemented in source

A playable ten-world loop, recognition tests, sequential unlocking, best score tracking and V1 save/load integration are implemented. The quiz uses an injected RNG seam and two explicit phases (answer followed by continue). Current gameplay is entirely kana-to-romaji; cards reveal the romaji reading.

## Not yet accepted or verified

The Electron app has not been launched in a native Desktop environment in this initial generated repository. Its production install/package/signing, macOS/Windows/Linux behavior, full manual keyboard/reader UX, filesystem behavior on a real machine, and visual polish need direct acceptance. No installers or compiled releases are included.

No audio, lesson narration, kana handwriting, spaced repetition, review queue, badges, katakana, localization, or cloud services are implemented. See `ROADMAP.md`.
