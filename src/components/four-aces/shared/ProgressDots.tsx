interface ProgressDotsProps {
  current: number;
  total: number;
}

export default function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-2 rounded transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            background: i <= current
              ? "hsl(var(--4a-accent))"
              : "hsl(var(--4a-border))",
          }}
        />
      ))}
    </div>
  );
}
