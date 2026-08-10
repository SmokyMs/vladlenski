import { Link } from 'react-router-dom'
import ArchitectureOverview from '../components/ArchitectureOverview'
import './Home.css'

const certifications = [
  {
    name: 'AWS Certified Solutions Architect – Associate',
    image: '/certifications/aws-csa.png',
    className: 'certification-badge--aws',
    url: 'https://www.credly.com/badges/d0c4c516-4a08-456b-875d-afc7a975e9dc/linked_in_profile',
  },
  {
    name: 'Microsoft Certified: Security Operations Analyst Associate (SC-200)',
    image: '/certifications/microsoft-sc200.png',
    className: 'certification-badge--microsoft',
    url: 'https://learn.microsoft.com/en-gb/users/VladislavGavronski-8296/credentials/15BBDAFD50FCC4E6?ref=https%3a%2f%2fwww.linkedin.com%2f',
  },
  {
    name: 'Splunk Enterprise Certified Admin',
    image: '/certifications/splunk-enterprise-admin.png',
    className: 'certification-badge--splunk',
    url: 'https://www.credly.com/badges/69fb46e8-c5c6-4dc3-9be5-3ad21959445a/linked_in_profile',
  },
]

function Home() {
  return (
    <div className="home-page">
      <section className="home-section hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <h1 id="hero-title">Vladislav Gavronski</h1>
          <p className="hero-subtitle">
            Security Analyst transitioning into Cloud &amp; Platform Engineering
          </p>
          <p className="hero-description">
            This portfolio is where I document what I'm building and the
            engineering decisions behind it.
          </p>
          <p className="hero-supporting-text">
            This website is the first workload in the portfolio. The focus is
            the infrastructure behind it, from design and provisioning through
            deployment, security and operations on AWS.
          </p>
          <p className="hero-supporting-text">
            Over time, the portfolio will expand with additional infrastructure,
            automation and platform engineering projects.
          </p>

          <div className="certifications">
            <div className="certifications-header">
              <h2>Certifications</h2>
            </div>
            <ul>
              {certifications.map((certification) => (
                <li key={certification.name}>
                  <a
                    className={`certification-badge ${certification.className}`}
                    href={certification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Verify ${certification.name} certification (opens the official certification verification page in a new tab)`}
                  >
                    <img src={certification.image} alt={certification.name} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="hero-profile">
          <img
            className="portrait-image"
            src="/images/profile.JPEG"
            alt="Professional portrait of Vladislav Gavronski"
          />
          <div className="primary-link profile-download">CV coming soon</div>
        </aside>
      </section>

      <section className="home-section" aria-labelledby="site-works-title">
        <div className="section-heading">
          <h2 id="site-works-title">How This Site Works</h2>
          <p>
            This website is the first workload in a broader engineering
            portfolio, hosted on AWS and managed using Infrastructure as Code.
          </p>
        </div>

        <ArchitectureOverview />

        <p className="section-detail">
          The infrastructure page documents the architecture, Terraform
          configuration, deployment workflow, security decisions and cost
          considerations behind the site.
        </p>
        <Link to="/infrastructure" className="text-link">
          Explore the infrastructure <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section
        id="projects"
        className="home-section projects-section"
        aria-labelledby="projects-title"
      >
        <div className="section-heading">
          <h2 id="projects-title">Projects</h2>
          <p>
            Additional cloud and platform engineering projects will be
            documented here as they are developed.
          </p>
        </div>

        <div className="projects-empty-state">
          <h3>Projects coming soon</h3>
          <p>New projects will be added as the portfolio grows.</p>
        </div>
      </section>
    </div>
  )
}

export default Home
