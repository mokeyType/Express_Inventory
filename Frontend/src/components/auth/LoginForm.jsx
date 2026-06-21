import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    remember: true,
  })
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target
    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!credentials.email.trim() || !credentials.password) {
      setMessage('Please enter both email and password.')
      return
    }

    try {
      setSubmitting(true)
      await login(credentials)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setMessage(getLoginError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'https://express-inventory.onrender.com'}/auth/google`
  }

  return (
    <div className="login-card">
      <div className="login-card-header">
        <span className="login-eyebrow">Secure access</span>
        <h2>Login to your account</h2>
        <p>Use your business email to access products, sales, and reports.</p>
      </div>

      <div className="oauth-actions">
        <button type="button" className="oauth-button" onClick={handleGoogleLogin}>
          <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="login-divider">
        <span>or sign in with email</span>
      </div>

      {message && <div className="login-message">{message}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="you@business.com"
            autoComplete="email"
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
        </div>

        <div className="login-options">
          <label className="remember-option">
            <input
              type="checkbox"
              name="remember"
              checked={credentials.remember}
              onChange={handleChange}
            />
            Remember me
          </label>
          <Link to="/settings">Forgot password?</Link>
        </div>

        <button type="submit" className="login-submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        New to ExpressInventory? <Link to="/register">Create an account</Link>
      </p>
    </div>
  )
}

function EyeIcon({ visible }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {visible ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A9.5 9.5 0 0 1 12 5c5 0 8.5 4.1 10 7a16 16 0 0 1-3.1 4" />
          <path d="M6.6 6.7A16.8 16.8 0 0 0 2 12c1.5 2.9 5 7 10 7 1.4 0 2.6-.3 3.8-.8" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </>
      )}
    </svg>
  )
}

function getLoginError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    'Login failed. Please check your credentials and try again.'
  )
}

export default LoginForm
