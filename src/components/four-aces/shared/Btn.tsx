import { cn } from "@/lib/utils";

type BtnVariant = "primary" | "secondary" | "ghost" | "dark";

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<BtnVariant, string> = {
  primary: "bg-4a-accent text-white hover:bg-4a-accent-hover",
  secondary: "bg-transparent text-4a-text border-[1.5px] border-4a-border",
  ghost: "bg-transparent text-4a-accent px-4 py-2",
  dark: "bg-4a-surface-dark text-white",
};

export default function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  className,
}: BtnProps) {
  return (
    <button
      className={cn(
        "rounded-[10px] px-7 py-3 text-[15px] font-semibold font-4a-sans tracking-[0.2px] transition-all border-none cursor-pointer",
        variantStyles[variant],
        disabled && "opacity-40 cursor-default",
        className,
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  );
}
