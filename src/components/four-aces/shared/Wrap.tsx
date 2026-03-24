export default function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[480px] mx-auto px-5">{children}</div>;
}
