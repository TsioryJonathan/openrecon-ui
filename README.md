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
| `GITHUB_CLIENT_ID`             | no       | none                  | GitHub OAuth app id |
| `GITHUB_CLIENT_SECRET`         | no       | none                  | GitHub OAuth app secret |
| `NEXT_PUBLIC_BETTER_AUTH_URL`  | no       | `http://localhost:3000` | Auth server URL for the browser client |

Set these in the Vercel project settings for the production deployment.
`DATABASE_URL` must point to the same Neon instance used by the API.
The `prebuild` step runs `drizzle-kit push --force` to create/update the auth
tables (`user`, `session`, `account`, `verification`) at build time.

`NEXT_PUBLIC_API_KEY` is no longer used — auth is handled by Better Auth
sessions and the API key stays server-side only.

## Scripts

- `npm run dev` : dev server
- `npm run build` : production build + typecheck (`drizzle-kit push` runs first)
- `npm run start` : serve the production build
- `npm run lint` : eslint

## Features

- Sherlock username search across platforms
- Google dork generation with one-click copy
- EXIF photo metadata extraction
- Investigations : targets, per-target scans, adaptive scans, correlations (relations graph), markdown report preview