import { Room } from "@/app/api/music/sonos/utils";

export default function VolumeController({
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
    <select
      value={selectedRoom}
      onChange={handleChange}
      className="border rounded p-2 border-gray-500 mt-2"
    >
      {rooms.map((room) => (
        <option key={room.id} value={room.id}>
          {room.name}
        </option>
      ))}
    </select>
  );
}
