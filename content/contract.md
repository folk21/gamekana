---
type: Module Contract
title: Kana catalog contract
description: Stable content ownership, row grouping, and unique reading labels.
---
# Kana catalog contract

`content` owns immutable basic-kana entries, their romaji labels and the ordered worlds. It has no internal dependencies and no I/O. Each of the 46 basic hiragana appears exactly once. MVP romanization is for recognition prompts, not a complete Japanese pronunciation model. `を` is shown as `wo`; additional pronunciation context is deferred. Display order is stable across saved progress versions; changing world IDs/order requires a versioned progress migration.
