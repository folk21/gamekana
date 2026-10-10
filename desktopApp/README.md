---
type: Platform Host
title: Electron desktop host
description: Window lifecycle, isolated preload, validated IPC, and JSON storage.
---
# Electron desktop host

`main.cjs` starts a local-only BrowserWindow on a restricted `app://bundle` scheme with sandbox, context isolation and no Node integration. `preload.cjs` exposes only two persistence calls. The host stores `progress.v1.json` in Electron's OS-specific `userData` directory, serializing atomic writes through a temporary file and rename. A missing file is not an error; malformed JSON fails without changing saved data. See `contract.md` and `docs/USAGE.md`.
