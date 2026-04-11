"use client";

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
  spotify_link_id: string;
};

function ChartsTable({ data }: { data: Song[] }) {
  return (
    <div className="mt-8 p-2 rounded-2xl border">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-neutral-200 hover:bg-transparent">
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
            <TableRow
              key={song.id}
              className="border-b border-neutral-100 hover:bg-muted/50 transition cursor-pointer"
              onClick={() =>
                window.open(
                  `https://open.spotify.com/track/${song.spotify_link_id}`,
                  "_blank",
                )
              }
            >
              <TableCell>{id + 1}</TableCell>
              <TableCell className="font-semibold">
                <div className="flex items-center min-w-50 gap-3">
                  <Image
                    src={`/${song.image_address}`}
                    width={40}
                    height={40}
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

export default ChartsTable;
