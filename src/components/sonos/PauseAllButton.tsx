"use client";

import { Fragment, useState } from "react";
/**
 * Pause all the sonos devices
 * @returns JSX.Element
 */
export default function PauseAllButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAllOff = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch("/api/music/sonos/allOff", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

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
      <button
        onClick={handleAllOff}
        disabled={isLoading}
        className="bg-red-500 hover:bg-red-700"
      >
        Stop All
      </button>

      {error && <p className="mt-4 text-red-500 h">{error}</p>}
    </Fragment>
  );
}
