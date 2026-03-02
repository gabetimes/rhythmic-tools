import { CloudRain, Music, Trees } from "lucide-react";
import { Slider } from "@/components/ui/slider";

type SoundType = "rain" | "lofi" | "forest";

interface AmbientControls {
  playing: boolean;
  soundType: SoundType;
  volume: number;
  play: (type: SoundType) => void;
  stop: () => void;
  setVolume: (v: number) => void;
}

const sounds: { type: SoundType; icon: typeof CloudRain; label: string }[] = [
  { type: "rain", icon: CloudRain, label: "Rain" },
  { type: "lofi", icon: Music, label: "Lo-Fi" },
  { type: "forest", icon: Trees, label: "Forest" },
];

export default function SoundPlayer({ ambient }: { ambient: AmbientControls }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {sounds.map(({ type, icon: Icon, label }) => {
          const isActive = ambient.playing && ambient.soundType === type;
          return (
            <button
              key={type}
              onClick={() => isActive ? ambient.stop() : ambient.play(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>
      {ambient.playing && (
        <Slider
          value={[ambient.volume * 100]}
          onValueChange={([v]) => ambient.setVolume(v / 100)}
          max={100}
          step={1}
          className="w-20"
        />
      )}
    </div>
  );
}
