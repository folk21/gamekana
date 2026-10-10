---
type: Module Contract
title: Learning rules contract
description: Question generation, evaluation, pass threshold, and sequential unlock rule.
---
# Learning rules contract

`learning` depends only on `content`; it owns no UI or persistence. `createQuiz` accepts an injected random generator for repeatable tests. A quiz covers each level symbol once and offers four unique answers. An answer may be submitted only once per question; progression follows explicit feedback acknowledgment. A world passes at 80% or more. Only the next sequential world unlocks. Passing and unlocking are computed from the result; saved best scores are owned by `progress`.
