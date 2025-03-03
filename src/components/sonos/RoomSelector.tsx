import { Room } from "@/app/api/music/sonos/utils";

import CustomSelect from "@/components/CustomSelect";

export default function RoomSelector({
  selectedRoom,
  handleRoomChange,
  rooms,
}: {
  selectedRoom: Room;
  handleRoomChange: (roomId: Room) => void;
  rooms: { id: Room; name: string }[];
}) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleRoomChange(e.target.value as Room);
  };

  return (
    <CustomSelect
      className="mt-2"
      selected={selectedRoom}
      handleChange={handleChange}
      options={rooms}
    />
  );
}
