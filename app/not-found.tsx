import { Button } from "@/components/ui/button";
import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>

      <p>It seems the page you&apos;re looking for doesn&apos;t exist.</p>

      <Button asChild size="lg" className="mt-4 px-8">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}

export default NotFoundPage;
