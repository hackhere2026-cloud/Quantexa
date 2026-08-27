import { NextResponse } from "next/server";
import { getDbAsync, createTeam } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDbAsync();
    return NextResponse.json({
      success: true,
      teams: db.teams,
    });
  } catch (error) {
    console.error("Fetch Teams Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch teams." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, track, passcode, problemStatement, members } = body;

    if (!name || !passcode || !track) {
      return NextResponse.json(
        { success: false, message: "Name, passcode, and track are required." },
        { status: 400 }
      );
    }

    const db = await getDbAsync();
    const nextNum = db.teams.length + 101;
    const id = `QTX-${nextNum}`;
    const dbName = `quantexa_db_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

    const newTeam = await createTeam({
      id,
      name,
      passcode,
      track,
      leaderName: body.leaderName || "Team Leader",
      membersCount: body.membersCount || members || 4,
      memberList: body.memberList || [{ name: body.leaderName || "Team Leader", role: "Team Lead" }],
      problemStatement: problemStatement || "Assigned on Spot (Phase 03)",
      score: 0,
      status: "In Progress",
      dbName,
      dbStatus: "Connected",
      dbStorage: "10 GB SSD",
      dbHost: `db.quantexa.internal:${5430 + db.teams.length}`,
      submissionUrl: "",
    });

    return NextResponse.json({
      success: true,
      message: "New team created.",
      team: newTeam,
    });
  } catch (error) {
    console.error("Create Team Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create team." },
      { status: 500 }
    );
  }
}
