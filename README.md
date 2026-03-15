# EngLens — AI Engineering Visibility Assistant

> An AI-powered assistant that tells engineering leaders what is really happening in their teams.

![Dashboard](endglens-screens/dashboard_daily_summary/screen.png)

## Quick Start

```bash
cd app
npm install
npx prisma migrate dev    # Creates SQLite database
npm run dev               # Starts at http://localhost:3000
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + Lucide React icons |
| Database | SQLite + Prisma ORM |
| AI/LLM | Google Gemini (multi-provider ready) |

## Project Structure

```
app/
├── prisma/
│   ├── schema.prisma          # Database schema (7 models)
│   ├── migrations/            # Migration history
│   └── dev.db                 # SQLite database (auto-created)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Login page
│   │   ├── layout.tsx         # Root layout
│   │   └── dashboard/
│   │       ├── layout.tsx     # Sidebar + header layout
│   │       ├── page.tsx       # Dashboard (summary cards + timeline)
│   │       ├── activity/      # Activity feed page
│   │       ├── reports/       # Reports page
│   │       ├── teams/         # Teams page
│   │       └── settings/      # Integrations settings page
│   ├── lib/
│   │   └── db.ts              # Prisma client singleton
│   └── generated/prisma/      # Generated Prisma client
├── .env                       # Environment variables
├── .env.example               # Template for env vars
└── package.json
```

## Database Schema

7 models: `Organization`, `Team`, `User`, `TeamMember`, `Integration`, `Activity`, `Report`, `ReportSection`

See [prisma/schema.prisma](app/prisma/schema.prisma) for full schema.

## Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
GEMINI_API_KEY="your-gemini-api-key-here"
```

## Current Status

See [PROGRESS.md](PROGRESS.md) for detailed progress tracking.

## UI Screens Reference

Design mockups from Google Stitch are in `endglens-screens/`.

## License

Private — All rights reserved.
