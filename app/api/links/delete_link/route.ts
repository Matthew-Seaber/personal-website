import { Query } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkAuth } from "@/lib/auth";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const linksTableID = process.env.NEXT_PUBLIC_APPWRITE_LINKS_TABLE_ID!;

export async function DELETE(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter " },
      { status: 400 },
    );
  }

  try {
    const userAuthorised = await checkAuth(req);

    if (userAuthorised) {
      await tablesDB.deleteRows({
        databaseId: databaseID,
        tableId: linksTableID,
        queries: [Query.equal("code", code)],
      });

      return NextResponse.json(
        { message: "Quick link deleted successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "User unauthorised to make this request" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete quick link: ${error}` },
      { status: 500 },
    );
  }
}
