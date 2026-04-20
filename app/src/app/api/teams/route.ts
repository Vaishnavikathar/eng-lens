import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { orgId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const teams = await prisma.team.findMany({
      where: { orgId: user.orgId },
      include: {
        members: {
          include: {
            user: { select: { name: true } },
          },
        },
        _count: {
          select: { activities: true },
        },
      },
    });

    // Calculate weekly stats for each team
    const teamsWithStats = await Promise.all(
      teams.map(async (team) => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const [prsWeekly, issuesClosed, blockers] = await Promise.all([
          prisma.activity.count({
            where: { teamId: team.id, category: "pr", status: "merged", createdAt: { gte: weekAgo } },
          }),
          prisma.activity.count({
            where: { teamId: team.id, category: "issue", status: "done", createdAt: { gte: weekAgo } },
          }),
          prisma.activity.count({
            where: { teamId: team.id, status: "blocked" },
          }),
        ]);

        const totalActivity = await prisma.activity.count({
          where: { teamId: team.id, createdAt: { gte: weekAgo } },
        });

        return {
          id: team.id,
          name: team.name,
          slug: team.slug,
          members: team.members.length,
          initials: team.members.slice(0, 4).map((m) =>
            m.user.name
              .split(" ")
              .map((w) => w[0])
              .join("")
          ),
          prsWeekly,
          issuesClosed,
          blockers,
          trend: totalActivity >= 3 ? "up" : "down",
          status: blockers >= 3 ? "AT RISK" : totalActivity >= 3 ? "ACTIVE" : "ON TRACK",
        };
      })
    );

    return NextResponse.json({ teams: teamsWithStats });
  } catch (error) {
    console.error("Teams error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { orgId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        slug,
        orgId: user.orgId,
      },
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
