import { Query } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkAuth } from "@/lib/auth";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const timerSessionsTableID = process.env.NEXT_PUBLIC_APPWRITE_TIMER_SESSIONS_TABLE_ID!;

export async function POST(req: NextRequest) {
  try {
    const userAuthorised = await checkAuth(req);

    if (userAuthorised) {
      const sessions = await tablesDB.listRows(
        databaseID,
        timerSessionsTableID,
        [Query.equal("active", true)],
      );

      const session = sessions.rows[0];

      if (session) {
        await tablesDB.updateRow(
          databaseID,
          timerSessionsTableID,
          session.$id,
          {
            end_time: new Date(),
            active: false,
          },
        );

        return NextResponse.json(
          { message: "Successfully ended session" },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          { error: "No active session found" },
          { status: 404 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "User unauthorised to make this request" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.log("Error: " + error);
    return NextResponse.json(
      { error: "Error ending session" },
      { status: 500 },
    );
  }
}
