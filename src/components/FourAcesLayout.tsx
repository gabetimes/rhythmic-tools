import SiteFooter from "@/components/SiteFooter";
import FourAcesHeader from "@/components/four-aces/shared/FourAcesHeader";

export default function FourAcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="four-aces min-h-screen flex flex-col">
      <FourAcesHeader />
      <div className="flex-1 pb-16">{children}</div>
      <SiteFooter />
    </div>
  );
}
