import { NextResponse } from "next/server";
import { authenticateAdmin, getDbAsync } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const passkey = body.passkey || body.password || "";
    const username = body.username || body.id || "";

    if (!passkey) {
      return NextResponse.json(
        { success: false, message: "Admin password/passkey is required." },
        { status: 400 }
      );
    }

    const isValid = await authenticateAdmin(passkey, username);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid Admin Credentials." },
        { status: 401 }
      );
    }

    const db = await getDbAsync();

    return NextResponse.json({
      success: true,
      message: "Admin authenticated successfully.",
      teams: db.teams,
    });
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Server authentication error." },
      { status: 500 }
    );
  }
}
