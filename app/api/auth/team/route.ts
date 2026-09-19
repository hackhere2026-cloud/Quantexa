import { NextResponse } from "next/server";
import { authenticateTeam } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { teamId, passcode } = await request.json();

    if (!teamId || !passcode) {
      return NextResponse.json(
        { success: false, message: "Team ID and passcode are required." },
        { status: 400 }
      );
    }

    const team = await authenticateTeam(teamId, passcode);

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Invalid Team ID/Name or Passcode." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Team authenticated successfully.",
      team,
    });
  } catch (error) {
    console.error("Team Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Server authentication error." },
      { status: 500 }
    );
  }
}
