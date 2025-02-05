"use client";

import { Room } from "@/app/api/music/sonos/utils";
import { Fragment, useState } from "react";

export default function VolumeController({
  room,
  volume,
  setVolume,
}: {
  room: Room;
  volume: number;
  setVolume: (volume: number) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleUpdateVolume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newVolume = Number(e.target.value);
      setVolume(newVolume);
      setError(null);
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

      if (!data.success) {
        throw new Error(data.error || "Failed to play music");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
