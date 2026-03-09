import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Plus, Trash2 } from "lucide-react";

interface CapturedSpace {
  id: string;
  imageUrl: string;
  prompt: string;
  date: string;
  timestamp: number;
  mood?: { symbol: string; label: string };
}

export default function Spaces() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<CapturedSpace[]>([]);
  const [selected, setSelected] = useState<CapturedSpace | null>(null);

  useEffect(() => {
    try {
      setSpaces(JSON.parse(localStorage.getItem("ink-spaces") || "[]"));
    } catch {
      setSpaces([]);
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = spaces.filter((s) => s.id !== id);
    setSpaces(updated);
    localStorage.setItem("ink-spaces", JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground">Journaling Spaces</h2>
          <p className="text-sm text-muted-foreground mt-1 font-sans">
            Your writing environments
          </p>
        </div>
        <button
          onClick={() => navigate("/ink/capture")}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
        </button>
      </div>

      {spaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-up-delay">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Camera size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm text-center font-sans">
            No spaces captured yet.<br />
            Take a photo of where you write.
          </p>
          <button
            onClick={() => navigate("/ink/capture")}
            className="mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
          >
            Capture First Space
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 animate-fade-up-delay">
            {spaces.map((space) => (
              <div key={space.id} className="relative group rounded-xl overflow-hidden border border-border">
                <button
                  onClick={() => setSelected(space)}
                  className="w-full hover:ring-2 hover:ring-primary/30 transition-all"
                >
                  <img
                    src={space.imageUrl}
                    alt="Writing space"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-2.5 bg-card">
                    <p className="text-xs text-muted-foreground font-sans">{space.date}</p>
                  </div>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(space.id); }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-foreground/50 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  aria-label="Delete space"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {selected && (
            <div
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <div
                className="bg-background rounded-2xl overflow-hidden max-w-md w-full max-h-[85vh] overflow-y-auto border border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selected.imageUrl}
                  alt="Writing space"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground font-sans">{selected.date}</p>
                    {selected.mood && (
                      <span className="text-sm font-serif" title={selected.mood.label}>{selected.mood.symbol}</span>
                    )}
                  </div>
                  <p className="font-serif text-foreground leading-relaxed">
                    {selected.prompt}
                  </p>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
