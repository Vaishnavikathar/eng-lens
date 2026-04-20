import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const category = searchParams.get("category");

    // Build filters
    const where: Record<string, unknown> = {};
    if (source && source !== "all") where.source = source;
    if (category && category !== "all") {
      const catMap: Record<string, string> = {
        prs: "pr",
        commits: "commit",
        issues: "issue",
        deployments: "deploy",
      };
      if (catMap[category]) where.category = catMap[category];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { name: true } },
        team: { select: { name: true } },
      },
    });

    return NextResponse.json({
      activities: activities.map((a) => ({
        id: a.id,
        source: a.source,
        sourceLabel: a.source === "cicd" ? "CI" : a.source === "github" ? "GH" : a.source.toUpperCase(),
        type: a.category,
        title: a.title,
        author: a.user?.name || "System",
        team: a.team?.name || "—",
        time: formatRelativeTime(a.createdAt),
        status: a.status.toUpperCase().replace("_", " "),
        url: a.url,
      })),
    });
  } catch (error) {
    console.error("Activity error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
