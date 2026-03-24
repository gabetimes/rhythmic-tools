interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export default function PageHeader({ title, onBack, right }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 min-h-[40px]">
      <div className="w-20">
        {onBack && (
          <button
            onClick={onBack}
            className="bg-none border-none cursor-pointer text-4a-text-sec text-sm font-4a-sans"
          >
            ← Back
          </button>
        )}
      </div>
      <h2 className="text-base font-semibold text-4a-text font-4a-serif m-0">
        {title}
      </h2>
      <div className="w-20 text-right">{right}</div>
    </div>
  );
}
