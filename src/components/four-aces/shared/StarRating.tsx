interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className="w-12 h-12 rounded-xl text-lg font-bold font-4a-sans cursor-pointer transition-all"
          style={{
            border: `2px solid ${n <= value ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
            background: n <= value ? "hsl(var(--4a-accent-light))" : "transparent",
            color: n <= value ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
