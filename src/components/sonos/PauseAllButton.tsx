"use client";

import { Fragment, useState } from "react";
import CancelButton from "@/components/CancelButton";
import { Room } from "@/app/api/music/sonos/utils";
/**
 * Pause all the sonos devices
 * @returns JSX.Element
 */
export default function PauseAllButton({
  getStatus,
  room,
}: {
  getStatus: (room: Room) => Promise<void>;
  room: Room;
}) {
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
      <CancelButton onClick={handleAllOff} disabled={isLoading}>
        Stop All
      </CancelButton>

      {error && <p className="mt-4 text-red-500 h">{error}</p>}
    </Fragment>
  );
}
