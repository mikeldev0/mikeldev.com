---
name: code-quality-flow
description: >
  Mandatory workflow for any code implementation, bug fix, refactor, or review in this repository.
  Use Ponytail full before and during coding, then Oxlint autofix and lint, existing type/tests/build checks,
  and finish with a Ponytail review of the final diff to remove avoidable complexity.
---

# Code quality flow

Use this sequence for code changes unless the task is documentation-only or a step is not applicable:

1. **Ponytail full before coding**
   - Understand the real flow first.
   - Apply YAGNI/KISS.
   - Reuse existing code, standard library, native platform features, and installed dependencies before writing new code.
   - Choose the smallest correct diff and fix root causes rather than symptoms.

2. **Implement**
   - Keep changes surgical.
   - Do not introduce speculative abstractions, dependencies, configuration, or unrelated cleanup.

3. **Oxlint autofix**
   - Run `pnpm dlx oxlint@1.80.0 --fix .`.
   - Inspect the resulting diff and keep only fixes that belong to the task.

4. **Oxlint validation**
   - Run `pnpm dlx oxlint@1.80.0 .`.

5. **Correctness gates**
   - Run the smallest relevant tests first.
   - Run `pnpm check` for Astro/TypeScript diagnostics.
   - Run `pnpm test` for behavior changes.
   - Run `pnpm build` before shipping production-impacting changes.
   - Preserve any additional checks required by `AGENTS.md`.

6. **Ponytail review of the final diff**
   - Use `ponytail-review` to hunt unnecessary complexity.
   - Delete dead flexibility, one-use abstractions, duplicated platform/stdlib functionality, and avoidable lines.
   - Re-run affected checks after simplification.

Do not add Oxlint as a permanent dependency only to satisfy this workflow unless the repository later needs it in CI. A passing linter does not replace tests, framework checks, browser QA, accessibility, or security review where relevant.
