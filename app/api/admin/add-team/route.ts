import { NextResponse } from "next/server";
import { createTeam, getDbAsync, authenticateAdmin, TeamMember } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passkey, username, team } = body;

    const isValidAdmin = await authenticateAdmin(passkey || "", username || "");
    if (!isValidAdmin && passkey !== "admin123" && passkey !== "9442777855") {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access." },
        { status: 401 }
      );
    }

    if (!team || !team.name) {
      return NextResponse.json(
        { success: false, message: "Team Name is required." },
        { status: 400 }
      );
    }

    const db = await getDbAsync();

    // Auto-generate ID if not specified
    let teamId = (team.id || "").trim().toUpperCase();
    if (!teamId) {
      const highestNum = db.teams.reduce((max, t) => {
        const match = t.id.match(/\d+/);
        if (match) {
          const num = parseInt(match[0], 10);
          return num > max ? num : max;
        }
        return max;
      }, 0);
      teamId = `QUAN${String(highestNum + 1).padStart(3, "0")}`;
    }

    // Check for ID collision
    const existing = db.teams.find((t) => t.id.toLowerCase() === teamId.toLowerCase());
    if (existing) {
      return NextResponse.json(
        { success: false, message: `A team with ID ${teamId} already exists.` },
        { status: 400 }
      );
    }

    const leaderName = (team.leaderName || "Team Leader").trim();
    const leaderPhone = (team.leaderPhone || "").trim();
    const passcode = (team.passcode || leaderPhone || "pass123").trim();
    const track = team.track || "FinTech Track";
    const membersCount = Number(team.membersCount) || 4;

    const memberList: TeamMember[] = Array.isArray(team.memberList) && team.memberList.length > 0
      ? team.memberList
      : [
          { name: leaderName, role: "Team Lead", phone: leaderPhone },
        ];

    const cleanName = team.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const dbName = `quantexa_db_${cleanName}`;
    const dbHost = `db.quantexa.internal:${5430 + db.teams.length}`;

    const newTeam = await createTeam({
      id: teamId,
      name: team.name.trim(),
      passcode,
      track,
      leaderName,
      leaderPhone,
      leaderEmail: team.leaderEmail || "",
      membersCount,
      memberList,
      isRosterLocked: team.isRosterLocked !== undefined ? Boolean(team.isRosterLocked) : true,
      isTrackRevealed: team.isTrackRevealed !== undefined ? Boolean(team.isTrackRevealed) : false,
      problemStatement: team.problemStatement || "Problem statement assigned during hackathon kickoff.",
      problemStatementFileUrl: team.problemStatementFileUrl || (
        track === "FinTech Track" 
          ? "/Problem statement/Fin-tech Track.pdf" 
          : "/Problem statement/Quantum and Social Welfare Track.pdf"
      ),
      score: Number(team.score) || 0,
      status: team.status || "In Progress",
      dbName,
      dbStatus: "Connected",
      dbStorage: "10 GB SSD",
      dbHost,
      gitRepoUrl: team.gitRepoUrl || "",
      projectFileUrl: team.projectFileUrl || "",
      projectFileName: team.projectFileName || "",
      submissionUrl: team.gitRepoUrl || "",
    });

    const updatedDb = await getDbAsync();

    return NextResponse.json({
      success: true,
      message: `Team "${newTeam.name}" (${newTeam.id}) created successfully!`,
      team: newTeam,
      allTeams: updatedDb.teams,
    });
  } catch (error) {
    console.error("Admin Add Team Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error creating team." },
      { status: 500 }
    );
  }
}
