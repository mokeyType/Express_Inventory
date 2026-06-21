import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false,
  })

  const togglePasswordVisibility = (fieldName) => {
    setVisiblePasswords((currentValues) => ({
      ...currentValues,
      [fieldName]: !currentValues[fieldName],
    }))
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    const validationMessage = validateForm(formData)
    if (validationMessage) {
      setMessage(validationMessage)
      return
    }

    try {
      setSubmitting(true)
      await register(formData)
      navigate('/home', { replace: true })
    } catch (error) {
      setMessage(getRegisterError(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-card">
      <div className="login-card-header">
        <span className="login-eyebrow">Create workspace</span>
        <h2>Create your account</h2>
        <p>Start managing products, sales, and analytics in your own tenant workspace.</p>
      </div>

      {message && <div className="login-message">{message}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
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
              type={visiblePasswords.password ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('password')}
              aria-label={visiblePasswords.password ? 'Hide password' : 'Show password'}
            >
              <EyeIcon visible={visiblePasswords.password} />
            </button>
          </div>
        </div>

        <div className="login-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <div className="password-input">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={visiblePasswords.confirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              aria-label={visiblePasswords.confirmPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon visible={visiblePasswords.confirmPassword} />
            </button>
          </div>
        </div>

        <button type="submit" className="login-submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
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

function validateForm(formData) {
  if (!formData.name.trim()) {
    return 'Name is required.'
  }

  if (formData.name.trim().length > 100) {
    return 'Name must be 100 characters or less.'
  }

  if (!formData.email.trim()) {
    return 'Email is required.'
  }

  if (!formData.password) {
    return 'Password is required.'
  }

  if (formData.password.length < 8 || formData.password.length > 72) {
    return 'Password must be between 8 and 72 characters.'
  }

  if (formData.password !== formData.confirmPassword) {
    return 'Passwords do not match.'
  }

  return ''
}

function getRegisterError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    'Registration failed. Please check your details and try again.'
  )
}

export default RegisterForm
