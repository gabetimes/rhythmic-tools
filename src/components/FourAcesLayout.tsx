import SiteFooter from "@/components/SiteFooter";
import FourAcesHeader from "@/components/four-aces/shared/FourAcesHeader";

export default function FourAcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="four-aces min-h-screen pb-16">
      <FourAcesHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
