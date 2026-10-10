---
type: Module Contract
title: Player progress contract
description: Version-1 saved state, monotonic completion, and error semantics.
---
# Player progress contract

Progress stores `formatVersion: 1`, completed world IDs in sequential order, and best score by world ID. A passed world requires a best score of at least 80. Completed worlds cannot become incomplete; best scores never decrease. Unknown/future formats, corrupt snapshots, duplicate IDs, invalid scores or out-of-order completions are rejected. A missing save file creates an empty in-memory model; a corrupt file is never silently overwritten. Filesystem error handling belongs to the host.
