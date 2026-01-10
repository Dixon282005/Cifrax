import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { UseCasesSection } from './components/UseCasesSection';
import { ResponsiveSection } from './components/ResponsiveSection';
import { CTASection } from './components/CTASection';
import { LandingFooter } from './components/LandingFooter';

export function Landing() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <ResponsiveSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
