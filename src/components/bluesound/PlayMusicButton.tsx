"use client";

import { Room } from "@/app/api/music/sonos/utils";
import { useState, useEffect, Fragment } from "react";

export default function PlayMusicButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      const response = await fetch("/api/music/bluesound/getStatus");
      const data = await response.json();
      console.log({ data });
      setIsPlaying(data.data.isPlaying);
      setIsLoading(false);
    };

    fetchStatus();
  }, []);

  const handlePlayMusic = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch("/api/music/bluesound/toggleRoom");

      const data = await response.json();

      setIsPlaying(data.data.isPlaying);

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
        {/* Toggle Music */}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Fragment>
  );
}
