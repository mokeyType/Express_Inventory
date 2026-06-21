import { Link, Navigate } from 'react-router-dom'
import './Home.css'
import { useAuth } from '../context/useAuth'
import Loader from '../components/auth/Loader'

function Landing() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loader message="Checking your session..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="home-page landing-page">
      <section className="home-hero landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">ExpressInventory</span>
          <h1>Manage store inventory and sales with ease.</h1>
          <p>
            ExpressInventory helps you keep products, stock, and sales in one place. Sign in to access
            your dashboard, manage products, and view analytics.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="hero-button">
              Login
            </Link>
            <Link to="/register" className="hero-button hero-button--secondary">
              Register
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>Fast</strong>
              <p>Quick login and easy inventory access.</p>
            </div>
            <div className="hero-stat">
              <strong>Clear</strong>
              <p>Simple workflows for products and sales.</p>
            </div>
            <div className="hero-stat">
              <strong>Secure</strong>
              <p>Protected tenant data for every user.</p>
            </div>
          </div>
        </div>

        <aside className="hero-panel landing-preview">
          <div className="hero-panel-card">
            <div className="panel-top">
              <span>Public landing</span>
              <strong>Login to continue</strong>
            </div>
            <div className="panel-metric">
              <span>Start here</span>
              <strong>Access your dashboard</strong>
            </div>
            <div className="panel-bars" aria-label="Landing preview">
              <span style={{ height: '52%' }} />
              <span style={{ height: '74%' }} />
              <span style={{ height: '60%' }} />
              <span style={{ height: '88%' }} />
              <span style={{ height: '42%' }} />
            </div>
            <ul>
              <li>Login and unlock the app</li>
              <li>Manage products and sales securely</li>
              <li>Review analytics after login</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="landing-value-strip" aria-label="Platform highlights">
        <div>
          <strong>One workspace</strong>
          <span>Products, stock, and sales together</span>
        </div>
        <div>
          <strong>Live visibility</strong>
          <span>Know what is available at a glance</span>
        </div>
        <div>
          <strong>Clear decisions</strong>
          <span>Useful summaries without spreadsheet clutter</span>
        </div>
        <div>
          <strong>Private access</strong>
          <span>Your business workspace stays protected</span>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="capabilities-title">
        <div className="landing-section-heading">
          <span className="eyebrow">Everything in one place</span>
          <h2 id="capabilities-title">The daily tools your store actually needs.</h2>
          <p>
            Move from stock updates to completed sales without jumping between disconnected tools.
          </p>
        </div>

        <div className="landing-feature-grid">
          {capabilities.map((capability) => (
            <article className="landing-feature-card" key={capability.title}>
              <span className="landing-feature-icon" aria-hidden="true">
                <CapabilityIcon type={capability.icon} />
              </span>
              <div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-workflow" aria-labelledby="workflow-title">
        <div className="landing-workflow-copy">
          <span className="eyebrow">Simple workflow</span>
          <h2 id="workflow-title">From inventory to insight in three steps.</h2>
          <p>
            ExpressInventory keeps routine work short and predictable, so your team can focus on the store.
          </p>

          <ol className="landing-steps">
            {workflowSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="landing-dashboard-preview" aria-label="Inventory dashboard example">
          <div className="landing-preview-header">
            <div>
              <span>Workspace overview</span>
              <strong>Today</strong>
            </div>
            <span className="landing-live-pill">Live</span>
          </div>
          <div className="landing-preview-metrics">
            <div><span>Products</span><strong>248</strong><small>12 categories</small></div>
            <div><span>Stock units</span><strong>8,420</strong><small>Updated now</small></div>
            <div><span>Low stock</span><strong>7</strong><small>Needs attention</small></div>
          </div>
          <div className="landing-preview-table">
            <div className="landing-preview-row landing-preview-row--head">
              <span>Product</span><span>Status</span><span>Stock</span>
            </div>
            <div className="landing-preview-row">
              <span>Wireless Keyboard</span><span className="status-ready">Healthy</span><strong>86</strong>
            </div>
            <div className="landing-preview-row">
              <span>USB-C Hub</span><span className="status-low">Low stock</span><strong>9</strong>
            </div>
            <div className="landing-preview-row">
              <span>Office Monitor</span><span className="status-ready">Healthy</span><strong>34</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <span className="eyebrow">Ready when you are</span>
          <h2>Run a clearer, calmer inventory workflow.</h2>
          <p>Create your workspace and keep every product and sale within reach.</p>
        </div>
        <div className="landing-cta-actions">
          <Link to="/register" className="hero-button">Create free account</Link>
          <Link to="/login" className="landing-text-link">Already have an account <span>→</span></Link>
        </div>
      </section>

      <footer className="landing-footer">
        <strong>ExpressInventory</strong>
        <span>Inventory and sales, organized.</span>
      </footer>
    </div>
  )
}

const capabilities = [
  {
    icon: 'box',
    title: 'Product catalog',
    description: 'Keep names, categories, brands, pricing, and stock in one searchable catalog.',
  },
  {
    icon: 'activity',
    title: 'Stock visibility',
    description: 'See healthy, low, and unavailable stock before it becomes a customer problem.',
  },
  {
    icon: 'cart',
    title: 'Faster sales',
    description: 'Select products, adjust quantities, and record each sale through a focused workflow.',
  },
  {
    icon: 'chart',
    title: 'Useful analytics',
    description: 'Review revenue, recent activity, and product movement from a concise dashboard.',
  },
  {
    icon: 'filter',
    title: 'Smart filtering',
    description: 'Find the right item quickly using search, category, price, and stock filters.',
  },
  {
    icon: 'shield',
    title: 'Protected workspace',
    description: 'Authentication and tenant-aware data keep each business workspace separated.',
  },
]

const workflowSteps = [
  { title: 'Build your catalog', description: 'Add products with the details your team uses every day.' },
  { title: 'Record each sale', description: 'Choose available items and let stock update with the transaction.' },
  { title: 'Review and act', description: 'Spot low inventory and understand recent performance quickly.' },
]

function CapabilityIcon({ type }) {
  const paths = {
    box: <><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" /><path d="m4.5 7.5 7.5 4 7.5-4M12 11.5V21" /></>,
    activity: <><path d="M4 19V9m5 10V5m6 14v-7m5 7V3" /></>,
    cart: <><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L20.5 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    chart: <><path d="M4 20V10m6 10V4m6 16v-7m4 7H2" /></>,
    filter: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
    shield: <><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  }

  return <svg viewBox="0 0 24 24">{paths[type]}</svg>
}

export default Landing
