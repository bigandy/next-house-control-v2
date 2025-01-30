import PlayMusicButton from "@/components/bluesound/PlayMusicButton";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">Bluesound Lounge Music</h1>

      <div className="flex flex-col gap-4">
        <PlayMusicButton />
      </div>
    </div>
  );
}
