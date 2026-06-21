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
    <div className="home-page">
      <section className="home-hero">
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

        <aside className="hero-panel">
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
    </div>
  )
}

export default Landing
