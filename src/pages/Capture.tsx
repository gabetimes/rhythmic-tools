import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ImagePlus, ArrowLeft } from "lucide-react";
import { getTodayPrompt } from "@/data/prompts";
import { getTodayMood } from "@/components/MoodTracker";

interface CapturedSpace {
  id: string;
  imageUrl: string;
  prompt: string;
  date: string;
  timestamp: number;
  mood?: { symbol: string; label: string };
}

function getSpaces(): CapturedSpace[] {
  try {
    return JSON.parse(localStorage.getItem("ink-spaces") || "[]");
  } catch {
    return [];
  }
}

function saveSpace(space: CapturedSpace) {
  const spaces = getSpaces();
  spaces.unshift(space);
  // Keep max 20 to avoid localStorage limits
  localStorage.setItem("ink-spaces", JSON.stringify(spaces.slice(0, 20)));
}

export default function Capture() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Resize to save localStorage space
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 600;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = (h / w) * maxDim; w = maxDim; }
          else { w = (w / h) * maxDim; h = maxDim; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setPreview(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!preview) return;
    const mood = getTodayMood();
    saveSpace({
      id: Date.now().toString(),
      imageUrl: preview,
      prompt: getTodayPrompt(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: Date.now(),
      ...(mood ? { mood } : {}),
    });
    setSaved(true);
    setTimeout(() => navigate("/spaces"), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 animate-fade-up">
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-serif font-semibold text-foreground text-xl">Capture the Moment</h2>
          <p className="text-xs text-muted-foreground font-sans">Photograph your writing space</p>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!preview ? (
        <div className="animate-fade-up-delay">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-3 hover:bg-secondary/30 transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <Camera size={24} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground font-sans">Take a photo</p>
              <p className="text-xs text-muted-foreground mt-1">or choose from gallery</p>
            </div>
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-up">
          <div className="rounded-2xl overflow-hidden border border-border">
            <img src={preview} alt="Your writing space" className="w-full aspect-[4/3] object-cover" />
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-sans mb-1">Today's prompt</p>
            <p className="text-sm font-serif text-foreground leading-relaxed">{getTodayPrompt()}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setPreview(null); setSaved(false); }}
              className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
            >
              Retake
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {saved ? "Saved ✓" : "Save to Spaces"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
