---
name: testing-portfolio
description: Run local portfolio browser checks for public links and locale-specific CVs.
---

# Local public-page QA

- Use the packageManager pin and `pnpm install --frozen-lockfile`, then `pnpm dev --host 0.0.0.0`; Astro normally serves http://localhost:4321.
- Public navigation and locale switching do not require authentication. Contact submission is separate and must not be exercised without send authorization.
- Check whether GitHub credentials are configured before project-link testing: `src/components/Projects.astro` uses GitHub pinned repositories when available and static cards otherwise. State which source was exercised.
- Change language using the header EN/ES menu. Selection reloads the page and persists `lang`; `public/i18n.js` subsequently applies `data-i18n-href`. Wait for the translated label before inspecting the CV href.
- Test real anchor clicks as well as href values. Outbound pages can open in the current or a new tab; use Back or close the destination tab accordingly. LinkedIn can show an authentication wall; verify its domain and intended profile redirect rather than attempting login.
- If workerd rejects the configured compatibility date, first align the runtime version. A temporary older date can unblock public UI-only QA, but disclose the deviation, restore the exact original file, and do not infer Worker API compatibility from those results.
- Browser inspection may produce malformed truncated image URLs in development. Distinguish those requests from original application URLs; a temporary `vite.server.hmr.overlay=false` can keep the UI usable for unrelated link checks. Restore configuration after testing.

## Devin Secrets Needed

None for public links and language switching. GitHub-backed project cards use the repository's configured GitHub token; see `.env.example` and `src/lib/env.ts` for the current variable contract. Contact delivery requires separate Resend configuration and is outside this workflow.
