"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRight, Check, Link, Trash } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuickLink {
  code: string;
  destination: string;
  $createdAt: string;
}

function DashboardPage() {
  const [status, setStatus] = useState("stopped");
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [baseTime, setBaseTime] = useState(0);
  const [sessionTag, setSessionTag] = useState<string | null>("study");
  const [quickLinksData, setQuickLinksData] = useState<QuickLink[]>([]);
  const [newURL, setNewURL] = useState("");
  const [newURLCode, setNewURLCode] = useState("");
  const [showCheck, setShowCheck] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quickLinkLoading, setQuickLinkLoading] = useState(true);
  const [quickLinkCreateLoading, setQuickLinkCreateLoading] = useState(false);

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
        body: JSON.stringify({ sessionTag }),
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

  async function fetchExistingLinks() {
    try {
      const res = await fetch("api/links/get_links");

      if (res.ok) {
        const quickLinksData = await res.json();
        setQuickLinksData(quickLinksData.rows);
        setQuickLinkLoading(false);
      } else {
        alert("Error fetching existing quick links.");
      }
    } catch (error) {
      console.log("Error fetching existing quick links: " + error);
    }
  }

  async function handleShortenURL() {
    setQuickLinkCreateLoading(true);
    let finalURL = newURL.trim();

    if (!newURL.startsWith("https://")) {
      finalURL = "https://" + finalURL;
    }

    try {
      const res = await fetch("api/links/create_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: finalURL,
          code: newURLCode.trim() || null,
        }),
      });

      if (res.ok) {
        setNewURL("");
        setNewURLCode("");

        const newLink = await res.json();

        setQuickLinksData((prevData) => [newLink, ...prevData]);

        setShowCheck(true);
        setQuickLinkCreateLoading(false);
        setTimeout(() => {
          setShowCheck(false);
        }, 2000);
      } else {
        alert("Error shortening your URL.");

        setQuickLinkCreateLoading(false);
      }
    } catch (error) {
      console.log("URL shortening error: " + error);
      alert("Error shortening your URL.");

      setQuickLinkCreateLoading(false);
    }
  }

  async function handleDeleteLink(code: string) {
    try {
      const res = await fetch("api/links/delete_link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        setQuickLinksData((prevData) =>
          prevData.filter((link) => link.code !== code),
        );
      } else {
        alert("Error deleting quick link.");
      }
    } catch (error) {
      console.log("Error deleting quick link: " + error);
      alert("Error deleting quick link.");
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text: ", error);
      alert("Failed to copy link to clipboard.");
    }
  }

  useEffect(() => {
    const pageLoad = async () => {
      await getTimerData();
      await fetchExistingLinks();
    };

    pageLoad();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <div className="justify-center text-center">
        {loading ? (
          <Skeleton className="w-85 h-16 mt-8 mb-4 mx-auto" />
        ) : (
          <p className="mt-8 mb-4 text-7xl h-16 tracking-wider font-semibold tabular-nums">
            {formatTime(time)}
          </p>
        )}

        <div className="mb-6 flex justify-center">
          <Select
            onValueChange={(value) =>
              setSessionTag(value === "none" ? null : value)
            }
            disabled={status === "running"}
          >
            <SelectTrigger className="border-none capitalize">
              <SelectValue placeholder={sessionTag || "No tag"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No tag</SelectItem>
              <SelectItem value="study">Study</SelectItem>
              <SelectItem value="work">Work</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {status === "stopped" && (
          <Button onClick={() => startTimer()}>Start session</Button>
        )}

        {status === "running" && (
          <Button onClick={() => stopTimer()}>End session</Button>
        )}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-6">Quick Links</h3>
      <div className="gap-2 flex flex-col md:flex-row">
        <Input
          type="text"
          placeholder="Enter a URL to shorten..."
          value={newURL}
          onChange={(e) => setNewURL(e.target.value)}
          className="text-sm w-full max-w-md"
        />
        <Input
          type="text"
          placeholder="Enter quick link code (optional)..."
          value={newURLCode}
          onChange={(e) => setNewURLCode(e.target.value)}
          className="text-sm w-full max-w-md"
        />

        <Button
          disabled={!newURL.trim() || quickLinkCreateLoading === true}
          onClick={handleShortenURL}
          className="w-16"
        >
          {!quickLinkCreateLoading && !showCheck && <ArrowRight />}
          {quickLinkCreateLoading && <Spinner />}
          {showCheck && <Check />}
        </Button>
      </div>
      {quickLinkLoading === false ? (
        <>
          <h4 className="text-lg font-normal mt-6">Existing Links</h4>

          <div className="mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead />
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {quickLinksData.map(
                  (link: {
                    code: string;
                    destination: string;
                    $createdAt: string;
                  }) => (
                    <TableRow key={link.code}>
                      <TableCell>{link.code}</TableCell>
                      <TableCell>
                        {link.destination
                          .replace(/https?:\/\//, "")
                          .replace(/\/$/, "")}
                      </TableCell>
                      <TableCell title={link.$createdAt}>
                        {new Date(link.$createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          className="cursor-pointer"
                          onClick={() =>
                            copyToClipboard(
                              `https://matthewseaber.com/ql/${link.code}`,
                            )
                          }
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          className="cursor-pointer"
                          onClick={() => {
                            handleDeleteLink(link.code);
                          }}
                        >
                          <Trash className="h-4 w-4 text-red-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default DashboardPage;
