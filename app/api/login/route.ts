import { Query, type Models } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

import bcrypt from "bcryptjs";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const usersTableID = process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return Response.json({ error: "Missing credentials" }, { status: 400 });
  }

  const response = await tablesDB.listRows(databaseID, usersTableID, [
    Query.equal("email", email),
  ]);

  if (response.total === 0) {
    return Response.json({ error: "Invalid credentials" }, { status: 404 });
  }

  const user = response.rows[0];

  const isValid = await bcrypt.compare(password, user.password);

  if (isValid) {
    return Response.json(
      { message: "Authentication successful" },
      { status: 200 },
    );
  } else {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
