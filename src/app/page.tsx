import PauseAllButton from "@/components/sonos/PauseAllButton";
import PlayMusicButton from "@/components/sonos/PlayMusicButton";
import VolumeController from "@/components/sonos/VolumeController";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">Bedroom Music</h1>

      <div className="flex flex-col gap-4">
        <PlayMusicButton room="Bedroom" />
        <PauseAllButton />
        <VolumeController room="Bedroom" />
      </div>
    </div>
  );
}
