---
type: Capability Overview
title: Shared game UI
description: DOM screens, Frutiger Aero CSS, keyboard interaction, and persistence bridge.
---
# Shared game UI

`src/main.ts` composes the map, study card, quiz, and results. `src/style.css` implements an asset-free Frutiger Aero-inspired design. `src/persistence.ts` calls the narrowly exposed Electron bridge, falling back to browser-localStorage only when the application runs as a development preview.
