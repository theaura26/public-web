# UAT Environment — Setup Brief
## For Aman · theaura.life

**The ask in one line:** a stable, password-protected UAT URL that always shows the latest approved-for-review work, so Poon can review, approve, and only then have it promoted to production.

This is written to be executed top to bottom. Where something can't be verified from the codebase, it's marked **`CONFIRM`** — please check rather than assume.

---

## 1. WHAT EXISTS TODAY

Verified from the repository, not from memory:

| | |
|---|---|
| **Repo** | `github.com/theaura26/public-web` |
| **Framework** | Next.js `16.2.3`, React `19.2.4`, App Router, TypeScript |
| **Vercel project** | `aura-life` · `prj_B9y8o4TK4BrvCYIMT46eKFCTOxtl` |
| **Vercel org** | `team_0dH9tQVeqtkMKVVn3Qb0gte2` |
| **Production branch** | `main` |
| **Build** | `next build` · no custom CI, no GitHub Actions (only `.github/CODEOWNERS`) |
| **Env vars in use** | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `RESEND_API_KEY` |

**⚠ There is a second Vercel project deploying from this same repo** — the shader sandbox at `aura-art-three.vercel.app/art`. It has historically been switched by swapping the local `.vercel/` folder. **`CONFIRM` this before touching anything**, because adding a third environment to a repo that already multiplexes projects by local folder state is where this will break. If that second project is still live, we should move it to its own repo or its own Vercel project properly linked — not folder-swapped.

---

## 2. THE TARGET

Three environments, one repo, one direction of travel.

```
                  AUTOMATIC              APPROVED PR ONLY
Poon's branch  ───────────────▶   uat   ─────────────────▶   main
claude/** ·                        │                          │
feature/** · dev                   ▼                          ▼
                          uat.theaura.life              theaura.life
                          stable · locked · noindex      public · indexed
```

**Two different rules, on purpose.**

Getting onto UAT is automatic and frictionless — Poon pushes a working branch and UAT follows it within a couple of minutes. No PR, no merge, no asking anyone.

Getting onto production is deliberate and gated — an approved pull request from `uat` to `main`, and nothing else. `main` is never pushed to directly.

---

## 3. THE AUTOMATION — ALREADY WRITTEN

`.github/workflows/sync-uat.yml` is in this branch. On any push to `claude/**`, `feature/**`, `fix/**` or `dev`, it force-updates the `uat` branch to that commit, and Vercel rebuilds `uat.theaura.life`.

```
git push                    →  workflow fires  →  uat updated  →  Vercel builds
(~2 seconds)                   (~10 seconds)      (~5 seconds)     (~90 seconds)
```

It also exposes a manual **Run workflow** button in the Actions tab, so any branch, tag or SHA can be put on UAT on demand without pushing anything.

**Three things it deliberately does:**

- **Force-pushes.** UAT is a mirror of whatever is being worked on, not a branch with history worth preserving. Its own history is disposable by design.
- **Refuses `main`.** Production never syncs down to UAT.
- **Queues rather than races.** A `concurrency` group with `cancel-in-progress: false`, so two quick pushes land in order instead of leaving `uat` pointing at a half-written ref.

**The one consequence to understand:** UAT shows the *last thing pushed*, by anyone. If two branches are in flight simultaneously they will overwrite each other on UAT. For a one-or-two-person flow that is the right trade — it removes all ceremony. If it ever becomes a problem, the fix is to narrow the trigger to a single `dev` branch and merge into that instead.

**Aman — this changes one thing in your setup:** `uat` must **not** be protected against force pushes, or the workflow can't update it. Protect `main` hard; leave `uat` writable by the action.

---

## 4. AMAN — SETUP CHECKLIST

### 4.1 Create the UAT branch

```bash
git checkout main && git pull
git checkout -b uat
git push -u origin uat
```

### 4.2 Point a domain at it

Vercel → project `aura-life` → **Settings → Domains** → Add.

- Domain: `uat.theaura.life`
- Assign it to the **`uat` git branch** (Vercel: "Git Branch" field on the domain), **not** to Production.

DNS at the registrar for `theaura.life`:

```
CNAME   uat   cname.vercel-dns.com
```

**`CONFIRM`** who controls DNS for `theaura.life` and whether it's on Cloudflare — if it is, set the record to **DNS only** (grey cloud), not proxied, or Vercel's certificate issuance will fail.

### 4.3 Lock it

Vercel → **Settings → Deployment Protection**.

- **Vercel Authentication: ON for Preview.** Only Vercel team members can open it.
- Then add **Password Protection** for Preview as well, and share that password with Poon and anyone reviewing who isn't on the Vercel team. Client-side reviewers should not need a Vercel account.

Leave Production unprotected. Obviously.

### 4.4 Environment variables, scoped properly

Vercel → **Settings → Environment Variables**. For each, set the **Environment** scope explicitly rather than leaving it on "All".

| Variable | Production | Preview (= UAT) |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | live project key | **separate PostHog project key, or leave empty** |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | same |
| `RESEND_API_KEY` | live key | test key, or a key with a sandbox sender |

**Why this matters:** PostHog is wired site-wide with autocapture and pageviews. If UAT shares the production key, every review click lands in the production analytics and quietly corrupts the numbers. Leaving `NEXT_PUBLIC_POSTHOG_KEY` empty on Preview disables analytics entirely — the code already handles that path. That's the safest default unless you want UAT funnel data.

Same logic for Resend: the contact form will send real email from UAT otherwise.

### 4.5 Build settings

- **Node version:** `CONFIRM` it matches local. Next 16 wants Node 20+. Pin it in Vercel → Settings → General → Node.js Version so UAT and Production can't drift.
- **Ignored Build Step:** leave off. We want every push to `uat` to rebuild.
- Framework preset: Next.js. Build command: default (`next build`). Don't override.

### 4.6 Branch protection on GitHub

**On `main` — lock it down:**

- Require a pull request before merging
- Require approval from **@Poonimator** (CODEOWNERS already exists — extend it if it doesn't cover the app directory)
- Dismiss stale approvals on new commits
- Block force pushes
- Block deletion

`main` should be impossible to push to directly. Today it isn't. `CONFIRM`.

**On `uat` — leave it open.** No protection rule, or the sync workflow cannot force-update it. UAT is disposable; the only thing guarding production is the `main` rule above.

**Also:** Settings → Actions → General → Workflow permissions → **Read and write**. Without it the workflow can't push and every sync fails with a 403.

### 4.7 Confirm the noindex is live

`app/robots.ts` has been updated so any non-production deployment returns `Disallow: /` — it keys off `VERCEL_ENV`, which Vercel sets automatically. After the first UAT deploy:

```bash
curl -s https://uat.theaura.life/robots.txt
# expect: User-Agent: *  /  Disallow: /
curl -s https://theaura.life/robots.txt
# expect: Allow: / plus the sitemap and host lines
```

If UAT returns `Allow`, the environment scoping is wrong — stop and fix it before sharing the link. An indexed UAT will compete with theaura.life for its own search results.

---

## 5. POON — HOW YOU'LL USE IT

### Getting work onto UAT

Push. That's the whole workflow.

```bash
git push
```

Any branch named `claude/**`, `feature/**`, `fix/**` or `dev` goes to UAT automatically. About two minutes later `uat.theaura.life` is the new build. You never touch the `uat` branch yourself.

If you want something on UAT that isn't on one of those branches — an old commit, a tag, an experiment — use **Actions → Sync UAT → Run workflow** on GitHub and give it any ref.

### Approving

When UAT looks right, Aman opens a PR `uat → main`. You approve it. Merging deploys production. There is no other route to production.

### What to check on UAT, every time

- The four coffee routes: `/regenerative-coffee` and its `/biodynamic`, `/transparency`, `/flavour` children
- Day and night themes (`d` and `l` keys)
- The estate journals still render — the coffee work touched `DESIGN-SYSTEM.md` and `app/robots.ts`, which are shared
- Contact form submits without erroring — and **confirm it did not send a real email** if the Resend key is scoped correctly

### Rolling back

Vercel → Deployments → find the last good production build → **Promote to Production**. Instant, no rebuild, no git. Worth doing once as a drill before you need it.

---

## 6. REPO WORK THAT SHOULD LAND WITH THIS

Small, and each one prevents a specific failure:

1. **`app/robots.ts`** — already changed in the coffee branch. Non-production now returns `Disallow: /`.
2. **`.env.example`** — add `RESEND_API_KEY`. It's referenced in the code and missing from the example, so a fresh clone silently breaks the contact form.
3. **A UAT banner** *(optional, recommended)* — a fixed strip reading `UAT — not production` when `NEXT_PUBLIC_VERCEL_ENV !== 'production'`. Prevents the perennial "is this live?" confusion. Ten lines in `client-layout.tsx`.
4. **`CODEOWNERS`** — `CONFIRM` it covers `/app/` and `/components/`, otherwise required-review does nothing for the pages that matter.

---

## 7. GOTCHAS SPECIFIC TO THIS REPO

**The `.vercel` folder swap.** Covered above. Highest-risk item on this page.

**`next.config.ts` carries a scar.** There's a comment documenting that `__dirname` in `turbopack.root` broke every production deploy from PR #16 onward, because `__dirname` is undefined in Vercel's ESM loader. Don't reintroduce a `turbopack.root` without the `fileURLToPath(import.meta.url)` form.

**`.vercelignore` excludes large media.** `public/aura-25.mp4` and `.webm` are excluded — they exceed Vercel's 100 MB per-file cap. Any page referencing them will 404 in every deployed environment while working locally. If UAT shows a missing video that works on your machine, this is why.

**All `Info/` and root `*.pdf` are excluded from deploys** — deliberately, they're internal briefs. `public/*.pdf` is re-allowed for the estate map.

**Git LFS.** The `Info/` PDFs are LFS pointers and `git-lfs` isn't installed on Poon's machine. Not a deploy blocker since they're ignored, but don't be surprised by 130-byte "PDFs".

---

## 8. ACCEPTANCE — WE'RE DONE WHEN

- [ ] `uat.theaura.life` resolves and serves the `uat` branch
- [ ] It asks for a password before showing anything
- [ ] `curl https://uat.theaura.life/robots.txt` returns `Disallow: /`
- [ ] `curl https://theaura.life/robots.txt` still returns `Allow: /`
- [ ] Pushing a `feature/**` branch updates UAT automatically, with no manual step
- [ ] The Sync UAT workflow appears in the Actions tab and can be run manually against any ref
- [ ] Pushing to `main` is blocked without an approved PR
- [ ] Workflow permissions are set to read/write (otherwise sync 403s)
- [ ] PostHog shows **no** UAT traffic in the production project
- [ ] The contact form on UAT does not send from the production Resend key
- [ ] A rollback has been performed once, successfully, as a drill
- [ ] Poon can reach the UAT link on a phone, off the office network, with only the password

---

## 9. OPEN QUESTIONS — PLEASE ANSWER BEFORE STARTING

1. Is the `aura-art-three` project still deploying from this repo? How is it linked now?
2. Who holds DNS for `theaura.life`, and is it behind Cloudflare?
3. Is `uat.theaura.life` the subdomain we want, or would you rather `staging.` / `preview.`?
4. Do we want a separate PostHog project for UAT, or analytics off entirely there?
5. Does Resend have a test key, or should the contact form be stubbed on non-production?
6. Who besides Poon needs UAT access, and do they have Vercel accounts?

---

## 10. STATUS OF THE COFFEE WORK

**Nothing has been pushed.** The regenerative coffee microsite — `/regenerative-coffee` plus three subpages, the `components/coffee/` block kit, the `AURA_COFFEE/` strategy and production documents, and the `app/robots.ts` change — all exist locally on the branch `claude/aura-coffee-storytelling-e0ebee` and are uncommitted. `main` is still at `d0c763e`.

Once UAT exists, that branch is the first thing to put through it.
