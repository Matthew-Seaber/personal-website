import { Query } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";

const databaseID = process.env.APPWRITE_DATABASE_ID!;
const usersTableID = process.env.APPWRITE_USERS_TABLE_ID!;
const sessionsTableID = process.env.APPWRITE_SESSIONS_TABLE_ID!;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return Response.json({ error: "Missing credentials" }, { status: 400 });
  }

  const response = await tablesDB.listRows(databaseID, usersTableID, [
    Query.equal("email", email),
  ]);

  if (response.total === 0) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = response.rows[0];

  const isValid = await bcrypt.compare(password, user.password);

  if (isValid) {
    const res = NextResponse.json({ message: "Login successful" });

    const token = crypto.randomUUID();
    const cookieAge = 1000 * 60 * 60 * 24 * 14; // 14 days
    const expiryDate = new Date(Date.now() + cookieAge);

    await tablesDB.upsertRow(databaseID, sessionsTableID, user.$id, {
      token: token,
      expiryDate: expiryDate.toISOString()
    });

    res.cookies.set({
      name: "sessionCookie",
      value: token,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: cookieAge / 1000,
      sameSite: "lax",
    });

    return res;
  } else {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
