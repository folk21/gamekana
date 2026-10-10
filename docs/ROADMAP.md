---
type: Roadmap
title: Hiragana Aero roadmap
description: Active MVP acceptance, future extensions, and current evidence.
---
# Roadmap

## Position

The desktop-first MVP umbrella is active; its single active bounded implementation focus is the playable level loop. The TypeScript implementation and unit-level contract checks exist, but native Desktop acceptance is still required before completion/archiving.

| Slice | Feature IDs | State | Next acceptance |
|---|---|---|---|
| Basic content and levels | `CONTENT.BASIC_HIRAGANA`, `CONTENT.WORLD_MAP` | implemented, acceptance pending | Check 46 entries, readings and ordering with learners |
| Study, recognition and unlocking | `LEARNING.STUDY_CARDS`, `LEARNING.RECOGNITION_QUIZ`, `GAME.LEVEL_UNLOCKS` | implemented, active | Exercise all world flow / input / replay |
| Local progress | `GAME.SCORES`, `STORAGE.LOCAL_PROGRESS` | implemented, active | Verify Desktop restart and corrupt/failed writes |
| Desktop shell and styling | `PLATFORM.DESKTOP`, `UI.FRUTIGER_AERO` | implemented, acceptance pending | Native launch + visual/keyboard checks on target OS |
| Repository checks | `TESTING.DETERMINISTIC_LOCAL` | implemented, acceptance pending | Repeat on user machine with npm dependencies installed |

## P0 — MVP acceptance order

1. Compile and run repository/domain contract tests.
2. Install Electron on a supported Desktop; run the app and check first-launch offline behavior.
3. Complete each of the ten worlds, including three-character worlds and 80% pass rules.
4. Restart and verify progress, replay and local JSON persistence. Confirm failures cannot silently wipe data.
5. Review Frutiger Aero visual hierarchy, accessibility, keyboard interaction, and screen dimensions.
6. After acceptance, document stable behaviors and archive the completed slice/umbrella.

## Planned future work

- `docs/specs/planned/subspecs/feedback-and-sound.md`: optional local audio/feedback polish, assets under explicit license, accessible audio-off mode.
- `docs/specs/planned/subspecs/review-and-retention.md`: targeted review of mistaken answers and eventual spaced repetition; a separate decision from initial level unlocking.

Do not implement planned features during P0 unless moved into the active specification.
