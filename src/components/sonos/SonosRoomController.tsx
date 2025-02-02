"use client";

import { useState } from "react";

import SonosPauseAllButton from "@/components/sonos/PauseAllButton";
import SonosPlayMusicButton from "@/components/sonos/PlayMusicButton";
import SonosRoomSelector from "@/components/sonos/RoomSelector";
import SonosVolumeController from "@/components/sonos/VolumeController";
import SonosFavorites from "@/components/sonos/Favorites";
import SonosPlayUriButton from "@/components/sonos/PlayUriButton";
import { Room } from "@/app/api/music/sonos/utils";

const rooms: { name: string; id: Room }[] = [
  { name: "Bedroom", id: "Bedroom" },
  { name: "Kitchen", id: "Blanc" },
];

const SonosRoomController = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room>("Bedroom");

  const handleRoomChange = (roomId: Room) => {
    setSelectedRoom(roomId);
  };

  return (
    <div className="flex flex-col gap-4">
      <SonosRoomSelector
        selectedRoom={selectedRoom}
        handleRoomChange={handleRoomChange}
        rooms={rooms}
      />

      <SonosPlayMusicButton room={selectedRoom} />
      <SonosPauseAllButton />
      <SonosVolumeController room={selectedRoom} />

      <SonosFavorites room={selectedRoom} />

      <SonosPlayUriButton room={selectedRoom} />
    </div>
  );
};

export default SonosRoomController;
