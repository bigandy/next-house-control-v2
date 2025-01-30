import BlueSoundPlayMusicButton from "@/components/bluesound/PlayMusicButton";
import BlueSoundVolumeController from "@/components/bluesound/VolumeController";
import BlueSoundFavorites from "@/components/bluesound/Favorites";

import Title from "@/components/Title";

export default function BluesoundPage() {
  return (
    <div>
      <Title>Bluesound Lounge Music</Title>

      <div className="flex flex-col gap-4">
        <BlueSoundPlayMusicButton />
        <BlueSoundVolumeController />
        <BlueSoundFavorites />
      </div>
    </div>
  );
}
