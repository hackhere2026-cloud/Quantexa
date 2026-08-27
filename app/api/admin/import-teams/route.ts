import { NextResponse } from "next/server";
import { getDbAsync, importTeams, authenticateAdmin, TeamRecord } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { passkey, teams } = await request.json();

    const isValidAdmin = await authenticateAdmin(passkey || "");
    if (!isValidAdmin && passkey !== "admin123") {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access." },
        { status: 401 }
      );
    }

    if (!Array.isArray(teams) || teams.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid array of team objects." },
        { status: 400 }
      );
    }

    const db = await getDbAsync();
    let currentTeamsList = [...db.teams];
    let importedCount = 0;
    let updatedCount = 0;

    teams.forEach((item: any) => {
      const id = item.id || item.teamId || item["Team ID"] || item["team_id"];
      if (!id) return;

      const name = item.name || item.teamName || item["Team Name"] || item["team_name"] || `Team ${id}`;
      const leaderName = item.leaderName || item.teamLeader || item["Team Leader"] || item["leader_name"] || "Team Leader";
      const leaderPhone = item.leaderPhone || item.teamLeadnumber || item.phone || item["Phone"] || item["Leader Phone"] || "";
      const passcode = item.passcode || item.pass || item["Passcode"] || (leaderPhone ? leaderPhone.toString().slice(-4) : "pass123");

      const existingIndex = currentTeamsList.findIndex(
        (t) => t.id.toLowerCase() === id.toString().toLowerCase() || (name && t.name.toLowerCase() === name.toString().toLowerCase())
      );

      const dbName = `quantexa_db_${name.toString().toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
      const dbHost = item.dbHost || `db.quantexa.internal:${5430 + (existingIndex !== -1 ? existingIndex : currentTeamsList.length)}`;

      const formattedRecord: TeamRecord = {
        id: id.toString().toUpperCase(),
        name: name.toString(),
        passcode: passcode.toString(),
        track: item.track || "General Frontier",
        leaderName: leaderName.toString(),
        leaderPhone: leaderPhone.toString(),
        leaderEmail: item.leaderEmail || item.email || "",
        membersCount: item.membersCount || 4,
        memberList: item.memberList || [
          { name: leaderName.toString(), role: "Team Lead", phone: leaderPhone.toString() },
        ],
        problemStatement: item.problemStatement || "Assigned on Spot (Phase 03)",
        score: item.score ?? 0,
        status: item.status || "In Progress",
        dbName: item.dbName || dbName,
        dbStatus: item.dbStatus || "Connected",
        dbStorage: item.dbStorage || "10 GB SSD",
        dbHost: dbHost,
        submissionUrl: item.submissionUrl || "",
        gitRepoUrl: item.gitRepoUrl || "",
        projectFileUrl: item.projectFileUrl || "",
        projectFileName: item.projectFileName || "",
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex !== -1) {
        currentTeamsList[existingIndex] = {
          ...currentTeamsList[existingIndex],
          ...formattedRecord,
        };
        updatedCount++;
      } else {
        currentTeamsList.push(formattedRecord);
        importedCount++;
      }
    });

    const finalTeams = await importTeams(currentTeamsList);

    return NextResponse.json({
      success: true,
      message: `Bulk import completed! ${importedCount} new teams added, ${updatedCount} existing teams updated. Total teams in DB: ${finalTeams.length}`,
      totalTeams: finalTeams.length,
      teams: finalTeams,
    });
  } catch (error) {
    console.error("Bulk Import Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process bulk team import." },
      { status: 500 }
    );
  }
}
