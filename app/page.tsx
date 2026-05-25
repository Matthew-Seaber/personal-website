import PublicTimer from "@/components/timer/PublicTimer";

export default function Home() {
  return (
    <div className="flex items-center justify-center gap-12 flex-col">
      <h1 className="text-2xl md:text-4xl font-bold font-jakarta tracking-tighter text-center select-none hover:text-shadow-lg hover:text-shadow-grey-600 transition-all duration-300">
        MATTHEW SEABER
      </h1>

      <PublicTimer />

      <div>
        <a href="/charts" className="mt-2 text-lg font-medium underline">
          check out my current favourite songs here
        </a>
      </div>
    </div>
  );
}
