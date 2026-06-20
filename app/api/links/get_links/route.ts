import { Query } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkAuth } from "@/lib/auth";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const linksTableID = process.env.NEXT_PUBLIC_APPWRITE_LINKS_TABLE_ID!;

export async function GET(req: NextRequest) {
  try {
    const userAuthorised = await checkAuth(req);

    if (userAuthorised) {
      const links = await tablesDB.listRows(databaseID, linksTableID, [
        Query.orderDesc("$createdAt"),
      ]);

      return NextResponse.json(links);
    } else {
      return NextResponse.json(
        { error: "User unauthorised to make this request" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.log("Error: " + error);
    return NextResponse.json(
      { error: "Failed to fetch quick links" },
      { status: 500 },
    );
  }
}
