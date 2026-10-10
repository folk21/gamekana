---
type: Capability Overview
title: Learning game
description: Quiz creation and deterministic score/pass semantics.
---
# Learning game

The pure rules in `src/game.ts` create one recognition question for every character in a world. Each question has four distinct romaji options. A correct choice is worth one point; a score of 80% or more passes after the last answer.
