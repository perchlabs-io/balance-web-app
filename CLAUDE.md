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

**`npm run check` baseline** (Nov 27, 2026, after the Svelte 5 migration): 40 errors and 36 warnings, down from 112 and 81 before it. All are pre-existing: strict-TypeScript errors (implicit `any`, possibly-undefined values, an untyped `views` store, the unified plugin types in `markdown.ts`), a11y warnings and dead CSS (see the backlog). A change shouldn't raise these counts.

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

Vercel builds a preview deployment for every push. Use it for browser checks.

## Testing notes

- **Safari:** layout can differ from Chrome (e.g. relative `top: 50%` on grid items). To check WebKit (the engine behind iPhone Safari), use Playwright's WebKit build with its `devices['iPhone 13']`, `devices['iPad Mini']` and `devices['Desktop Safari']` profiles, installed outside the repo.
- **Cursor's embedded browser** stops rendering frames when unfocused, which delays `IntersectionObserver` callbacks, so `svelte-inview` content (article cards, home page sections) can look missing in automated checks. Take a screenshot (forces a frame) or confirm `requestAnimationFrame` is firing before treating that as a bug.
- **View counts:** preview deployments and local builds use the production Supabase, so visiting an article on a preview or local production build (`npm run build` + `vite preview`) adds a real view. Stub `window.fetch` for `/api/views/` when testing. The dev server (`npm run dev`) never counts views.

## Completed: Svelte 4 to Svelte 5 migration (released Nov 27, 2026)

Started July 2026, resumed November 2026. Released to production via PR #78 (migration), #79 (double view-count fix), #80 (release) and #81/#82 (Safari home page image fix).

- Every component uses runes; no Svelte 4 syntax or `svelte/legacy` helpers remain (except the `<RangeSlider>` legacy events noted above). Shared state stayed in `svelte/store`.
- Dependencies: svelte ^5, kit ^2.69, vite-plugin-svelte ^4, svelte-check ^4, eslint-plugin-svelte ^3. All third-party Svelte libraries were confirmed compatible (`svelte-loading-spinners` is unmaintained but works).
- **UTxO Allocation chartboard archived:** route, nav entry, home page section, `getUTxO*` fetchers, `utxoCat` store and images deleted; `/chartboards/utxo_allocation` returns 404. The code is in git history before the removal commit if it's ever revived.
- Bug fixes shipped with it:
  - K-Effective chart: `rpc/pool_keff_sk` returns series unsorted by epoch, so `getKeffData()` sorts them.
  - Article views were counted twice; the article page now counts in `afterNavigate`.
  - The home page main image sat too high in Safari; the `translate(-50%, -50%)` centering hack was removed.
- **PR #77** (`ccg_dev_stake_flow_20250708`, Stake Flow charts by TheStophe) is old Svelte 4 work and needs to be redone on Svelte 5.

## Backlog

- `balance.server.ts`: the fetchers are near-duplicates; collapse them into one helper. Remove the redundant `JSON.stringify`/`JSON.parse` round-trip.
- Replace the many `any` types with real data types; type the `views` store (currently `writable([])`, inferred as `never[]`).
- Pin the Node version in `package.json` `engines` once the Vercel project's Node setting is confirmed. `.npmrc` has `engine-strict=true`, so a pin also blocks `npm install` on other Node versions, and Vercel lets `engines` override its dashboard setting.
- Delete the remaining commented-out `console.log` lines (the donut files are already clean).
- `hooks.server.ts` guards `/private` and `/auth`, but neither route exists.
- `.env` contains unused `PUBLIC_BALANCE_API_TOKEN` and `BLOB_READ_WRITE_TOKEN`. A `PUBLIC_` prefix exposes the value to the browser, so remove it if unused.
- `/api/groupleverageupdate` isn't scheduled in `vercel.json`. Confirm whether that's intended.
- The Decentralization chartboard's data load takes 13–18s (Balance API response time, the same on production). Consider caching it in Supabase like the MAV data.
- `/api/views.json` is cached on the CDN for an hour (`s-maxage=3600`), so displayed view counts lag. Preview deployments share the production Supabase, so views from preview testing count.
- Every navigation mounts the page component twice because of the layout's `{#key $page.url}` transition. Moving the layout to `$app/state` (see the `$app/stores` item below) may fix it; check that only one instance mounts.
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
- Keep this file current: remove backlog items when they're done and add new ones as they're found.
- Session continuity: the user runs `/session-handoff` to end a session and `/session-resume` to start one (skills in `.cursor/skills/`). The hand-off writes `.cursor/handoff.md` (gitignored); a `sessionStart` hook (`.cursor/hooks.json`) adds that file to every new chat's context. Lasting knowledge goes in this file, short-lived state in the hand-off file.
- End every hand-off with a clear status: what's finished, what's still running (dev servers, background tasks), what's uncommitted, and what's needed from the user next. Stop dev servers after testing unless asked to leave them running.
