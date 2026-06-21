import { Link, Navigate } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'
import Loader from '../../components/auth/Loader'
import { useAuth } from '../../context/useAuth'
import storeIcon from '../../assets/store-icon.svg'
import './Login.css'

function Login() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loader message="Preparing your workspace..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="login-page">
      <div className="login-info-panel">
        <div className="login-brand">
          <div className="login-brand-icon">
            <img src={storeIcon} alt="ExpressInventory icon" width="28" height="28" />
          </div>
          <div>
            <span>ExpressInventory</span>
            <strong>Smart Inventory & Sales Management</strong>
          </div>
        </div>

        <div className="login-copy">
          <span className="login-eyebrow">Welcome Back</span>
          <h1>Sign in to continue managing your business.</h1>
          <p>
            Track inventory, monitor sales, review analytics, and keep each tenant workspace organized from one calm dashboard.
          </p>
        </div>

        <div className="dashboard-preview" aria-label="Dashboard preview">
          <div className="preview-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="preview-grid">
            <div>
              <span>Total stock</span>
              <strong>12.8k</strong>
            </div>
            <div>
              <span>Monthly sales</span>
              <strong>428</strong>
            </div>
            <div className="preview-chart">
              <span style={{ height: '44%' }} />
              <span style={{ height: '68%' }} />
              <span style={{ height: '52%' }} />
              <span style={{ height: '82%' }} />
            </div>
          </div>
        </div>

        <div className="login-benefits">
          <span>Inventory control</span>
          <span>Sales tracking</span>
          <span>Tenant-ready analytics</span>
        </div>
      </div>

      <div className="login-form-panel">
        <LoginForm />
        <div className="auth-footer">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </section>
  )
}

export default Login
