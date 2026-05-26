import { Query } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

import { NextRequest } from "next/server";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const sessionsTableID = process.env.APPWRITE_SESSIONS_TABLE_ID!;

export async function checkAuth(req: NextRequest) {
  const sessionCookie = req.cookies.get("sessionCookie");

  if (!sessionCookie) {
    return false;
  }

  try {
    const response = await tablesDB.listRows(databaseID, sessionsTableID, [
      Query.equal("token", sessionCookie.value),
    ]);

    if (response.total === 0) {
      return false;
    }

    const session = response.rows[0];

    if (new Date(session.expiryDate) < new Date()) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log("Authentication error:", error);
    return false;
  }
}
