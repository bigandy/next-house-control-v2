"use client";

import { useState, useEffect, Fragment } from "react";

export default function VolumeController() {
  const [volume, setVolume] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const getStatus = async () => {
    const response = await fetch("/api/music/bluesound/getStatus");
    const responseJson = await response.json();

    const {
      data: { volume },
    } = responseJson;

    setVolume(volume);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      await getStatus();
    };

    fetchStatus();
  }, []);

  const handleUpdateVolume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    try {
      setError(null);
      const response = await fetch("/api/music/bluesound/setVolume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
