---
type: Test Strategy
title: Validation and acceptance checks
description: Deterministic automated checks and native Desktop test boundaries.
---
# Tests

## Canonical entry point

```bash
./run_checks.sh
```

This checks TypeScript compilation, Node's deterministic gameplay tests, Python documentation/module-boundary/archive contract tests, and source-archive round-trip integrity. Native Electron launch is **not** part of this headless script.

## Automated domain cases

`tests/game.test.mjs` checks all 46 character identities and ten group sizes, four-option uniqueness, one attempt per question, scoring, pass threshold, sequential unlock, monotonic best scores, and rejection of malformed or future-version progress.

`tests/test_repository_contracts.py` checks required Markdown metadata, active/planned specification lifecycle, feature-ID vocabulary, module import boundaries, and archive exclusions. Contract tests are not a replacement for visual/manual acceptance.

## Manual Desktop acceptance (P0)

- Install dependencies and launch the native window on the target OS; no network access for ordinary gameplay.
- Pass world 1 with exactly four correct answers; world 2 unlocks, world 3 remains locked.
- Fail a world, retry, replay a completed world and retain the best score.
- Complete worlds with three questions; validate pass threshold behavior (three correct needed for 80%).
- Close and relaunch; verify persistent completion and score.
- Test a malformed/future-version save with a **disposable profile**; observe visible error and unchanged file.
- Simulate a denied write with a **disposable profile**; verify the UI does not present an unsaved result as persisted.
- Check keyboard/focus/contrast/reduced-motion and 760×620 and larger windows.

Do not claim these manual checks have passed until actually performed.
