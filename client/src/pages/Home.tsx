// DESIGN: "Stadium Broadcast" — Main page composing all sections
// Section order: hero → facts → squad → fixtures → groups → news → press → footer
// Enhanced: skip-to-content link, semantic main landmark
import StickyNav from '@/components/StickyNav';
import HeroSection from '@/components/HeroSection';
import QuickFacts from '@/components/QuickFacts';
import SquadSection from '@/components/SquadSection';
import FixturesSection from '@/components/FixturesSection';
import GroupsSection from '@/components/GroupsSection';
import NewsSection from '@/components/NewsSection';
import PressReleaseSection from '@/components/PressReleaseSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip-to-content for keyboard users */}
      <a href="#facts" className="skip-to-content">
        Skip to content
      </a>

      <StickyNav />

      <main id="main-content" role="main">
        <HeroSection />
        <QuickFacts />
        <SquadSection />
        <FixturesSection />
        <GroupsSection />
        <NewsSection />
        <PressReleaseSection />
      </main>

      <Footer />
    </div>
  );
}
