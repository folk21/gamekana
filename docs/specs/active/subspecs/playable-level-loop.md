---
type: Specification
title: Playable study, challenge, unlock and save loop
description: Active sub-spec for the first end-to-end Desktop learning vertical slice.
document_role: subspec
spec_status: active
parent: ../spec-initial-functional-product.md
---
# Playable study, challenge, unlock and save loop

## Status

Active. TypeScript domain, UI, host integration and deterministic tests have initial implementations. Native Desktop walkthrough and save-file behavior remain unaccepted.

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

Provide one complete enjoyable learning loop: choose an available world, see and practice characters, identify readings, receive feedback, record a result and unlock the next world without leaving the device.

## Requirement map

| ID | Feature IDs | Purpose |
|---|---|---|
| LL-R1 | `CONTENT.BASIC_HIRAGANA`, `CONTENT.WORLD_MAP` | Correct ordered content |
| LL-R2 | `LEARNING.STUDY_CARDS` | Study/reveal interaction |
| LL-R3 | `LEARNING.RECOGNITION_QUIZ` | Non-repeating four-option questions |
| LL-R4 | `GAME.LEVEL_UNLOCKS`, `GAME.SCORES` | 80% pass and monotonic completion |
| LL-R5 | `STORAGE.LOCAL_PROGRESS` | Versioned local saved progression |
| LL-R6 | `PLATFORM.DESKTOP` | Secure host/renderer boundary |
| LL-R7 | `UI.FRUTIGER_AERO` | Readable nostalgic layout |
| LL-R8 | `TESTING.DETERMINISTIC_LOCAL` | Repeatable tests and manual evidence |

## Requirements

### LL-R1 — basic catalog

There must be ten stable-ID worlds covering 46 unique basic hiragana. Levels with three characters must still be completable. The chosen beginner-friendly romanization labels should be reviewed by a knowledgeable speaker before public release.

### LL-R2 — study step

Opening an unlocked world must show character cards in the fixed world order. The user must be able to reveal the romaji, move backward/forward, and deliberately begin the challenge. No forced timed progress.

### LL-R3 — recognition quiz

The quiz must ask each symbol exactly once, randomizing question order and answer position. Each question must offer exactly four unique romaji labels including the correct one. A wrong answer must show the right answer, and the user must acknowledge feedback before advancing. A question cannot receive multiple graded submissions. Include keyboard input alongside pointer controls.

### LL-R4 — pass and unlock

At least 80% correct must pass a world. With five questions, four correct suffice; with three, all three are required. A failed attempt must not unlock the next world. Completed worlds remain replayable, and a later lower score cannot remove completion or decrease the best score. Locked worlds cannot be opened directly.

### LL-R5 — versioned saves

A version-1 JSON snapshot must contain completed world IDs and best scores. Valid snapshots are recovered after restart. Missing data should start a clean profile. Unknown/invalid versions must fail visibly and not overwrite the source. The UI must not represent an unlock as persisted before a successful write.

### LL-R6 — host isolation

The renderer must not access Node directly. The host must expose a minimal, validated persistence bridge, deny untrusted navigation and window creation, and serialize bounded atomic file updates.

### LL-R7 — appearance and accessibility

The interface should use CSS-only Frutiger Aero styling in this slice. It must maintain readable controls, visible focus and reduced-motion compatibility. Decorative assets must not be required for successful play.

### LL-R8 — verification

Automated tests must cover content uniqueness, question creation, grading, sequential unlocking, score persistence invariants and rejecting corrupt data. Native launch/offline/restart/visual checks must be recorded separately as manual acceptance.

## Non-goals

Additional kana types, spaced repetition, audio, animated map scenes, deep statistics, browser synchronization, installer distribution and multiplayer.

## Validation

- `./run_checks.sh` succeeds on a prepared environment.
- Native first-launch, keyboard, full ten-world completion, replay and restart persistence succeed.
- Save-error and unsupported-format paths do not silently erase data.
- User signs off the UI/game loop; only then move accepted behavior into current docs and archive this sub-spec.
