# OpenRecon UI

Web frontend for the [OpenRecon API](https://github.com/TsioryJonathan/openrecon-api).
Next.js (App Router), TypeScript, React. Dark, terminal-inspired dashboard.

## Setup

```bash
npm install
npm run dev
```

### Environment

| Variable               | Required | Default               | Description |
|------------------------|----------|-----------------------|-------------|
| `NEXT_PUBLIC_API_URL`  | no       | `http://localhost:8000` | Base URL of the OpenRecon API |
| `NEXT_PUBLIC_API_KEY`  | no       | none                  | Sent as `X-API-Key` when set |

Set both in the Vercel project settings for the production deployment.
`NEXT_PUBLIC_API_KEY` only needs to be set if the API has `API_KEY` enabled.

## Scripts

- `npm run dev` : dev server
- `npm run build` : production build + typecheck
- `npm run start` : serve the production build
- `npm run lint` : eslint

## Features

- Sherlock username search across platforms
- Google dork generation with one-click copy
- EXIF photo metadata extraction
- Investigations : targets, per-target scans, adaptive scans, correlations (relations graph), markdown report preview