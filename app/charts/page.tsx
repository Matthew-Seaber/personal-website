import fs from "fs";
import path from "path";
import Papa from "papaparse";

import ChartsTable from "@/components/charts/ChartsTable";

type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  date_added: string;
  duration: string;
  image_address: string;
  spotify_link_id: string;
};

function ChartsPage() {
  const songDataPath = path.join(process.cwd(), "data/songs.csv");
  const file = fs.readFileSync(songDataPath, "utf-8");

  const { data } = Papa.parse(file, {
    header: true,
  }) as { data: Song[] };

  return (
    <div>
      <h1 className="text-4xl font-semibold font-jakarta">THE CHARTS</h1>
      <p className="mt-3 text-muted-foreground">
        These are my current favourite songs. Click the songs below to open them on Spotify!
      </p>

      <ChartsTable data={data} />
    </div>
  );
}

export default ChartsPage;
