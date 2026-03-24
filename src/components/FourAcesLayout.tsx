import SiteFooter from "@/components/SiteFooter";

export default function FourAcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="four-aces min-h-screen pb-16">
      {children}
      <SiteFooter />
    </div>
  );
}
