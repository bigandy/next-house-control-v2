"use client";

import { Fragment, useState } from "react";
import CancelButton from "@/components/CancelButton";

/**
 * Pause all the (sonos && bluesound) devices
 * @returns JSX.Element
 */
export default function EverythingOffButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAllOff = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch("/api/music/sonos/allOff");
      const responseBluesound = await fetch("/api/music/bluesound/allOff");

      const data = await response.json();
      const dataBluesound = await responseBluesound.json();
      if (!data.success || !dataBluesound.success) {
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

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Fragment>
  );
}
