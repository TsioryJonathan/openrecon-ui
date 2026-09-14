# OpenRecon Frontend

Frontend for the OpenRecon OSINT API — find a username's presence across 480+ platforms.

Built with **Next.js 16** + **Tailwind CSS v4**. Newspaper editorial aesthetic with Fraunces + Figtree + JetBrains Mono.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure the API URL
cp .env.local.example .env.local
# Edit .env.local → set NEXT_PUBLIC_API_URL to your API address

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Make sure the OpenRecon API is running (default: `http://localhost:8000`).

## Pages

- `/` — New scan: enter a username, pick categories, run the scan
- `/results` — History: look up past scans for any username

## Stack

- Next.js 16.3 (App Router, Turbopack)
- Tailwind CSS 4.3 (CSS-first config, no `tailwind.config.js`)
- TypeScript
- Fonts: Fraunces (display), Figtree (body), JetBrains Mono (data)
