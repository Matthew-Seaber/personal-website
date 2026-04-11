import fs from "fs";
import path from "path";
import Papa from "papaparse";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock3 } from "lucide-react";

type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  date_added: string;
  duration: string;
  image_address: string;
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

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>Date added</TableHead>
            <TableHead>
              <Clock3 className="w-4 h-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((song: Song, id) => (
            <TableRow key={song.id} className="hover:bg-muted/50 transition">
              <TableCell>{id + 1}</TableCell>
              <TableCell className="font-semibold">
                <div className="flex items-center gap-3">
                  <Image
                    src={`/${song.image_address}`}
                    width={50}
                    height={50}
                    alt={"Album cover for " + song.album}
                    className="rounded-md object-cover"
                  />
                  {song.title}
                </div>
              </TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>{song.album}</TableCell>
              <TableCell>{song.date_added}</TableCell>
              <TableCell>{song.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ChartsPage;
