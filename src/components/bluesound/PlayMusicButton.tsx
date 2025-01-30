"use client";

import { Fragment, useEffect, useState } from "react";

export default function BlueSounsPlayMusicButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      const response = await fetch("/api/music/bluesound/getStatus");
      const responseJson = await response.json();

      const {
        data: { isPlaying },
      } = responseJson;

      setIsPlaying(isPlaying);
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
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Fragment>
  );
}
