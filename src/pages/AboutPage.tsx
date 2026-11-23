import { PageHero } from '../components/layout/PageHero';
import { AboutSection } from '../components/home/AboutSection';
import { WhyChoose } from '../components/home/WhyChoose';
import { TeamSection } from '../components/home/TeamSection';
import { CtaBanner } from '../components/home/CtaBanner';

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="A practice built on judgement"
        lede="Horizon Properties was founded on a simple premise: that buying or selling a significant home deserves the same rigour as any other major financial decision — and rather better company."
        imageId="1600585154340-be6161a56a0c"
        imageAlt="Contemporary residence with landscaped gardens"
      />
      <AboutSection ctaLabel="Speak With an Advisor" ctaTo="/contact" />
      <WhyChoose />
      <TeamSection />
      <CtaBanner />
    </>
  );
}
