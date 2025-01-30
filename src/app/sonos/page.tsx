import Title from "@/components/Title";
import SonosRoomController from "@/components/sonos/SonosRoomController";
export default function SonosPage() {
  return (
    <div>
      <Title>Sonos Music</Title>

      <div className="flex flex-col gap-4">
        <SonosRoomController />
      </div>
    </div>
  );
}
