import Link from "next/link";
import { Button } from "../ui/button";

function Navbar() {
  return (
    <nav className="w-full max-w-6xl border rounded-4xl sticky mx-auto top-2 px-4 z-2 bg-background/80 backdrop-blur-md">
      <div className="p-4 flex flex-wrap justify-between items-center gap-4">
        <Link href="/" className="hover:opacity-75">
          <h1 className="font-jakarta text-xl font-bold tracking-tighter">
            MATTHEW SEABER
          </h1>
        </Link>
        <div className="hidden sm:flex">
          <Link href="/charts" className="hover:opacity-75">
            Charts
          </Link>
        </div>
        <Button asChild size="lg">
          <Link href="/contact" target="_blank" rel="noopener noreferrer">
            Contact
          </Link>
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
