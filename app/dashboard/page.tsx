"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

function DashboardPage() {
  const [status, setStatus] = useState("stopped");
  const [time, setTime] = useState(0);

  function formatTime(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  async function startTimer() {
    try {
      const res = await fetch("api/timer/start_timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionTag: "study" }),
      });

      if (res.ok) {
        setStatus("running");
        const startTime = await res.json();
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
      } else {
        alert("Error ending the timer.");
        window.location.reload();
      }
    } catch (error) {
      alert("Error ending the timer.");
      console.log("Error message: " + error);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <div className="justify-center text-center">
        <p className="my-8 text-5xl tracking-wider font-semibold">
          {formatTime(time)}
        </p>
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
