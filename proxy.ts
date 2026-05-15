import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { Query } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

const databaseID = process.env.APPWRITE_DATABASE_ID!;
const sessionsTableID = process.env.APPWRITE_SESSIONS_TABLE_ID!;

const protectedRoutes = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("sessionCookie");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = await tablesDB.listRows(databaseID, sessionsTableID, [
      Query.equal("token", sessionCookie.value),
    ]);

    if (response.total === 0) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = response.rows[0];

    if (new Date(session.expiryDate) < new Date()) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("sessionCookie");
      return response;
    } else {
      return NextResponse.next();
    }
  } catch (error) {
    console.log("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$|.*\\.css$|.*\\.js$|.*\\.json$).*)",
  ],
};
