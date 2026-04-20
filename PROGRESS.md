# EngLens — Progress Tracker

> Last updated: **March 15, 2026** by Renuka Dhanawat

---

## ✅ Completed

### Planning
- [x] Refined product concept and architecture
- [x] Created detailed implementation plan (see `.gemini/` artifacts)
- [x] User approved plan — SQLite (not Postgres), Gemini as primary LLM

### Phase 1 — MVP
- [x] **Project scaffolding** — Next.js 16.1.6, TypeScript, Tailwind CSS 4, Turbopack
- [x] **Database schema** — SQLite + Prisma ORM, 7 models, initial migration applied
  - Models: Organization, Team, User, TeamMember, Integration, Activity, Report, ReportSection
  - Migration: `prisma/migrations/20260315173419_init/`
  - Prisma client singleton: `src/lib/db.ts`
- [x] **Web Dashboard** — All 6 UI screens built with mock data:
  1. **Login page** (`/`) — Glassmorphism card, GitHub/Google/Email auth
  2. **Dashboard** (`/dashboard`) — Progress, Blockers, Risks, Team Activity cards + Activity Timeline
  3. **Activity Feed** (`/dashboard/activity`) — Filterable by source, category; search; status badges
  4. **Reports** (`/dashboard/reports`) — Report list table + detail preview panel
  5. **Teams** (`/dashboard/teams`) — Team cards with stats, radar chart, AI Smart Insight
  6. **Settings** (`/dashboard/settings`) — Integration cards (GitHub/Jira/Slack/CI-CD) + Webhook status table

---

## 🔲 Remaining — Phase 1 (MVP)

### Backend Services (Next Priority)
- [ ] **Integration Adapter Interface** (`src/lib/integrations/adapter.ts`)
  - Define `IntegrationAdapter` interface: `connect()`, `handleEvent()`, `poll()`, `disconnect()`
- [ ] **GitHub Adapter** (`src/lib/integrations/github.ts`)
  - Map: `pull_request.*` → Activity(pr), `push` → Activity(commit), `pull_request_review.*` → Activity(review)
- [ ] **Jira Adapter** (`src/lib/integrations/jira.ts`)
  - Map: `jira:issue_created/updated` → Activity(issue), sprint events → sprint metadata
- [ ] **Analytics Detectors** (`src/lib/analytics/detectors.ts`)
  - Stale PR detector (open > 48h, no review)
  - Blocked issue detector (status = blocked or no movement > 3 days)
  - Review delay detector (review requested > 24h ago)
  - Deploy frequency comparator
- [ ] **AI Summary Generator** (`src/lib/ai/`)
  - `provider.ts` — Multi-provider LLM abstraction (Gemini primary, OpenAI/Anthropic adapters)
  - `prompts.ts` — System/user prompt templates for report generation
  - `summary-generator.ts` — Pipeline: query activities → run detectors → build context → LLM call → parse sections
- [ ] **Activity Aggregator** (`src/lib/analytics/aggregator.ts`)
  - Group activities by category, team, time window
  - Calculate team velocity, PR throughput, review speed metrics

### API Routes
- [ ] `POST /api/webhooks/github` — Receive GitHub webhook payloads
- [ ] `POST /api/webhooks/jira` — Receive Jira webhook payloads
- [ ] `GET /api/activities` — List activities with filters (source, category, team, dateRange)
- [ ] `GET /api/reports` — List reports with filters
- [ ] `POST /api/reports/generate` — Trigger on-demand report generation
- [ ] `GET /api/teams` — List teams with stats
- [ ] `GET /api/integrations` — List integrations with status
- [ ] `POST /api/integrations` — Create/configure integration

### Wire UI to Real Data
- [ ] Replace mock data in all 6 dashboard pages with API calls
- [ ] Add loading states, error states, empty states
- [ ] Connect "Generate Report" button to `/api/reports/generate`

### Delivery Channels
- [ ] **Slack delivery** (`src/lib/delivery/slack.ts`) — Send report via Slack Incoming Webhook
- [ ] **Email delivery** (`src/lib/delivery/email.ts`) — Send report via email (Resend or Nodemailer)

### Seed Data
- [ ] Create `prisma/seed.ts` with realistic demo data for all models

---

## 🔲 Phase 2 — Enhanced Intelligence
- [ ] Slack message analysis (sentiment, blocker keywords)
- [ ] Blocker detection engine with auto-escalation
- [ ] PR review delay alerts
- [ ] Sprint velocity tracking and risk scoring
- [ ] Configurable alert thresholds per team

## 🔲 Phase 3 — AI Chat & Predictions
- [ ] Conversational Slack bot (Bolt framework)
- [ ] Natural language queries ("Which PRs are stuck?")
- [ ] Predictive delivery insights (completion probability)
- [ ] Engineering health metrics dashboard

---

## Architecture Notes

### Design Decisions Made
1. **SQLite for dev** — Zero-config, no Docker needed. Can swap to Postgres for production via Prisma.
2. **Gemini as primary LLM** — Multi-provider interface planned for easy swapping.
3. **Event-first architecture** — Webhooks push data in → normalize → store → analyze → summarize.
4. **Unified Activity model** — All tool events normalized to a single `Activity` table for cross-tool analytics.

### Key Files to Know
| File | What it does |
|---|---|
| `prisma/schema.prisma` | Database schema — start here to understand the data model |
| `src/lib/db.ts` | Prisma client singleton |
| `src/app/dashboard/layout.tsx` | Sidebar + header shell for all dashboard pages |
| `src/app/dashboard/page.tsx` | Main dashboard with summary cards |
| `src/app/globals.css` | Design system (glass cards, animations, buttons) |

### Design System Tokens
| Token | Value |
|---|---|
| Primary | `#a413ec` |
| Background | `#0f1117` |
| Card | `#1a1d27` |
| Font | Inter |
| Glass effect | `rgba(164, 19, 236, 0.04)` + `backdrop-filter: blur(12px)` |

---

## How to Run

```bash
cd app
npm install
npx prisma migrate dev    # Apply database migrations
npm run dev               # http://localhost:3000
```

## How to Reset Database

```bash
cd app
npx prisma migrate reset  # Drops and recreates database
```
