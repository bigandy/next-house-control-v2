"use client";

import { Room } from "@/app/api/music/sonos/utils";
import { useState, Fragment } from "react";

const urlsToTest = [
  {
    title: "Worldwide FM - cool music",
    uri: "x-sonos-http:cloudcast%3a2181312454.mp4?sid=181&flags=8232&sn=7",
  },
  {
    title: "off the main thread - new view transition stuff",
    uri: "https://traffic.libsyn.com/secure/7f4e1dd2-207b-4e10-9995-ec44c3c76816/OTMT015_v2.mp3?dest-id=4205759",
  },
  {
    title: "Double J",
    uri: "aac://http://live-radio01.mediahubaustralia.com/DJDW/aac/",
  },
  {
    title: "Triple J",
    uri: "x-rincon-mp3radio://http://live-radio01.mediahubaustralia.com/2TJW/mp3/",
  },
];

export default function PlayMusicButton({ room }: { room: Room }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playUri = async (uri: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch("/api/music/sonos/playUri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room,
          uri,
        }),
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // get uri from input
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      uri: { value: string };
    };

    const uri = formElements.uri.value;

    playUri(uri);

    form.reset();
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <label htmlFor="uri">URI</label>
        <input
          type="text"
          name="uri"
          className="border border-gray-500 rounded p-2 mr-4 w-full mb-4"
          placeholder="Enter URI"
        />
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {urlsToTest.map((url) => (
        <button key={url.uri} onClick={() => playUri(url.uri)}>
          {url.title}
        </button>
      ))}
    </Fragment>
  );
}
