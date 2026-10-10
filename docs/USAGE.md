---
type: Usage Guide
title: Playing and testing Hiragana Aero
description: Level flow, keyboard inputs, and local save behavior.
---
# Usage

## Gameplay

1. Open the available world on the level map.
2. Step through the character cards; click/tap a card to reveal its romaji sound.
3. Start the challenge and choose the correct romaji for every displayed kana.
4. A score of 80% or higher clears the world and unlocks the next one; retry failed challenges.
5. Return to cleared worlds to improve the best score.

Use the keyboard: number keys `1` to `4` answer multiple-choice questions; `Enter` continues after feedback; arrow keys navigate study cards; `Escape` returns to the map where saving allows it. Controls have visible focus indicators. The first world is available immediately; the next world unlocks only after passing its predecessor.

## Local storage

The Desktop version stores one `progress.v1.json` in the OS-specific Electron `app.getPath('userData')` directory. This path may vary with OS and installed app identity. The browser preview instead uses a separate localStorage entry named `hiragana-aero-preview-progress`.

A missing Desktop save initializes an empty game. Unsupported format versions, malformed JSON or other invalid progress must stop normal entry and show an error rather than resetting data. Progress updates are written after completed quizzes, not after every click; leaving a quiz early does not record partial attempts.

## Developer commands

```bash
npm run build
npm run test
./run_checks.sh
./archive.sh
./concat.sh
```
