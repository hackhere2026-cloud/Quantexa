import { NextResponse } from "next/server";
import { updateTeamSubmission } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      teamId,
      gitRepoUrl,
      projectFileUrl,
      projectFileName,
      demoVideoUrl,
      submissionUrl,
      isTrackRevealed,
    } = body;

    if (!teamId) {
      return NextResponse.json(
        { success: false, message: "Team ID is required." },
        { status: 400 }
      );
    }

    let updatedTeam;
    try {
      updatedTeam = await updateTeamSubmission(teamId, {
        gitRepoUrl,
        projectFileUrl,
        projectFileName,
        demoVideoUrl,
        submissionUrl,
        isTrackRevealed,
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message || "Database sync failed." },
        { status: 500 }
      );
    }

    if (!updatedTeam) {
      return NextResponse.json(
        { success: false, message: "Team not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Git repository link and project presentation saved successfully!",
      team: updatedTeam,
    });
  } catch (error: any) {
    console.error("Submission Error:", error);
    return NextResponse.json(
      { success: false, message: `Failed to process project submission: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
