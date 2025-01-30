"use client";

import { Room } from "@/app/api/music/sonos/utils";
import { useState, useEffect, Fragment } from "react";

export default function PlayMusicButton({ room }: { room: Room }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      const response = await fetch("/api/music/sonos/getStatus");
      const data = await response.json();
      setIsPlaying(data.data.state.state !== "paused");
      setIsLoading(false);
    };

    fetchStatus();
  }, [room]);

  const handlePlayMusic = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch("/api/music/sonos/toggleRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room,
          //   url: "https://traffic.libsyn.com/secure/thecsspodcast/TCP090_final.mp3?dest-id=1891556",
        }),
      });

      const data = await response.json();

      const newStatePlaying = data.data.state !== "paused";

      setIsPlaying(newStatePlaying);

      if (!data.success) {
        throw new Error(data.error || "Failed to play music");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <button onClick={handlePlayMusic} disabled={isLoading}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Fragment>
  );
}
