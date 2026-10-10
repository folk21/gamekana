---
type: Capability Overview
title: Player progress
description: Versioned local progression and best score semantics.
---
# Player progress

`src/progress.ts` validates loaded player progression and records world results. Storage and I/O are deliberately absent. The Desktop adapter saves JSON, while the browser preview stores its own isolated copy in localStorage.
