# BALANCE Web App — Project Context

## What this is

**BALANCE** ([balanceanalytics.io](https://www.balanceanalytics.io/)) is a blockchain-intelligence site for the Cardano ecosystem, built by Perch Labs. It has two halves:

- **Chartboards**: interactive D3 visualizations of Cardano decentralization data (stake vs. leverage, k-effective, group-stake donut, UTxO allocation).
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

## Architecture

```
src/
  hooks.server.ts            Supabase SSR client + auth guard (/private, /auth; those routes don't exist yet)
  lib/api/
    balance.server.ts        Server-only fetchers for api.balanceanalytics.io/rpc/* (Bearer BALANCE_API_TOKEN)
    posts.ts, markdown.ts    Articles from GitHub (GH_TOKEN) -> unified/remark/rehype -> HTML
    config.ts                Site metadata, post categories, chartBoards nav list
  lib/database/index.ts      Supabase client + views helpers
  lib/stores/                svelte/store writables (windowWidth, selectedEpoch, utxoCat, ...)
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
- Shared state stays in `svelte/store` for now; `$store` auto-subscription is fine in components.
- Match surrounding code style: tabs, single quotes, no semicolons in most TS files (Prettier config in `.prettierrc`).

## Git workflow

- Feature branches named `<initials>_dev_<MMDDYY>` (e.g. `ng_dev_070526`)
- PR into `staging`, then PR `staging` into `main`
- `main` is production (Vercel deploys from it)
- Commit in small, logical steps with descriptive messages

## Current effort: Svelte 4 to Svelte 5 migration

Branch: `ng_dev_070526`. Started July 2026, resumed November 2026.

**Agreed strategy**

- **Full runes migration** before shipping: no Svelte 4 syntax and no `svelte/legacy` helpers left.
- **Migration only**: preserve behavior and structure. Don't refactor unrelated code; add cleanup ideas to the follow-ups list below.
- **Keep `svelte/store`**: converting shared state to runes is a later effort.
- **Checkpoint commits**: commit working progress in small steps.

**Status**

- [x] Dependencies upgraded (svelte ^5, kit ^2.69, vite-plugin-svelte ^4, svelte-check ^4, eslint-plugin-svelte ^3)
- [x] Bulk conversion of most components (looks like `sv migrate svelte-5` output)
- [x] Stake v. Leverage tooltip positioning fixed after the migration
- [ ] Convert remaining Svelte 4 files:
  - `donut_shop/donut_group_stake/DonutGroupStakeChart.svelte`
  - `donut_shop/donut_group_stake/components/DonutCenterTooltip.svelte`
  - `lib/shared/ui/posts.svelte` (named slots `title` and `see-more`; update its callers)
- [ ] `LevChart.svelte`: replace `on:click` on `<GroupSearch>` (line ~347) and `on:stop` on the range slider (line ~572)
- [ ] Remove `svelte/legacy` usage:
  - `run()`: `Donut.svelte`, `UTxODeltaChart.svelte`, `UTxOStackChart.svelte`, `UTxOTotalChart.svelte`, `LevChart.svelte`
  - `preventDefault`: `LevChart.svelte`, `newsletter.svelte`
  - `handlers`: `UTxOStackChart.svelte`, `UTxOTotalChart.svelte`
  - `createBubbler`: `GroupSearch.svelte` (switch to an `onclick` callback prop)
- [ ] `npm run check` passes with no errors
- [ ] `npm run build` succeeds
- [ ] Check every page in the browser: home, articles, article, categories, about, FAQ, newsletter, all three chartboards (desktop and ≤650px mobile)
- [ ] Check third-party Svelte libraries for Svelte 5 compatibility (`svelte-range-slider-pips`, `svelte-inview`, `svelte-loading-spinners`, `@iconify/svelte`)
- [ ] PR to `staging`, verify the Vercel preview, then PR to `main`

## Follow-ups (out of scope for the migration)

- `balance.server.ts`: the fetchers are near-duplicates; collapse them into one helper. Remove the redundant `JSON.stringify`/`JSON.parse` round-trip.
- Replace the many `any` types with real data types.
- Remove stray `console.log` calls (e.g. `getPost` logs the full markdown).
- `hooks.server.ts` guards `/private` and `/auth`, but neither route exists.
- `.env` contains unused `PUBLIC_BALANCE_API_TOKEN` and `BLOB_READ_WRITE_TOKEN`. A `PUBLIC_` prefix exposes the value to the browser, so remove it if unused.
- `/api/groupleverageupdate` isn't scheduled in `vercel.json`. Confirm whether that's intended.
- Possibly convert `svelte/store` to runes-based shared state (`.svelte.ts` modules).

## Working agreement

- Before each change, explain what is changing and why, framed for learning (Svelte 4 vs. 5 concepts), then apply it.
- Keep diffs focused on the task. Flag unrelated issues and don't fix them silently.
- Never commit `.env` or print secret values.
- Update the **Status** checklist in this file as items are completed.
