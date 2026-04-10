"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar";

export default function PageConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const excludedPages = ["/"];
  const isExcludedPage = excludedPages.includes(pathname);

  if (isExcludedPage) {
    return (
      <>
        <main className="w-full max-w-6xl mx-auto px-6 py-10 flex-1">
          {children}
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full max-w-6xl mx-auto px-6 py-10 flex-1">
        {children}
      </main>
    </>
  );
}
