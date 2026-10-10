---
type: Module Contract
title: UI and persistence port contract
description: Screen state composition without platform filesystem access.
---
# UI and persistence port contract

`shared` owns screen transitions, accessible interactive controls, and visible save-error feedback. It may depend on `content`, `learning` and `progress`, but must not import `electron` or `node:*`. `window.desktopProgress` exposes exactly `loadProgress` and `saveProgress`. Native Desktop saves must complete successfully before a result is considered persisted or a newly unlocked level is shown.
