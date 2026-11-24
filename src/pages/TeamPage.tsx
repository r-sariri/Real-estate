import { PageHero } from '../components/layout/PageHero';
import { TeamSection } from '../components/home/TeamSection';
import { CtaBanner } from '../components/home/CtaBanner';

export function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="آدم‌های ما"
        title="مشاور، نه واسطه"
        lede="کوچک، به‌عمد. هر مشتری مستقیماً با یک مشاور ارشد کار می‌کند که بازار، ملک و آدم‌های درگیر را می‌شناسد."
        imageId="1512918728675-ed5a9ecdebfd"
        imageAlt="فضای نشیمن آفتاب‌گرفته رو به تراس"
      />
      <TeamSection showFooterLink={false} />
      <CtaBanner />
    </>
  );
}
