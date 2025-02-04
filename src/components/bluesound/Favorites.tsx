"use client";

type BluesoundFavorite = {
  url: string;
  name: string;
  image: string;
  id: string;
};

import { useState, useEffect, Fragment } from "react";
import Favorite from "@/components/Favorite";
export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFavorites = async () => {
      const response = await fetch("/api/music/bluesound/getFavorites");
      const responseJson = await response.json();

      const {
        data: { favorites },
      } = responseJson;
      setFavorites(favorites);
    };

    getFavorites();
  }, []);

  const handlePlayFavorite = async (favoriteId: string) => {
    try {
      setError(null);
      const response = await fetch("/api/music/bluesound/playFavorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: favoriteId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to play favorite");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Fragment>
      <div>
        {favorites.length > 0 ? (
          favorites.map((favorite: BluesoundFavorite) => (
            <Favorite
              key={favorite.url}
              title={favorite.name}
              handlePlayFavorite={handlePlayFavorite}
              favorite={favorite}
            />
          ))
        ) : (
          <div>No favorites found</div>
        )}
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </Fragment>
  );
}
