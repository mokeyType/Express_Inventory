import { Link, Navigate } from 'react-router-dom'
import RegisterForm from '../../components/auth/RegisterForm'
import Loader from '../../components/auth/Loader'
import { useAuth } from '../../context/useAuth'
import storeIcon from '../../assets/store-icon.svg'
import './Login.css'

function Register() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loader message="Preparing your workspace..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
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
          <span className="login-eyebrow">Start Fresh</span>
          <h1>Create your business inventory workspace.</h1>
          <p>
            Set up your account and get a secure tenant-ready space for products, sales, analytics, and stock alerts.
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
              <span>Products</span>
              <strong>Ready</strong>
            </div>
            <div>
              <span>Sales flow</span>
              <strong>Live</strong>
            </div>
            <div className="preview-chart">
              <span style={{ height: '48%' }} />
              <span style={{ height: '72%' }} />
              <span style={{ height: '58%' }} />
              <span style={{ height: '86%' }} />
            </div>
          </div>
        </div>

        <div className="login-benefits">
          <span>Secure signup</span>
          <span>Private tenant data</span>
          <span>Analytics-ready</span>
        </div>
      </div>

      <div className="login-form-panel">
        <RegisterForm />
        <div className="auth-footer">
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </section>
  )
}

export default Register
