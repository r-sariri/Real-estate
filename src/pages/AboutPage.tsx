import { PageHero } from '../components/layout/PageHero';
import { AboutSection } from '../components/home/AboutSection';
import { WhyChoose } from '../components/home/WhyChoose';
import { TeamSection } from '../components/home/TeamSection';
import { CtaBanner } from '../components/home/CtaBanner';

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="داستان ما"
        title="دفتری که بر قضاوت بنا شده"
        lede="املاک افق بر یک اصل ساده بنا شد: خرید یا فروش یک خانه مهم، همان دقتی را می‌طلبد که هر تصمیم مالی بزرگ دیگر — و کمی هم‌نشین بهتر."
        imageId="1600585154340-be6161a56a0c"
        imageAlt="اقامتگاه معاصر با باغ‌های طراحی‌شده"
      />
      <AboutSection ctaLabel="گفت‌وگو با مشاور" ctaTo="/contact" />
      <WhyChoose />
      <TeamSection />
      <CtaBanner />
    </>
  );
}
