import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      orderBy: { generatedAt: "desc" },
      take: 20,
      include: {
        team: { select: { name: true } },
        reportSections: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({
      reports: reports.map((r) => ({
        id: r.id,
        date: r.generatedAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        type: r.type.charAt(0).toUpperCase() + r.type.slice(1),
        team: r.team?.name || "All Teams",
        summary: r.summaryMd || "",
        sections: r.reportSections.map((s) => ({
          category: s.category,
          content: s.contentMd,
        })),
        periodStart: r.periodStart,
        periodEnd: r.periodEnd,
      })),
    });
  } catch (error) {
    console.error("Reports error:", error);
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
    const { teamId, type } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    // 🔥 Dynamic simulated data
    const prsMerged = Math.floor(Math.random() * 20);
    const issuesClosed = Math.floor(Math.random() * 15);
    const blockers = Math.floor(Math.random() * 5);

    // 🔥 Smart summary generation
    let summary = "";

    if (blockers > 3) {
      summary = `Team is facing challenges with ${blockers} active blockers. Immediate attention required.`;
    } else if (prsMerged > 10) {
      summary = `High productivity observed with ${prsMerged} PRs merged and ${issuesClosed} issues resolved.`;
    } else {
      summary = `Steady progress with ${prsMerged} PRs merged and ${issuesClosed} issues completed.`;
    }

    const report = await prisma.report.create({
      data: {
        teamId: teamId || null,
        type,
        summaryMd: summary,
        periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000),
        periodEnd: new Date(),

        reportSections: {
          create: [
            {
              category: "Progress",
              contentMd: `${prsMerged} PRs merged, ${issuesClosed} issues completed.`,
              sortOrder: 1,
            },
            {
              category: "Blockers",
              contentMd:
                blockers > 0
                  ? `${blockers} blockers slowing down progress.`
                  : "No blockers.",
              sortOrder: 2,
            },
            {
              category: "Risks",
              contentMd:
                blockers > 2
                  ? "High risk due to blockers."
                  : "Low risk, stable progress.",
              sortOrder: 3,
            },
          ],
        },
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Create report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
