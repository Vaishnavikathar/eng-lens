import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// POST /api/seed — Seeds the database with demo data
// This is a development-only endpoint
export async function POST() {
  try {
    // Check if database is already seeded
    const existingOrg = await prisma.organization.findFirst();
    if (existingOrg) {
      return NextResponse.json({
        message: "Database already seeded. Delete dev.db and re-migrate to reseed.",
      });
    }

    console.log("🌱 Seeding database...");

    // Organization
    const org = await prisma.organization.create({
      data: { name: "EngLens Team", slug: "englens-team" },
    });

    // Users with hashed passwords
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
      const user = await prisma.user.create({
        data: { ...u, passwordHash, orgId: org.id },
      });
      users.push(user);
    }

    // Teams
    const backendTeam = await prisma.team.create({
      data: { name: "Backend Team", slug: "backend", orgId: org.id },
    });
    const frontendTeam = await prisma.team.create({
      data: { name: "Frontend Team", slug: "frontend", orgId: org.id },
    });
    const mobileTeam = await prisma.team.create({
      data: { name: "Mobile Team", slug: "mobile", orgId: org.id },
    });

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
      await prisma.teamMember.create({ data: m });
    }

    // Activities
    const now = new Date();
    const h = 3600000;
    const d = 86400000;
    const activities = [
      { source: "github", category: "pr", status: "merged", title: "PR #892: Core payments engine refactor", teamId: backendTeam.id, userId: users[1].id, url: "https://github.com/englens/app/pull/892", externalCreatedAt: new Date(now.getTime() - 2 * h) },
      { source: "github", category: "pr", status: "merged", title: "PR #245: Add payment validation layer", teamId: backendTeam.id, userId: users[1].id, externalCreatedAt: new Date(now.getTime() - 3 * h) },
      { source: "jira", category: "issue", status: "done", title: "EL-204: Fix CSS layout bug on dashboard", teamId: frontendTeam.id, userId: users[3].id, externalCreatedAt: new Date(now.getTime() - 4 * h) },
      { source: "cicd", category: "deploy", status: "done", title: "Deployment: Staging v2.4.0-rc1 successful", teamId: backendTeam.id, externalCreatedAt: new Date(now.getTime() - d) },
      { source: "github", category: "review", status: "open", title: "Review Requested on PR #901", teamId: mobileTeam.id, userId: users[4].id, externalCreatedAt: new Date(now.getTime() - 26 * h) },
      { source: "github", category: "pr", status: "open", title: "PR #248: Refactor authentication middleware", teamId: backendTeam.id, userId: users[5].id, externalCreatedAt: new Date(now.getTime() - 28 * h) },
      { source: "jira", category: "issue", status: "open", title: "PROJ-189: Fix login timeout on mobile safari", teamId: frontendTeam.id, userId: users[3].id, externalCreatedAt: new Date(now.getTime() - 5 * h) },
      { source: "jira", category: "issue", status: "blocked", title: "CORE-442: API rate limiting implementation", teamId: backendTeam.id, userId: users[4].id, externalCreatedAt: new Date(now.getTime() - 30 * h) },
      { source: "github", category: "commit", status: "done", title: "Commit: Update readme documentation", teamId: backendTeam.id, userId: users[2].id, externalCreatedAt: new Date(now.getTime() - 2 * d) },
      { source: "github", category: "pr", status: "merged", title: "PR #242: Infrastructure as code for GCP", teamId: backendTeam.id, userId: users[1].id, externalCreatedAt: new Date(now.getTime() - 50 * h) },
      { source: "jira", category: "issue", status: "open", title: "BUG-104: Memory leak in worker processes", teamId: backendTeam.id, userId: users[3].id, externalCreatedAt: new Date(now.getTime() - 3 * d) },
      { source: "github", category: "pr", status: "merged", title: "PR #230: Mobile auth flow improvements", teamId: mobileTeam.id, userId: users[4].id, externalCreatedAt: new Date(now.getTime() - 80 * h) },
      { source: "cicd", category: "deploy", status: "done", title: "Deployment: Production v2.3.8 rollout", teamId: backendTeam.id, externalCreatedAt: new Date(now.getTime() - 4 * d) },
      { source: "github", category: "pr", status: "merged", title: "PR #228: Database connection pooling", teamId: backendTeam.id, userId: users[0].id, externalCreatedAt: new Date(now.getTime() - 100 * h) },
      { source: "jira", category: "issue", status: "done", title: "UI-78: Dark mode toggle improvements", teamId: frontendTeam.id, userId: users[2].id, externalCreatedAt: new Date(now.getTime() - 110 * h) },
    ];
    for (const a of activities) {
      await prisma.activity.create({ data: a });
    }

    // Reports
    const r1 = await prisma.report.create({
      data: {
        teamId: mobileTeam.id, type: "sprint",
        summaryMd: "Sprint 42 completed with 89% velocity. Auth flow integrated across iOS and Android.",
        periodStart: new Date(now.getTime() - 14 * d), periodEnd: new Date(now.getTime() - d),
      },
    });
    await prisma.reportSection.createMany({
      data: [
        { reportId: r1.id, category: "progress", contentMd: "Completed 85% of v1.2 RC.\nIntegrated auth flow across iOS/Android.\nOptimized image caching, -40% latency.", sortOrder: 0 },
        { reportId: r1.id, category: "blockers", contentMd: "Payment provider sandbox unstable — 12h delay.", sortOrder: 1 },
        { reportId: r1.id, category: "risks", contentMd: "12 high-priority bugs open with release approaching.", sortOrder: 2 },
      ],
    });

    const r2 = await prisma.report.create({
      data: {
        teamId: backendTeam.id, type: "daily",
        summaryMd: "API migration for v3 endpoints. 6 PRs merged today.",
        periodStart: new Date(now.getTime() - d), periodEnd: now,
      },
    });
    await prisma.reportSection.createMany({
      data: [
        { reportId: r2.id, category: "progress", contentMd: "Migrated 4 endpoints to v3.\n6 PRs merged.\nDB connection pooling deployed.", sortOrder: 0 },
        { reportId: r2.id, category: "blockers", contentMd: "Checkout feature waiting for DB migration approval.", sortOrder: 1 },
      ],
    });

    await prisma.report.create({
      data: {
        teamId: frontendTeam.id, type: "daily",
        summaryMd: "UI library v4.0. Dashboard responsiveness fixes.",
        periodStart: new Date(now.getTime() - 2 * d), periodEnd: new Date(now.getTime() - d),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      accounts: [
        "renuka@englens.dev (admin) – password: password123",
        "sarah@englens.dev – password: password123",
        "alex@englens.dev – password: password123",
      ],
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
