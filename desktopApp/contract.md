---
type: Module Contract
title: Desktop host contract
description: Restricted Electron host authority and local persistence boundaries.
---
# Desktop host contract

Only the Desktop host may read/write application files. It exposes `progress:load` and `progress:save` through specific preload methods, not raw `ipcRenderer`. The host rejects untrusted IPC senders, caps persisted payload size, creates a local user-data file, serializes writes and uses atomic rename. The custom secure protocol serves only the app entry point, compiled modules, and local CSS. No navigation or external windows are permitted. Electron is a transport/host, never the owner of learning semantics. Cross-platform packaging and real-host security validation are pending.
