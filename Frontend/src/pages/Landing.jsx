import { Link } from 'react-router-dom'
import './Home.css'
import FeatureCard from '../components/FeatureCard'

const features = [
  {
    icon: 'box',
    title: 'Inventory Tracking',
    description: 'Keep stock counts accurate and view item movement in real time.',
  },
  {
    icon: 'trend',
    title: 'Sales Management',
    description: 'Monitor orders, invoices, and revenue from your personal inventory.',
  },
  {
    icon: 'chart',
    title: 'Analytics Dashboard',
    description: 'Visualize your inventory trends and sales performance clearly.',
  },
]

function Landing() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">ExpressInventory</span>
          <h1>Welcome to a smarter inventory workflow.</h1>
          <p>
            Explore ExpressInventory before signing in. Learn how the app helps store owners
            manage products, sales, and stock without logging in.
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
              <p>Quick setup for your inventory team.</p>
            </div>
            <div className="hero-stat">
              <strong>Clear</strong>
              <p>Organized product and sales data in one place.</p>
            </div>
            <div className="hero-stat">
              <strong>Secure</strong>
              <p>Private workspace for each signed-in user.</p>
            </div>
          </div>
        </div>

        <aside className="hero-panel">
          <div className="hero-panel-card">
            <div className="panel-top">
              <span>Landing page</span>
              <strong>Public access</strong>
            </div>
            <div className="panel-metric">
              <span>Get started</span>
              <strong>Login or register</strong>
            </div>
            <div className="panel-bars" aria-label="Landing preview">
              <span style={{ height: '56%' }} />
              <span style={{ height: '72%' }} />
              <span style={{ height: '60%' }} />
              <span style={{ height: '82%' }} />
              <span style={{ height: '48%' }} />
            </div>
            <ul>
              <li>Preview the product flow</li>
              <li>Review sales and analytics tools</li>
              <li>Sign in for your private workspace</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="features-section">
        <div className="section-head">
          <p className="eyebrow">Why ExpressInventory</p>
          <h2>Everything you need to manage store inventory and sales.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Landing
