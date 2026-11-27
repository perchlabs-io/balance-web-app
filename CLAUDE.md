# BALANCE Web App — Project Context

## What this is

**BALANCE** ([balanceanalytics.io](https://www.balanceanalytics.io/)) is a blockchain-intelligence site for the Cardano ecosystem, built by Perch Labs. It has two halves:

- **Chartboards**: interactive D3 visualizations of Cardano decentralization data (stake vs. leverage, k-effective, group-stake donut).
- **Articles**: markdown posts pulled at request time from the separate GitHub repo `perchlabs-io/balance-media`.

## Stack

- SvelteKit 2 + **Svelte 5 (runes)**, TypeScript, Vite 5, SCSS
- D3 v7 for charts (D3 does the math and scales; Svelte renders the SVG)
- Supabase (Postgres) as a cache for API data and article view counts
- Buttondown for the newsletter (`/api/subscribe`)
- Deployed on **Vercel** (`@sveltejs/adapter-vercel`, `maxDuration: 120`, `memory: 3008`)

## Commands

```bash
npm run dev       # dev server
npm run build     # production build
npm run check     # svelte-kit sync + svelte-check (type and Svelte diagnostics)
npm run lint      # prettier --check + eslint
npm run format    # prettier --write
```

There is no automated test suite. Verify changes with `npm run check`, `npm run build`, and by checking each affected page in the browser.

Locally, `npm run build` needs **Node 18, 20, or 22**: on Node 24, `adapter-vercel` refuses to package the output. This is a local-only check. On Vercel (`VERCEL` env set), the adapter skips it and uses the project's configured Node version. To mimic a Vercel build locally, run `VERCEL=1 npm run build`.

**`npm run check` baseline** (Nov 27, 2026, after the pre-migration cleanup): 69 errors and 78 warnings, down from 112 and 81. The remaining errors are pre-existing strict-TypeScript issues, not migration breakage: implicit `any`, possibly-undefined values, an untyped `views` store, and the unified plugin types in `markdown.ts`. Many warnings are `state_referenced_locally` (Svelte 5 warning that `let x = data.x` only captures the initial value) plus a11y warnings. During the migration, fix the Svelte-5-related diagnostics. Track the TypeScript strictness errors as a follow-up.

## Architecture

```
src/
  hooks.server.ts            Supabase SSR client + auth guard (/private, /auth; those routes don't exist yet)
  lib/api/
    balance.server.ts        Server-only fetchers for api.balanceanalytics.io/rpc/* (Bearer BALANCE_API_TOKEN)
    posts.ts, markdown.ts    Articles from GitHub (GH_TOKEN) -> unified/remark/rehype -> HTML
    config.ts                Site metadata, post categories, chartBoards nav list
  lib/database/index.ts      Supabase client + views helpers
  lib/stores/                svelte/store writables (windowWidth, selectedEpoch, colorTheme, ...)
  lib/shared/ui/             Header, footer, preferences, posts list, newsletter
  routes/(app)/
    chartboards/(chartboards)/<board>/
      +page.server.ts        Calls balance.server.ts fetchers, returns data to the page
      +page.svelte           Board layout
      <chart>/<Chart>.svelte Chart root: scales, sizing, state
      <chart>/components/    AxisX, AxisY, Line, Area, Tooltip, HoverEvents
    api/                     JSON endpoints and Supabase cache updaters
    [slug]/                  Article page
  styles/                    Global SCSS, themes (CSS custom properties like --clr-primary)
```

**Data flow:** most chartboards fetch live from the Balance API in `+page.server.ts`. Some data is cached in the Supabase `api` table, keyed by `api_id`: `/api/mavdataupdate` (run hourly by the Vercel cron in `vercel.json`) and `/api/groupleverageupdate` write to it, and `/api/*.json` read from it.

**Chartboards in nav** are controlled by `chartBoards` in `lib/api/config.ts`. `stake_flow` exists but is disabled there.

**Env vars** (in `.env`, gitignored, never commit): `GH_TOKEN`, `BUTTONDOWN_API_KEY`, `BALANCE_API_TOKEN` (private); `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` (public).

## Conventions (Svelte 5)

All components use runes. Do not introduce Svelte 4 syntax.

| Svelte 4 (don't)               | Svelte 5 (do)                                       |
| ------------------------------ | --------------------------------------------------- |
| `export let foo`               | `let { foo }: Props = $props()` with an `interface Props` |
| `$: x = a + b`                 | `const x = $derived(a + b)`                         |
| `$: { sideEffect() }`          | `$effect(() => { sideEffect() })`, only for real side effects |
| `let count = 0` (reactive)     | `let count = $state(0)`                             |
| `on:click={fn}`                | `onclick={fn}`                                      |
| `createEventDispatcher`        | Callback props, e.g. `onselect`                     |
| `<slot />` / named slots       | `children` / snippet props + `{@render ...}`        |
| `on:submit\|preventDefault`    | `onsubmit={(e) => { e.preventDefault(); ... }}`     |

- Don't use `svelte/legacy` helpers (`run`, `preventDefault`, `handlers`, `createBubbler`) in finished code.
- Prefer `$derived` over `$effect`. Use `$effect` only for DOM or other imperative side effects (e.g. D3 brush or zoom setup).
- If a value follows other state but must also be settable locally (e.g. zoom scales reset on resize but overridden by D3 zoom), use a **writable `$derived`** (assign to it directly). Don't use `$state` plus an effect that copies the value.
- If state should reset in response to a user action, do it in the event handler, not in an effect that watches state.
- If a prop is intentionally read only once (initial store value, a tween's starting value, a `$state` default), wrap the read in `untrack(() => ...)`. That makes the intent explicit and silences `state_referenced_locally`.
- Snippets don't render a `slot` attribute, so style snippet content with a class in the file that defines the snippet, not with `:global([slot=...])` in the child.
- Exception: `svelte-range-slider-pips` (4.1.1, latest) still emits legacy events, so `on:stop` / `on:change` on `<RangeSlider>` is correct.
- Shared state stays in `svelte/store` for now; `$store` auto-subscription is fine in components.
- Prettier (`.prettierrc`) is the code style source of truth. Run `npm run format` (or `npx prettier --write <files>`) on changed files before committing.
- Large formatting-only commits go in `.git-blame-ignore-revs`. Enable it locally with `git config blame.ignoreRevsFile .git-blame-ignore-revs`; GitHub applies it automatically.

## Git workflow

- Feature branches named `<initials>_dev_<MMDDYY>` (e.g. `ng_dev_070526`)
- PR into `staging`, then PR `staging` into `main`
- `main` is production (Vercel deploys from it)
- Commit in small, logical steps with descriptive messages

## Current effort: Svelte 4 to Svelte 5 migration

Branch: `ng_dev_070526`, PR #78, merged into `staging` on Nov 27, 2026. Follow-up fixes found on the staging preview are on `ng_dev_112726`. Started July 2026, resumed November 2026. This branch's scope is only the migration. New work goes on separate feature branches cut from `staging` after this merges.

Vercel builds a preview deployment for every push. Use it for browser checks.

**PR #77** (`ccg_dev_stake_flow_20250708`, Stake Flow charts by TheStophe) is old, Svelte 4 work. It's out of scope here and will be redone on top of the migration after it merges.

**UTxO Allocation chartboard: removed.** It's archived as part of the migration deployment: the route, its nav entry, the home page section, the `getUTxO*` fetchers, the `utxoCat` store and its two home page images are deleted. `/chartboards/utxo_allocation` now returns 404. The code is still in git history (before the removal commit) if it's ever revived.

**No hotfixes from this branch.** Bug fixes found during the migration (e.g. K-Effective sorting) ship with the migration deployment.

**Agreed strategy**

- **Full runes migration** before shipping: no Svelte 4 syntax and no `svelte/legacy` helpers left.
- **Migration only**: preserve behavior and structure. Don't refactor unrelated code; add cleanup ideas to the follow-ups list below. One exception was agreed: a pre-migration cleanup pass of behavior-neutral fixes (see Status).
- **Keep `svelte/store`**: converting shared state to runes is a later effort.
- **Checkpoint commits**: commit working progress in small steps.

**Status**

- [x] Dependencies upgraded (svelte ^5, kit ^2.69, vite-plugin-svelte ^4, svelte-check ^4, eslint-plugin-svelte ^3)
- [x] Bulk conversion of most components (looks like `sv migrate svelte-5` output)
- [x] Stake v. Leverage tooltip positioning fixed after the migration
- [x] Pre-migration cleanup: added `@types/d3` and `@types/lodash.debounce`, renamed `lib/types/index.svelte` to `index.ts`, ignored `.vercel/`, removed live debug `console.log` calls, ran a Prettier formatting pass across `src`
- [x] Converted the remaining Svelte 4 files and checked them in the browser: the Donut Shop chart (`DonutGroupStakeChart.svelte`, `DonutCenterTooltip.svelte`, `donut_shop/+page.svelte`), `posts.svelte` (named slots became the `title` and `seeMore` snippets), and `newsletter.svelte` (no more `svelte/legacy` `preventDefault`). The "See more articles" link style moved from `posts.svelte`'s `:global([slot='see-more'])` to a scoped `.see-more` class on the home page, because snippets don't render a `slot` attribute. `npm run check`: 56 errors, 72 warnings.
- [x] Fixed K-Effective chart (out-of-scope bug fix, likely also broken in production). `rpc/pool_keff_sk` returns series unsorted by epoch, so `getKeffData()` now sorts each `keffdata` series by `epoch`.
- [x] `LevChart.svelte` and `GroupSearch.svelte` fully migrated and checked in the browser (search, suggestion click, play/pause/reset/prev/next, slider drag, zoom)
- [x] Removed `svelte/legacy` usage outside `utxo_allocation/` (that chartboard is being archived). Deleted the unused, already broken `donut_group_stake/components/Donut.svelte`.
- [x] Resolved all `state_referenced_locally` warnings outside `utxo_allocation/` and checked them in the browser. The article page's view counter is now an `$effect` keyed on the slug, so it also counts in-app navigation from one article to another (SvelteKit reuses the page component). `npm run check`: 51 errors, 48 warnings. The warnings left outside UTxO are pre-existing a11y issues and dead CSS (see follow-ups).
- [x] Full build including the Vercel adapter succeeds (`VERCEL=1 npm run build` on Node 24, which outputs the `nodejs24.x` runtime)
- [x] Vercel preview builds succeed on this branch (so the Vercel project's Node setting works with this build)
- [x] Archived the UTxO Allocation chartboard: deleted the route, nav entry, home page section, fetchers, store and images. Checked the home page and nav in the browser, and the Vercel build succeeds. `npm run check`: 40 errors, 36 warnings, all pre-existing (strict TypeScript, a11y, dead CSS).
- [x] Checked every page in the browser at desktop (1920px) and mobile (390px) width: home, articles, an article, all four categories, about, FAQ, newsletter, confirmation, Decentralization and Donut Shop chartboards (plus the unlinked Stake Flow placeholder). No JavaScript errors, broken images or horizontal overflow; cards match result counts; mobile chart layouts fit the screen. Testing note: Cursor's embedded browser stops rendering frames when unfocused, which delays `IntersectionObserver` callbacks, so `svelte-inview` content (article cards, home page sections) can look missing in automated checks. Take a screenshot (forces a frame) or confirm `requestAnimationFrame` is firing before treating that as a bug.
- [x] Checked third-party Svelte libraries for Svelte 5 compatibility. All are compatible and were exercised in the browser: `svelte-range-slider-pips` 4.1.1 (latest, peer `^5`), `svelte-inview` 4.0.4 (peer `^5`), `bits-ui` 2.18.1 (Svelte 5 native; header popovers), `@iconify/svelte` 4.0.1 (peer `>4`), `@poppanator/sveltekit-svg` 6.0.1 (peer `>=5`), and `svelte-loading-spinners` 0.3.6 (unmaintained, no peer range, but only plain `export let` props, which compile in legacy mode; the `Pulse` navigation spinner works). Optional upgrades and unused packages are in the follow-ups.
- [x] PR #78 marked ready and merged into `staging` (commit `2cf2076`). Checked the staging preview: every page works.
- [x] Fixed double view counting (branch `ng_dev_112726`, found on the staging preview). Each article view sent two POSTs to `/api/views/<slug>`. The layout's page transition (`{#key $page.url}`) remounts the page after SvelteKit has already rendered it, so two instances each ran the counter. The article page now counts in `afterNavigate`, which fires once per finished navigation; the short-lived first instance is destroyed before that. Verified exactly one request for a direct load, list to article, and article to article.
- [x] PR #79 (`ng_dev_112726`) merged into `staging` and verified on the preview. PR #80 (`staging` to `main`) merged on Nov 27, 2026 (commit `8da8981`), deployed to production and checked on balanceanalytics.io: home, articles, an article, both chartboards and about load without JavaScript errors, `/chartboards/utxo_allocation` returns 404, and an article view sends one view request. **The migration is complete.**

## Follow-ups (out of scope for the migration)

- `balance.server.ts`: the fetchers are near-duplicates; collapse them into one helper. Remove the redundant `JSON.stringify`/`JSON.parse` round-trip.
- Replace the many `any` types with real data types; type the `views` store (currently `writable([])`, inferred as `never[]`).
- Pin the Node version in `package.json` `engines` once the Vercel project's Node setting is confirmed. `.npmrc` has `engine-strict=true`, so a pin also blocks `npm install` on other Node versions, and Vercel lets `engines` override its dashboard setting.
- Delete the remaining commented-out `console.log` lines (the donut files are already clean).
- `hooks.server.ts` guards `/private` and `/auth`, but neither route exists.
- `.env` contains unused `PUBLIC_BALANCE_API_TOKEN` and `BLOB_READ_WRITE_TOKEN`. A `PUBLIC_` prefix exposes the value to the browser, so remove it if unused.
- `/api/groupleverageupdate` isn't scheduled in `vercel.json`. Confirm whether that's intended.
- The Decentralization chartboard's data load takes 13–18s (Balance API response time, the same on production). Consider caching it in Supabase like the MAV data.
- `/api/views.json` is cached on the CDN for an hour (`s-maxage=3600`), so displayed view counts lag. Preview deployments share the production Supabase, so views from preview testing count.
- Every navigation mounts the page component twice because of the layout's `{#key $page.url}` transition. Moving the layout to `$app/state` (see the `$app/stores` follow-up) may fix it; check that only one instance mounts.
- Possibly convert `svelte/store` to runes-based shared state (`.svelte.ts` modules).
- Remove unused packages: `@supabase/auth-helpers-sveltekit` (deprecated by Supabase; the app uses `@supabase/ssr`) and `@sveltejs/adapter-auto` (only referenced in a commented-out line in `svelte.config.js`).
- Optional dependency upgrades: `@iconify/svelte` 5 (Svelte 5 native, same `<Icon icon=...>` API), `@vercel/analytics` 2 (adds a SvelteKit-specific `injectAnalytics`). `svelte-loading-spinners` is unmaintained; `+layout.svelte` imports five spinners but only renders `Pulse`, so it could be replaced with a small local component.
- Replace `$app/stores` (deprecated since SvelteKit 2.12, removed in SvelteKit 3) with `$app/state` in `categories/[category]/+page.svelte`, `lib/shared/transition/index.svelte` and `lib/stores/loading.ts`. Do this before any SvelteKit 3 upgrade.
- Fix the 22 pre-existing a11y warnings (redundant `alt` text, click handlers on non-interactive elements).
- Remove dead CSS that has never matched: `themeToggleIcon.svelte` (`.dark`, plus `.top`/`.middle`/`.bottom`/`.open`, which look like leftovers from a hamburger animation), `posts.svelte` (`html[data-font='dyslexic']`, which can't match inside a scoped style; it needs `:global(html[data-font='dyslexic'])` if the dyslexic font option should affect card titles), `preferences/index.svelte` (`.options span`).
- On phones, the hidden back-to-top button (`+layout.svelte`) widens the page to about 550px, so the page can be dragged sideways. Pre-existing.
- `DonutCenterTooltip.svelte` has a typo: `fill="var(--clr-txt"` is missing its closing paren.

## Working agreement

- Before each change, explain what is changing and why, framed for learning (Svelte 4 vs. 5 concepts), then apply it.
- Keep diffs focused on the task. Flag unrelated issues and don't fix them silently.
- Never commit `.env` or print secret values.
- Update the **Status** checklist in this file as items are completed.
- End every hand-off with a clear status: what's finished, what's still running (dev servers, background tasks), what's uncommitted, and what's needed from the user next. Stop dev servers after testing unless asked to leave them running.
