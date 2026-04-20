const { PrismaClient } = require("./src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Organization
  const org = await prisma.organization.upsert({
    where: { slug: "englens-team" },
    update: {},
    create: { name: "EngLens Team", slug: "englens-team" },
  });
  console.log("  ✓ Organization created");

  // Users
  const passwordHash = await bcrypt.hash("password123", 12);
  const userData = [
    { name: "Renuka Dhanawat", email: "renuka@englens.dev", role: "admin" },
    { name: "Sarah Chen", email: "sarah@englens.dev", role: "user" },
    { name: "Alex Rivera", email: "alex@englens.dev", role: "user" },
    { name: "Marcus Aurel", email: "marcus@englens.dev", role: "user" },
    { name: "Lena Volkov", email: "lena@englens.dev", role: "user" },
    { name: "Jamie Smith", email: "jamie@englens.dev", role: "user" },
  ];

  const users = [];
  for (const u of userData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash, orgId: org.id },
    });
    users.push(user);
  }
  console.log("  ✓ " + users.length + " users created (password: password123)");

  // Teams
  const backendTeam = await prisma.team.upsert({
    where: { orgId_slug: { orgId: org.id, slug: "backend" } },
    update: {},
    create: { name: "Backend Team", slug: "backend", orgId: org.id },
  });
  const frontendTeam = await prisma.team.upsert({
    where: { orgId_slug: { orgId: org.id, slug: "frontend" } },
    update: {},
    create: { name: "Frontend Team", slug: "frontend", orgId: org.id },
  });
  const mobileTeam = await prisma.team.upsert({
    where: { orgId_slug: { orgId: org.id, slug: "mobile" } },
    update: {},
    create: { name: "Mobile Team", slug: "mobile", orgId: org.id },
  });
  console.log("  ✓ 3 teams created");

  // Team Members
  const memberships = [
    { teamId: backendTeam.id, userId: users[0].id, role: "lead" },
    { teamId: backendTeam.id, userId: users[1].id, role: "member" },
    { teamId: backendTeam.id, userId: users[5].id, role: "member" },
    { teamId: frontendTeam.id, userId: users[2].id, role: "lead" },
    { teamId: frontendTeam.id, userId: users[3].id, role: "member" },
    { teamId: mobileTeam.id, userId: users[4].id, role: "lead" },
    { teamId: mobileTeam.id, userId: users[5].id, role: "member" },
  ];

  for (const m of memberships) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: m.teamId, userId: m.userId } },
      update: {},
      create: m,
    });
  }
  console.log("  ✓ Team memberships assigned");

  // Activities
  const now = new Date();
  const activities = [
    { source: "github", category: "pr", status: "merged", title: "PR #892: Core payments engine refactor", teamId: backendTeam.id, userId: users[1].id, url: "https://github.com/englens/app/pull/892", externalCreatedAt: new Date(now.getTime() - 2 * 3600000) },
    { source: "github", category: "pr", status: "merged", title: "PR #245: Add payment validation layer", teamId: backendTeam.id, userId: users[1].id, url: "https://github.com/englens/app/pull/245", externalCreatedAt: new Date(now.getTime() - 3 * 3600000) },
    { source: "jira", category: "issue", status: "done", title: "EL-204: Fix CSS layout bug on dashboard", teamId: frontendTeam.id, userId: users[3].id, externalCreatedAt: new Date(now.getTime() - 4 * 3600000) },
    { source: "cicd", category: "deploy", status: "done", title: "Deployment: Staging v2.4.0-rc1 successful", teamId: backendTeam.id, externalCreatedAt: new Date(now.getTime() - 24 * 3600000) },
    { source: "github", category: "review", status: "open", title: "Review Requested on PR #901", teamId: mobileTeam.id, userId: users[4].id, url: "https://github.com/englens/app/pull/901", externalCreatedAt: new Date(now.getTime() - 26 * 3600000) },
    { source: "github", category: "pr", status: "open", title: "PR #248: Refactor authentication middleware", teamId: backendTeam.id, userId: users[5].id, url: "https://github.com/englens/app/pull/248", externalCreatedAt: new Date(now.getTime() - 28 * 3600000) },
    { source: "jira", category: "issue", status: "open", title: "PROJ-189: Fix login timeout on mobile safari", teamId: frontendTeam.id, userId: users[3].id, externalCreatedAt: new Date(now.getTime() - 5 * 3600000) },
    { source: "jira", category: "issue", status: "blocked", title: "CORE-442: API rate limiting implementation", teamId: backendTeam.id, userId: users[4].id, externalCreatedAt: new Date(now.getTime() - 30 * 3600000) },
    { source: "github", category: "commit", status: "done", title: "Commit: Update readme documentation", teamId: backendTeam.id, userId: users[2].id, externalCreatedAt: new Date(now.getTime() - 48 * 3600000) },
    { source: "github", category: "pr", status: "merged", title: "PR #242: Infrastructure as code for GCP", teamId: backendTeam.id, userId: users[1].id, url: "https://github.com/englens/app/pull/242", externalCreatedAt: new Date(now.getTime() - 50 * 3600000) },
    { source: "jira", category: "issue", status: "open", title: "BUG-104: Memory leak in worker processes", teamId: backendTeam.id, userId: users[3].id, externalCreatedAt: new Date(now.getTime() - 72 * 3600000) },
    { source: "github", category: "pr", status: "merged", title: "PR #230: Mobile auth flow improvements", teamId: mobileTeam.id, userId: users[4].id, externalCreatedAt: new Date(now.getTime() - 80 * 3600000) },
    { source: "cicd", category: "deploy", status: "done", title: "Deployment: Production v2.3.8 rollout", teamId: backendTeam.id, externalCreatedAt: new Date(now.getTime() - 96 * 3600000) },
    { source: "github", category: "pr", status: "merged", title: "PR #228: Database connection pooling", teamId: backendTeam.id, userId: users[0].id, externalCreatedAt: new Date(now.getTime() - 100 * 3600000) },
    { source: "jira", category: "issue", status: "done", title: "UI-78: Dark mode toggle improvements", teamId: frontendTeam.id, userId: users[2].id, externalCreatedAt: new Date(now.getTime() - 110 * 3600000) },
  ];

  for (const a of activities) {
    await prisma.activity.create({ data: a });
  }
  console.log("  ✓ " + activities.length + " activities created");

  // Reports
  const report1 = await prisma.report.create({
    data: {
      teamId: mobileTeam.id, type: "sprint",
      summaryMd: "Sprint 42 completed with 89% velocity. Auth flow integrated across iOS and Android.",
      periodStart: new Date(now.getTime() - 14 * 86400000), periodEnd: new Date(now.getTime() - 86400000),
    },
  });
  await prisma.reportSection.createMany({
    data: [
      { reportId: report1.id, category: "progress", contentMd: "Completed 85% of the planned feature set for v1.2 RC.\nIntegrated new auth flow across iOS and Android.\nOptimized image caching logic, reducing latency by 40%.", sortOrder: 0 },
      { reportId: report1.id, category: "blockers", contentMd: "**Third-party API Downtime** — Payment provider sandbox unstable, delaying checkout integration testing for 12 hours.", sortOrder: 1 },
      { reportId: report1.id, category: "risks", contentMd: "Impending release date vs. QA bandwidth. Current bug backlog has 12 high-priority items still open.", sortOrder: 2 },
    ],
  });

  const report2 = await prisma.report.create({
    data: {
      teamId: backendTeam.id, type: "daily",
      summaryMd: "Completed API migration for v3 endpoints. 6 PRs merged today.",
      periodStart: new Date(now.getTime() - 86400000), periodEnd: now,
    },
  });
  await prisma.reportSection.createMany({
    data: [
      { reportId: report2.id, category: "progress", contentMd: "Migrated 4 API endpoints to v3 specification.\n6 pull requests merged including payments engine refactor.\nDatabase connection pooling optimization deployed.", sortOrder: 0 },
      { reportId: report2.id, category: "blockers", contentMd: "**Checkout feature** — Waiting for DB migration approval from DBA team.", sortOrder: 1 },
      { reportId: report2.id, category: "team_activity", contentMd: "PRs Merged: 6 | Commits: 23 | Code Reviews: 8 | Deploy: 1", sortOrder: 2 },
    ],
  });

  await prisma.report.create({
    data: {
      teamId: frontendTeam.id, type: "daily",
      summaryMd: "UI library updated to v4.0. Focus on dashboard responsiveness fixes.",
      periodStart: new Date(now.getTime() - 2 * 86400000), periodEnd: new Date(now.getTime() - 86400000),
    },
  });

  console.log("  ✓ 3 reports with sections created");
  console.log("\n✅ Seed complete!");
  console.log("\n📧 Demo accounts (all use password: password123):");
  console.log("   renuka@englens.dev (admin)");
  console.log("   sarah@englens.dev");
  console.log("   alex@englens.dev");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
