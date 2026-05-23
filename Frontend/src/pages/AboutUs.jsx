import './AboutUs.css'

const strengths = [
  {
    label: 'Product Focus',
    text: 'Designed around real store workflows, from product tracking to sales visibility.',
  },
  {
    label: 'Clean Experience',
    text: 'Built with a calm interface, readable data, and task-first layouts.',
  },
  {
    label: 'Scalable Thinking',
    text: 'Structured to support authenticated users, private data, and growing inventory needs.',
  },
]

const techStack = [
  ['React', 'Reusable components, hooks, and route-based pages.'],
  ['CSS', 'Responsive page styles with consistent cards, spacing, and states.'],
  ['Vite', 'Fast local development and optimized production builds.'],
  ['Spring Boot', 'REST API foundation for inventory, sales, and user workflows.'],
  ['Java', 'Typed backend logic with maintainable service structure.'],
  ['Database', 'Persistent storage for products, sales, and account data.'],
]

const socialLinks = [
  {
    label: 'Gmail',
    href: 'mailto:asmehta667@gmail.com',
    icon: 'mail',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/anuj__mehta01/',
    icon: 'camera',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/anuj-mehta-6283bb28b/',
    icon: 'briefcase',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mokeyType',
    icon: 'code',
  },
]

function AboutUs() {
  return (
    <section className="about-page">
      <div className="about-hero">
        <div className="about-hero-copy">
          <span className="about-eyebrow">About ExpressInventory</span>
          <h1>Building a cleaner way to manage inventory and sales.</h1>
          <p>
            ExpressInventory is a full-stack inventory and sales management app created to help
            store owners keep products, sales, and business activity organized in one focused
            workspace.
          </p>
        </div>

        <div className="about-signature-card">
          <span>Created by</span>
          <strong>Anuj Mehta</strong>
          <p>Full-stack developer focused on practical business tools and polished interfaces.</p>
        </div>
      </div>

      <div className="about-grid">
        <article className="profile-card">
          <h2>What I&apos;m Building</h2>
          <p>
            My goal with ExpressInventory is to create a simple, professional system that makes
            everyday store management easier. The app focuses on clear workflows, quick access to
            important data, and a design that feels reliable during daily use.
          </p>

          <ul className="profile-list">
            {strengths.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="social-card">
          <h2>Connect With Me</h2>
          <p>Follow the project, see more work, or connect professionally.</p>
          <ul className="social-list">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  <SocialIcon type={link.icon} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <article className="tech-card">
        <div className="tech-head">
          <span className="about-eyebrow">Tech Highlights</span>
          <h2>Built with a modern full-stack foundation</h2>
          <p>
            The project combines a React frontend with a Spring Boot backend, keeping the interface
            responsive while giving the app a structured API layer for real inventory operations.
          </p>
        </div>

        <ul className="tech-list">
          {techStack.map(([name, description]) => (
            <li key={name}>
              <strong>{name}</strong>
              <span>{description}</span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}

function SocialIcon({ type }) {
  const icons = {
    mail: (
      <>
        <path d="M4 6h16v12H4V6Z" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    camera: (
      <>
        <path d="M6 7h1.5l1-2h7l1 2H18a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z" />
        <path d="M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      </>
    ),
    briefcase: (
      <>
        <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
        <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
        <path d="M4 12h16" />
      </>
    ),
    code: (
      <>
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 5-4 14" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {icons[type]}
    </svg>
  )
}

export default AboutUs
