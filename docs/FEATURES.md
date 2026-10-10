---
type: Feature Catalog
title: Hiragana Aero stable feature IDs
description: Stable cross-specification vocabulary for MVP capabilities and extension seams.
---
# Feature catalog

Feature IDs name lasting capabilities, not implementation tasks or current statuses. Requirements and specifications use their own IDs. Status is owned by `ROADMAP.md`.

- `CONTENT.BASIC_HIRAGANA` — authoritative 46 basic hiragana entries with reading labels. Owner: `content`.
- `CONTENT.WORLD_MAP` — staged grouping and ordered world metadata. Owner: `content`.
- `LEARNING.STUDY_CARDS` — per-character introduction and reading reveal. Owner: `shared` using `content`.
- `LEARNING.RECOGNITION_QUIZ` — four-option kana-to-romaji question sessions. Owner: `learning`.
- `GAME.LEVEL_UNLOCKS` — sequential unlock/pass semantics. Owner: `learning`, persisted by `progress`.
- `GAME.SCORES` — best-score and completion result recording. Owner: `progress`.
- `STORAGE.LOCAL_PROGRESS` — offline progress persistence with versioned validation. Owner: `progress` and Desktop adapter.
- `PLATFORM.DESKTOP` — Electron application lifecycle, isolated filesystem bridge, Desktop controls. Owner: `desktopApp`.
- `UI.FRUTIGER_AERO` — visual styling, responsive Desktop layout, and reduced-motion support. Owner: `shared`.
- `TESTING.DETERMINISTIC_LOCAL` — repeatable game and repository validation without network services. Owner: repository.

Add new IDs only for distinct durable capabilities. Keep IDs stable even after their original implementation specs are archived.
