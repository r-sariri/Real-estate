import { PageHero } from '../components/layout/PageHero';
import { ServicesSection } from '../components/home/ServicesSection';
import { CtaBanner } from '../components/home/CtaBanner';
import { Reveal } from '../components/ui/Reveal';
import './pages.css';

const steps = [
  {
    title: 'A conversation',
    text: 'We start with what you want the property to do for you — live, invest, or both.',
  },
  {
    title: 'Search and curation',
    text: 'A shortlist built by hand, including homes that are not publicly listed.',
  },
  {
    title: 'Closing and beyond',
    text: 'Negotiation, due diligence and introductions long after the keys change hands.',
  },
];

export function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Practice"
        title="Advisory for every stage"
        lede="Whether you are acquiring a first home or restructuring a portfolio, our services are designed to be used together — or precisely where you need them."
        imageId="1600607687939-ce8a6c25118c"
        imageAlt="Minimal interior with floor-to-ceiling windows"
      />
      <ServicesSection />

      <section className="section section--sand process" aria-labelledby="process-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How We Work</span>
            <h2 id="process-title" className="section-title">
              Three steps, no surprises
            </h2>
          </div>
          <div className="process__grid">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <article className="process__step">
                  <span className="process__index">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="process__title">{step.title}</h3>
                  <p className="process__text">{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
