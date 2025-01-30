"use client";

import { Room } from "@/app/api/music/sonos/utils";
import { useState, useEffect, Fragment } from "react";

export default function VolumeController({ room }: { room: Room }) {
  const [volume, setVolume] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      const response = await fetch("/api/music/sonos/getStatus");
      const data = await response.json();
      setVolume(data.data.state.volume);
      setIsLoading(false);
    };

    fetchStatus();
  }, []);

  const handleUpdateVolume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch("/api/music/sonos/setVolume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room,
          volume: newVolume,
        }),
      });

      const data = await response.json();

      console.log({ data });

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
      <input
        type="range"
        value={volume}
        onInput={handleUpdateVolume}
        min={0}
        max={100}
      />

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Fragment>
  );
}
