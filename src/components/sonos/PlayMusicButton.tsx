"use client";

import { Room } from "@/app/api/music/sonos/utils";
import { useState, useEffect, Fragment, useCallback } from "react";

const inactiveStates = ["paused", "stopped"];

export default function PlayMusicButton({ room }: { room: Room }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [currentTrack, setCurrentTrack] = useState<any>(null);

  const getStatus = useCallback(async (room: Room) => {
    const response = await fetch(`/api/music/sonos/getStatus?room=${room}`);
    const responseJson = await response.json();
    const {
      data: {
        state: { state: playingState },
      },
    } = responseJson;

    setIsPlaying(!inactiveStates.includes(playingState));
  }, []);

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

      {/* {currentTrack && (
        <div>
          <p>Title: {currentTrack.title}</p>
          <p>Artist: {currentTrack.artist}</p>
          <p>Uri: {currentTrack.uri}</p>
        </div>
      )} */}
    </Fragment>
  );
}
