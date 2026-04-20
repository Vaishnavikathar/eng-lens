import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's org
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { orgId: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Aggregate stats
    const [
      totalPRsMerged,
      totalIssuesCompleted,
      totalActivities,
      recentActivities,
      teams,
      blockedActivities,
    ] = await Promise.all([
      // PRs merged this week
      prisma.activity.count({
        where: {
          category: "pr",
          status: "merged",
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      // Issues completed this week
      prisma.activity.count({
        where: {
          category: "issue",
          status: "done",
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      // Total activities
      prisma.activity.count(),
      // Recent timeline (last 10 events)
      prisma.activity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          team: { select: { name: true } },
        },
      }),
      // Teams with member counts
      prisma.team.findMany({
        where: { orgId: user.orgId },
        include: {
          _count: { select: { members: true, activities: true } },
        },
      }),
      // Blocked items
      prisma.activity.findMany({
        where: { status: "blocked" },
        include: {
          user: { select: { name: true } },
        },
      }),
    ]);

    // Team activity levels
    const teamActivity = await Promise.all(
      teams.map(async (team) => {
        const weeklyCount = await prisma.activity.count({
          where: {
            teamId: team.id,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        });
        const level =
          weeklyCount >= 5 ? "HIGH" : weeklyCount >= 2 ? "MEDIUM" : "LOW";
        const percent = Math.min(100, weeklyCount * 12);
        return {
          name: team.name,
          level,
          percent,
          memberCount: team._count.members,
        };
      })
    );

    return NextResponse.json({
      greeting: `Good ${getGreeting()}, ${user.name.split(" ")[0]}`,
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      progress: {
        prsMerged: totalPRsMerged,
        issuesCompleted: totalIssuesCompleted,
        totalActivities,
        feature: { name: "Payments API", progress: 70 },
      },
      blockers: blockedActivities.map((a) => ({
        title: a.title,
        assignee: a.user?.name || "Unassigned",
        initials: a.user?.name
          ? a.user.name
              .split(" ")
              .map((w) => w[0])
              .join("")
          : "??",
      })),
      risks: [
        {
          title: "Billing integration risk",
          severity: "CRITICAL",
          probability: 85,
          description: "Likely to miss Friday deadline (85% probability)",
        },
      ],
      teamActivity,
      timeline: recentActivities.map((a) => ({
        category: a.category,
        status: a.status,
        title: a.title,
        desc: a.team?.name || "",
        time: formatRelativeTime(a.createdAt),
        source: a.source,
      })),
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
