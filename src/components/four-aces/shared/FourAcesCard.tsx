import { cn } from "@/lib/utils";

interface FourAcesCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function FourAcesCard({ children, onClick, className, style }: FourAcesCardProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "bg-4a-card rounded-[14px] p-6 border border-4a-border transition-all text-left w-full",
        onClick && "cursor-pointer",
        className,
      )}
      style={style}
      type={onClick ? "button" : undefined}
    >
      {children}
    </Tag>
  );
}
