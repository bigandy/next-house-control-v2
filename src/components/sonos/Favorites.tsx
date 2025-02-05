"use client";

import { Room } from "@/app/api/music/sonos/utils";
import { useState, useEffect, Fragment } from "react";
import Favorite from "@/components/Favorite";

export default function Favorites({
  room,
  currentTrack,
  getStatus,
}: {
  room: Room;
  currentTrack: any;
  getStatus: (room: Room) => Promise<void>;
}) {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFavorites = async () => {
      const response = await fetch("/api/music/sonos/getFavorites");
      const responseJson = await response.json();

      const {
        data: { formattedFavorites },
      } = responseJson;

      console.log({ formattedFavorites });

      setFavorites(formattedFavorites);
    };

    getFavorites();
  }, []);

  const handlePlayFavorite = async (favorite: {
    url: string;
    title: string;
  }) => {
    try {
      setError(null);
      const response = await fetch("/api/music/sonos/playFavorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favorite,
          room,
        }),
      });

      const data = await response.json();

      await getStatus(room);

      if (!data.success) {
        throw new Error(data.error || "Failed to play favorite");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Fragment>
      <div className="border border-gray-500 rounded-md p-4">
        <details>
          <summary>Favorites</summary>

          {favorites?.length > 0 ? (
            favorites.map((favorite: { url: string; title: string }) => {
              // console.log({ favorite });
              return (
                <Favorite
                  key={favorite.url}
                  title={favorite.title}
                  handlePlayFavorite={handlePlayFavorite}
                  favorite={favorite}
                />
              );
            })
          ) : (
            <div>No favorites found</div>
          )}
        </details>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Fragment>
  );
}
