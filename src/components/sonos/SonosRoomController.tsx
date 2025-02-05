"use client";

import { useCallback, useState } from "react";

import SonosPauseAllButton from "@/components/sonos/PauseAllButton";
import SonosPlayMusicButton from "@/components/sonos/PlayMusicButton";
import SonosRoomSelector from "@/components/sonos/RoomSelector";
import SonosVolumeController from "@/components/sonos/VolumeController";
import SonosFavorites from "@/components/sonos/Favorites";
import SonosPlayMusicForm from "@/components/sonos/PlayMusicForm";
import { Room } from "@/app/api/music/sonos/utils";

const rooms: { name: string; id: Room }[] = [
  { name: "Bedroom", id: "Bedroom" },
  { name: "Kitchen", id: "Blanc" },
];

const inactiveStates = ["paused", "stopped"];

const SonosRoomController = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room>("Bedroom");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  const handleRoomChange = (roomId: Room) => {
    setSelectedRoom(roomId);
  };

  const getStatus = useCallback(async (room: Room) => {
    const response = await fetch(`/api/music/sonos/getStatus?room=${room}`);
    const responseJson = await response.json();
    const {
      data: {
        state: { state: playingState, currentTrack, volume },
      },
    } = responseJson;

    console.log({ currentTrack });

    setIsPlaying(!inactiveStates.includes(playingState));
    setCurrentTrack(currentTrack);
    setVolume(volume);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <SonosRoomSelector
        selectedRoom={selectedRoom}
        handleRoomChange={handleRoomChange}
        rooms={rooms}
      />

      <SonosPlayMusicButton
        room={selectedRoom}
        getStatus={getStatus}
        isPlaying={isPlaying}
        currentTrack={currentTrack}
      />

      <SonosPauseAllButton getStatus={getStatus} room={selectedRoom} />

      <SonosVolumeController
        room={selectedRoom}
        volume={volume}
        setVolume={setVolume}
      />

      <SonosFavorites
        room={selectedRoom}
        currentTrack={currentTrack}
        getStatus={getStatus}
      />

      <SonosPlayMusicForm
        room={selectedRoom}
        currentTrack={currentTrack}
        getStatus={getStatus}
      />
    </div>
  );
};

export default SonosRoomController;
