"use client";

import { Fragment, useState } from "react";

export default function PlayUrl() {
  const [error, setError] = useState<string | null>(null);

  const handlePlayUrl = async (url: string) => {
    try {
      setError(null);
      const response = await fetch("/api/music/bluesound/playUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
        }),
      });

      const data = await response.json();

      console.log({ data });

      if (!data.success) {
        throw new Error(data.error || "Failed to play url");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Fragment>
      <div>
        <button
          onClick={() =>
            handlePlayUrl(
              "TuneIn:u11/https://stream.srg-ssr.ch/rsj/aacp_96.m3u"
            )
          }
        >
          Play Url
        </button>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Fragment>
  );
}
