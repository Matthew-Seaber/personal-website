import { Query } from "appwrite";
import { tablesDB } from "@/lib/appwrite";

import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const linksTableID = process.env.NEXT_PUBLIC_APPWRITE_LINKS_TABLE_ID!;

interface Props {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;
  let success = false;
  let destination = "";

  try {
    const links = await tablesDB.listRows(databaseID, linksTableID, [
      Query.equal("code", code),
    ]);

    if (!links || links.total === 0) {
      success = false;
    }

    destination = links.rows[0].destination;
    success = true;
  } catch (error) {
    console.log(error);
    success = false;
  }

  if (!success) {
    return (
      <div className="min-h-[20vh] flex flex-col items-center justify-center text-center gap-2">
        <Link href="/">
          <h1 className="text-2xl md:text-4xl font-bold font-jakarta tracking-tighter text-center select-none hover:text-shadow-lg hover:text-shadow-grey-600 transition-all duration-300 mb-14">
            MATTHEW SEABER
          </h1>
        </Link>

        <h1 className="font-semibold text-foreground">Invalid Short URL</h1>
        <p>Please check the URL carefully for any errors.</p>

        <Button asChild size="lg" className="mt-4 px-8">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  } else {
    redirect(destination);
  }
}
