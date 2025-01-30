import PlayMusicButton from "@/components/bluesound/PlayMusicButton";
import Title from "@/components/Title";

export default function Home() {
  return (
    <div>
      <Title>Bluesound Lounge Music</Title>

      <div className="flex flex-col gap-4">
        <PlayMusicButton />
      </div>
    </div>
  );
}
