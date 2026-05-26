"use client";

import { client } from "@/lib/appwrite-client";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

function PublicTimer() {
  const [status, setStatus] = useState("stopped");
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [baseTime, setBaseTime] = useState(0);
  const [sessionTag, setSessionTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const timerSessionsTableID =
    process.env.NEXT_PUBLIC_APPWRITE_TIMER_SESSIONS_TABLE_ID!;

  function formatTime(timeInSeconds: number) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor(timeInSeconds / 60) % 60;
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  async function getTimerData() {
    try {
      const res = await fetch("api/timer/get_time", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(data.timerStatus);
        setSessionTag(data.currentSessionTag);
        setBaseTime(data.baseTime);
        setTime(data.baseTime);
        setStartTime(
          data.startTime ? new Date(data.startTime).getTime() : null,
        );

        setLoading(false);
      } else {
        alert("Error fetching timer data.");
      }
    } catch (error) {
      alert("Error fetching timer data.");
      console.log("Error message: " + error);
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === "running" && startTime) {
      interval = setInterval(() => {
        const currentElapsedTime = Math.floor((Date.now() - startTime) / 1000);

        setTime(baseTime + currentElapsedTime);
      }, 1000);
    } else {
      return;
    }

    return () => clearInterval(interval);
  }, [status, startTime, baseTime]);

  useEffect(() => {
    const pageLoad = async () => {
      await getTimerData();
    };

    pageLoad();
  }, []);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${databaseID}.collections.${timerSessionsTableID}.documents`,
      async (response) => {
        console.log(response);
        await getTimerData();
      },
    );

    return () => unsubscribe();
  }, [databaseID, timerSessionsTableID]);

  return (
    <div className="justify-center text-center">
      {loading ? (
        <Skeleton className="w-60 h-16 mt-4 mx-auto" />
      ) : (
        <p
          className={`mt-4 text-7xl h-16 tracking-wider font-semibold tabular-nums ${status === "running" ? "text-orange-400" : ""}`}
        >
          {formatTime(time)}
        </p>
      )}

      <div className="my-3">
        {sessionTag ? (
          <p className="capitalize">{sessionTag}ing</p>
        ) : (
          <p>Study time today</p>
        )}
      </div>
    </div>
  );
}

export default PublicTimer;
