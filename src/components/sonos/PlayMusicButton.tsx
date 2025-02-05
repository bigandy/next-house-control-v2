"use client";

import { Room } from "@/app/api/music/sonos/utils";
import { Fragment, useEffect, useState } from "react";

export default function PlayMusicButton({
  room,
  getStatus,
  isPlaying,
  currentTrack,
}: {
  room: Room;
  getStatus: (room: Room) => Promise<void>;
  isPlaying: boolean;
  currentTrack: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!room) {
      return;
    }

    const fetchStatus = async () => {
      setIsLoading(true);
      await getStatus(room);
      setIsLoading(false);
    };

    fetchStatus();
  }, [room, getStatus]);

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
        }),
      });

      const data = await response.json();

      await getStatus(room);

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

      {currentTrack && (
        <div>
          <p>Title: {currentTrack.title}</p>
          <p>Artist: {currentTrack.artist}</p>
          <p>Uri: {currentTrack.uri}</p>
        </div>
      )}
    </Fragment>
  );
}
