import { cn } from "@/lib/utils";

interface FourAcesCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function FourAcesCard({ children, onClick, className, style }: FourAcesCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-4a-card rounded-[14px] p-6 border border-4a-border transition-all",
        onClick && "cursor-pointer",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
