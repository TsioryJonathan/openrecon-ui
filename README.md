# OpenRecon UI

Web frontend for the [OpenRecon API](https://github.com/TsioryJonathan/openrecon-api).
Next.js (App Router), TypeScript, React. Dark, terminal-inspired dashboard.

## Setup

```bash
npm install
npm run dev
```

### Environment

| Variable                       | Required | Default               | Description |
|--------------------------------|----------|-----------------------|-------------|
| `NEXT_PUBLIC_API_URL`          | no       | `http://localhost:8000` | Base URL of the OpenRecon API |
| `BETTER_AUTH_SECRET`           | yes (prod) | none                | Secret used to sign auth tokens |
| `BETTER_AUTH_URL`              | yes (prod) | `http://localhost:3000` | Public URL of the UI (Vercel) |
| `DATABASE_URL`                 | yes      | none                  | Neon Postgres URL for auth tables |
| `API_KEY`                      | yes (prod) | none                | API key injected server-side for investigations |
| `USER_SIGNING_SECRET`          | yes (prod) | none                | HMAC secret used to sign identity headers sent to the API (must match the API's) |
| `GITHUB_CLIENT_ID`             | no       | none                  | GitHub OAuth app id |
| `GITHUB_CLIENT_SECRET`         | no       | none                  | GitHub OAuth app secret |
| `NEXT_PUBLIC_BETTER_AUTH_URL`  | no       | `http://localhost:3000` | Auth server URL for the browser client |

Set these in the Vercel project settings for the production deployment.
`DATABASE_URL` must point to the same Neon instance used by the API.
The `prebuild` step runs `drizzle-kit push --force` to create/update the auth
tables (`user`, `session`, `account`, `verification`) at build time.

`NEXT_PUBLIC_API_KEY` is no longer used — auth is handled by Better Auth
sessions and the API key stays server-side only.

### Auth

The browser only ever holds a Better Auth session. For
`/api/investigations/*`, the Next.js proxy injects server-side credentials:
`X-API-Key`, plus a signed identity assertion (`X-User-Id`, `X-User-Exp`,
`X-User-Sig` = `HMAC-SHA256("{user_id}:{exp}", USER_SIGNING_SECRET)`,
300s validity). Without `USER_SIGNING_SECRET` the proxy sends no identity
headers (works only with the API in degraded dev mode).

## Scripts

- `npm run dev` : dev server
- `npm run build` : production build + typecheck (`drizzle-kit push` runs first)
- `npm run start` : serve the production build
- `npm run lint` : eslint
- `npm run typecheck` : `tsc --noEmit`
- `npm test` : vitest (unit + component tests)

## Tests

```bash
npm ci
npm run lint && npm run typecheck && npm test
```

CI (`.github/workflows/ci.yml`) runs all three on every push/PR.

## Features

- Sherlock username search across 480 platforms (count derived from the API, not hardcoded)
- Google dork generation with one-click copy
- EXIF photo metadata extraction
- Investigations : targets, per-target scans, adaptive scans, correlations (relations graph)
- Graph actions : right-click (or the ⋮ button) any node to run a scan, an adaptive scan, or a correlation on it
- Markdown report : preview, copy to clipboard, download as `.md`

### Why OpenRecon

SpiderFoot and Maltego are heavy, general-purpose platforms. OpenRecon is a
lightweight, web-native recon workspace: no desktop install, per-user scoped
investigations, evidence-backed correlations rendered as an interactive
graph, and reports that copy straight out of the browser.

## License

[MIT](LICENSE) © Tsiory Jonathan