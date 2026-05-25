import { Query } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

import { NextResponse } from "next/server";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const timerSessionsTableID = process.env.NEXT_PUBLIC_APPWRITE_TIMER_SESSIONS_TABLE_ID!;

export async function GET() {
  try {
    let timerStatus = "stopped";
    let currentSessionTag = null;
    let startTime = null;
    let baseTime = 0;

    const activeSessions = await tablesDB.listRows(
      databaseID,
      timerSessionsTableID,
      [Query.equal("active", true)],
    );

    const activeSession = activeSessions.rows[0];

    if (activeSession) {
      timerStatus = "running";
      currentSessionTag = activeSession.tag;
      startTime = activeSession.start_time;
    } else {
      timerStatus = "stopped";
      startTime = null;
    }

    const previousSessions = await tablesDB.listRows(
      databaseID,
      timerSessionsTableID,
      [
        Query.equal("active", false),
        Query.greaterThanEqual(
          "start_time",
          new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        ),
      ],
    );

    if (previousSessions.total > 0) {
      for (const session of previousSessions.rows) {
        const sessionStartTime = new Date(session.start_time).getTime();
        const sessionEndTime = new Date(session.end_time).getTime();
        const duration = Math.floor((sessionEndTime - sessionStartTime) / 1000);

        baseTime += duration;
      }
    } else {
      baseTime = 0;
    }

    return NextResponse.json({
      timerStatus,
      currentSessionTag,
      startTime,
      baseTime,
    });
  } catch (error) {
    console.log("Error: " + error);
    return NextResponse.json(
      { error: "Error fetching session data" },
      { status: 500 },
    );
  }
}
