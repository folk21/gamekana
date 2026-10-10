---
type: Specification
title: Initial playable Hiragana Aero desktop product
description: MVP umbrella for offline learning and level-based progression.
document_role: umbrella
spec_status: active
current_focus: subspecs/playable-level-loop.md
---
# Initial playable Hiragana Aero desktop product

## Status

Active umbrella. The first implementation exists; native Desktop acceptance remains open. Current bounded focus: `subspecs/playable-level-loop.md`.

## Feature scope

- `CONTENT.BASIC_HIRAGANA`
- `CONTENT.WORLD_MAP`
- `LEARNING.STUDY_CARDS`
- `LEARNING.RECOGNITION_QUIZ`
- `GAME.LEVEL_UNLOCKS`
- `GAME.SCORES`
- `STORAGE.LOCAL_PROGRESS`
- `PLATFORM.DESKTOP`
- `UI.FRUTIGER_AERO`
- `TESTING.DETERMINISTIC_LOCAL`

## Goal

Deliver an encouraging, nostalgic, standalone desktop game that can teach recognition of all basic hiragana. Users begin immediately, understand what to do without setup, unlock worlds by demonstrating recall, and continue after restart without a remote account.

## Requirement map

| ID | Features | Requirement |
|---|---|---|
| MVP-R1 | `PLATFORM.DESKTOP` | Desktop-first local-only experience |
| MVP-R2 | `CONTENT.BASIC_HIRAGANA`, `CONTENT.WORLD_MAP` | All 46 basic characters staged into worlds |
| MVP-R3 | `LEARNING.STUDY_CARDS`, `LEARNING.RECOGNITION_QUIZ` | Two-step learn and challenge loop |
| MVP-R4 | `GAME.LEVEL_UNLOCKS`, `GAME.SCORES` | Measurable sequential progression |
| MVP-R5 | `STORAGE.LOCAL_PROGRESS` | Durable, recoverable progress |
| MVP-R6 | `UI.FRUTIGER_AERO` | Distinctive usable visual treatment |
| MVP-R7 | `TESTING.DETERMINISTIC_LOCAL` | Repeatable verification |

## Requirements

### MVP-R1 — local-first Desktop

The game must work without an account or connection after installation. No runtime backend, ads, analytics, remote assets or login should be required. The native Desktop host must restrict filesystem access to a narrow internal storage adapter.

### MVP-R2 — comprehensive beginner set

The MVP must include the 46 conventional basic hiragana, grouped into ten ordered levels. Distinguish ordinary `し`/`shi`, `ち`/`chi`, `つ`/`tsu`, `ふ`/`fu` and `を`/`wo` labels. Voiced combinations and small kana are excluded from this milestone.

### MVP-R3 — understandable loop

Each level must have a study activity followed by a finite recognition quiz. Progress should never depend on timers, social accounts, in-app purchases, or sound playback.

### MVP-R4 — predictable results

Passing must require at least 80%. Each question contributes equally. Worlds unlock only in sequence, completed worlds remain replayable, and best scores never decrease.

### MVP-R5 — persistence safety

Progress must survive restart. Corrupt/unsupported data and failed writes must produce visible errors, not automatic data loss. Versioned data and its location must be documented.

### MVP-R6 — Frutiger Aero usability

Use bright sky/water/green gradients, translucency, glossy controls and optimistic 2000s visual language. Visual polish must not compromise legibility, keyboard controls, focus indication or reduced-motion preferences. The initial treatment may be CSS-only.

### MVP-R7 — local deterministic validation

Core rules must have tests not dependent on Electron, OS integration or network access. Native behavior requires separate manual acceptance.

## Non-goals

Audio and voice evaluation, writing recognition, katakana, kanji, spaced repetition, accounts, cloud sync, telemetry, advertisements, mobile builds, installer/signing pipelines and AI-generated questions.

## Validation

The umbrella closes only after all bounded requirements pass automated checks plus native Desktop first-launch, offline behavior, all-world completion, restart persistence, error handling and visual/keyboard acceptance. Until then it stays active.
