import PauseAllButton from "@/components/sonos/PauseAllButton";
import PlayMusicButton from "@/components/sonos/PlayMusicButton";
import VolumeController from "@/components/sonos/VolumeController";
import Title from "@/components/Title";

export default function SonosPage() {
  return (
    <div>
      <Title>Sonos Music</Title>

      <div className="flex flex-col gap-4">
        <PlayMusicButton room="Bedroom" />
        <PauseAllButton />
        <VolumeController room="Bedroom" />
      </div>
    </div>
  );
}
