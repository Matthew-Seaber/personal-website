import { ID, tablesDB } from "@/lib/appwrite";

import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkAuth } from "@/lib/auth";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const linksTableID = process.env.NEXT_PUBLIC_APPWRITE_LINKS_TABLE_ID!;

export async function POST(req: NextRequest) {
  const { url, code } = await req.json();

  try {
    const userAuthorised = await checkAuth(req);

    if (userAuthorised) {
      let finalCode = "";

      if (!code) {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (let i = 0; i < 5; i++) {
          finalCode += characters.charAt(Math.floor(Math.random() * 52));
        }
      } else {
        finalCode = code;
      }

      await tablesDB.createRow(databaseID, linksTableID, ID.unique(), {
        code: finalCode,
        destination: url,
      });

      return NextResponse.json({ message: "Quick link created successfully" });
    } else {
      return NextResponse.json(
        { error: "User unauthorised to make this request" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.log("Error: " + error);
    return NextResponse.json(
      { error: "Failed to create quick link" },
      { status: 500 },
    );
  }
}
