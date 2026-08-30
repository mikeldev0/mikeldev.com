---
name: ponytail-review
description: >
  Code review focused exclusively on over-engineering. Finds what to delete:
  reinvented standard library, unneeded dependencies, speculative abstractions,
  dead flexibility. Complements correctness-focused review.
---

# Ponytail review

Review diffs for unnecessary complexity. The diff's best outcome is getting shorter.

Use one line per finding: `L<line>: <tag> <what>. <replacement>.`

Tags: `delete`, `stdlib`, `native`, `yagni`, `shrink`.

End with `net: -<N> lines possible.` If there is nothing to cut, say `Lean already. Ship.`

Scope is over-engineering and complexity only. Correctness, security, and performance still require the normal review pass.
