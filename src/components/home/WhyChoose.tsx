import { Img } from '../ui/Img';
import { Reveal } from '../ui/Reveal';
import './WhyChoose.css';

const reasons = [
  {
    title: 'Advisory before listings',
    text: 'We begin with the decision, not the inventory — valuation, financing and timing come first.',
  },
  {
    title: 'A private, curated network',
    text: 'A meaningful share of the homes we represent are introduced before they reach the open market.',
  },
  {
    title: 'One point of contact',
    text: 'Your advisor stays with you from the first conversation to the keys — and long after.',
  },
];

const stats = [
  { value: '18', label: 'Years of practice' },
  { value: '$4.2B', label: 'Property transacted' },
  { value: '480+', label: 'Homes placed' },
  { value: '97%', label: 'Clients by referral' },
];

export function WhyChoose() {
  return (
    <section className="section section--sand why" aria-labelledby="why-title">
      <div className="container why__grid">
        <Reveal className="why__media">
          <figure className="why__figure">
            <Img
              id="1613977257363-707ba9348227"
              alt="Contemporary villa with a reflecting pool and mature landscaping"
              sizes="(max-width: 900px) 92vw, 40vw"
            />
          </figure>
          <figcaption className="why__caption">Lake Austin Residence · Completed 2021</figcaption>
        </Reveal>

        <Reveal delay={120} className="why__copy">
          <span className="eyebrow">Why Horizon</span>
          <h2 id="why-title" className="section-title why__title">
            Considered advice, <em>enduring value.</em>
          </h2>
          <blockquote className="why__quote">
            “We treat every home as an architectural legacy — and every client as a long-term partner.”
          </blockquote>
          <ol className="why__list">
            {reasons.map((reason, index) => (
              <li key={reason.title} className="why__item">
                <span className="why__item-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="why__item-title">{reason.title}</h3>
                  <p className="why__item-text">{reason.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <div className="container">
        <dl className="why__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="why__stat">
              <dt className="why__stat-label">{stat.label}</dt>
              <dd className="why__stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
