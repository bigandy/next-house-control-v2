import EverythingOffButton from "@/components/EverythingOffButton";
import Title from "@/components/Title";

export default function Home() {
  return (
    <div>
      <Title>All Music</Title>

      <div className="flex flex-col gap-4">
        <EverythingOffButton />
      </div>
    </div>
  );
}
