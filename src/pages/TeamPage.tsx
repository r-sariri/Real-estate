import { PageHero } from '../components/layout/PageHero';
import { TeamSection } from '../components/home/TeamSection';
import { CtaBanner } from '../components/home/CtaBanner';

export function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our People"
        title="Advisors, not agents"
        lede="Small by design. Every client works directly with a senior advisor who knows the market, the property and the people involved."
        imageId="1512918728675-ed5a9ecdebfd"
        imageAlt="Sunlit living space opening onto a terrace"
      />
      <TeamSection showFooterLink={false} />
      <CtaBanner />
    </>
  );
}
