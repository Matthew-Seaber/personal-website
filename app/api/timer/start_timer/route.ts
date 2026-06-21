import { ID, tablesDB } from "@/lib/appwrite";

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkAuth } from "@/lib/auth";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const timerSessionsTableID =
  process.env.NEXT_PUBLIC_APPWRITE_TIMER_SESSIONS_TABLE_ID!;

export async function POST(req: NextRequest) {
  const { sessionTag } = await req.json();

  try {
    const userAuthorised = await checkAuth(req);

    if (userAuthorised) {
      const startTime = new Date();

      await tablesDB.createRow({
        databaseId: databaseID,
        tableId: timerSessionsTableID,
        rowId: ID.unique(),
        data: {
          start_time: startTime,
          end_time: null,
          active: true,
          tag: sessionTag,
        },
      });

      return NextResponse.json({ startTime });
    } else {
      return NextResponse.json(
        { error: "User unauthorised to make this request" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.log("Error: " + error);
    return NextResponse.json(
      { error: "Error starting session" },
      { status: 500 },
    );
  }
}
