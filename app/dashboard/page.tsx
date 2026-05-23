"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

function DashboardPage() {
  const [status, setStatus] = useState("stopped");
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [baseTime, setBaseTime] = useState(0);
  const [loading, setLoading] = useState(true);

  function formatTime(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

  async function startTimer() {
    try {
      const res = await fetch("api/timer/start_timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionTag: "study" }),
      });

      if (res.ok) {
        setStatus("running");
        const data = await res.json();
        setStartTime(new Date(data.startTime).getTime());
      } else {
        alert("Error starting the timer.");
        window.location.reload();
      }
    } catch (error) {
      alert("Error starting the timer.");
      console.log("Error message: " + error);
    }
  }

  async function stopTimer() {
    try {
      const res = await fetch("api/timer/end_timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setStatus("stopped");
        const newBaseTime =
          baseTime + Math.floor((Date.now() - (startTime || 0)) / 1000);
        setStartTime(null);
        setBaseTime(newBaseTime);
        setTime(newBaseTime);
      } else {
        alert("Error ending the timer.");
        window.location.reload();
      }
    } catch (error) {
      alert("Error ending the timer.");
      console.log("Error message: " + error);
    }
  }

  useEffect(() => {
    const pageLoad = async () => {
      await getTimerData();
    };

    pageLoad();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <div className="justify-center text-center">
        {loading ? (
          <Skeleton className="w-48 h-12 my-8 mx-auto" />
        ) : (
          <p className="my-8 text-6xl h-12 tracking-wider font-semibold">
            {formatTime(time)}
          </p>
        )}
        {status === "stopped" && (
          <Button onClick={() => startTimer()}>Start session</Button>
        )}

        {status === "running" && (
          <Button onClick={() => stopTimer()}>End session</Button>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
