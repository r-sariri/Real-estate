import { Link } from 'react-router-dom';
import { agents } from '../../data/agents';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Reveal } from '../ui/Reveal';
import './TeamSection.css';

const LINKEDIN_URL = 'https://linkedin.com';

type TeamSectionProps = {
  showFooterLink?: boolean;
};

export function TeamSection({ showFooterLink = true }: TeamSectionProps = {}) {
  return (
    <section className="section team" aria-labelledby="team-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div className="section-head__main">
            <span className="eyebrow">Our Team</span>
            <h2 id="team-title" className="section-title">
              The people behind the portfolio
            </h2>
          </div>
          <p className="section-lede">
            Four advisors, one standard of care. Each brings a distinct specialism — and a shared belief that the
            details are the difference.
          </p>
        </div>

        <div className="team__grid">
          {agents.map((agent, index) => (
            <Reveal key={agent.id} delay={index * 70}>
              <article className="team-card">
                <div className="team-card__media">
                  <Img
                    id={agent.photoId}
                    alt={`Portrait of ${agent.name}, ${agent.role}`}
                    sizes="(max-width: 640px) 88vw, (max-width: 1000px) 44vw, 23vw"
                    widths={[400, 600, 800, 1000]}
                  />
                  <div className="team-card__links">
                    <a href={`mailto:${agent.email}`} aria-label={`Email ${agent.name}`}>
                      <Icon name="mail" size={16} strokeWidth={1.6} />
                    </a>
                    <a href={LINKEDIN_URL} aria-label={`${agent.name} on LinkedIn`} target="_blank" rel="noreferrer">
                      <Icon name="linkedin" size={16} strokeWidth={1.6} />
                    </a>
                  </div>
                </div>
                <div className="team-card__body">
                  <h3 className="team-card__name">{agent.name}</h3>
                  <p className="team-card__role">{agent.role}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {showFooterLink ? (
          <div className="team__foot">
            <Link to="/team" className="link-arrow">
              Meet the full team
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
