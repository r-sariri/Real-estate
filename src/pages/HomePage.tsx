import { Hero } from '../components/home/Hero';
import { AboutSection } from '../components/home/AboutSection';
import { FeaturedProperties } from '../components/home/FeaturedProperties';
import { ServicesSection } from '../components/home/ServicesSection';
import { WhyChoose } from '../components/home/WhyChoose';
import { TeamSection } from '../components/home/TeamSection';
import { CtaBanner } from '../components/home/CtaBanner';

export function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturedProperties />
      <ServicesSection />
      <WhyChoose />
      <TeamSection />
      <CtaBanner />
    </>
  );
}
