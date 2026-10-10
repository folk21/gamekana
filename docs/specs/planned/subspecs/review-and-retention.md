---
type: Specification
title: Mistake review and retention loop
description: Planned review feature distinct from initial world progression.
document_role: subspec
spec_status: planned
parent: ../../active/spec-initial-functional-product.md
---
# Mistake review and retention loop

## Status

Planned only. Requires gameplay evidence and a new feature ID before activation.

## Feature scope

- `LEARNING.RECOGNITION_QUIZ`
- `GAME.SCORES`

## Requirement map

| ID | Feature IDs | Proposed scope |
|---|---|---|
| RR-R1 | `LEARNING.RECOGNITION_QUIZ`, `GAME.SCORES` | Optional review mistakes |

## Requirements

### RR-R1 — review without replacing levels

A future implementation may offer practice of recently missed kana and eventually spaced review. It must not silently change existing pass/unlock semantics and must specify a versioned compatible persistence change if new state is stored.

## Non-goals

Backend user profiling, account-linked synchronization, or AI-generated explanations.

## Validation

Specify measured practice outcomes, content selection and migration tests when this planned idea is activated.
