import { getPaidMvp3Count } from "@/lib/mvp3-count";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import PainSection from "@/components/PainSection";
import ScenarioSection from "@/components/ScenarioSection";
import TrustSection from "@/components/TrustSection";
import StackSection from "@/components/StackSection";
import QualifySection from "@/components/QualifySection";
import BonusSection from "@/components/BonusSection";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import FinalPush from "@/components/FinalPush";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const paidCount = await getPaidMvp3Count();

  return (
    <div className="flex flex-col flex-1">
      <Nav />
      <Hero />
      <StatsBar />
      <PainSection />
      <ScenarioSection />
      <TrustSection />
      <StackSection />
      <QualifySection />
      <BonusSection />
      <PricingSection paidCount={paidCount} />
      <FaqSection />
      <FinalPush />
      <Footer />
    </div>
  );
}
