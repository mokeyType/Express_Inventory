import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './UserSettings.css'

function UserSettings() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const displayName = user?.name || 'Signed-in user'
  const displayEmail = user?.email || 'Email will appear after backend redeploy'
  const authProvider = user?.authProvider === 'GOOGLE' ? 'Google account' : 'Email and password'
  const avatarInitial = displayName.trim().charAt(0).toUpperCase() || 'U'
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [messages, setMessages] = useState({
    profile: null,
    password: null,
    error: null,
  })

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    if (!formData.username.trim()) {
      setMessages({ ...messages, error: 'Username cannot be empty.' })
      return
    }
    setMessages({
      profile: 'Profile updated successfully!',
      password: null,
      error: null,
    })
    setTimeout(() => setMessages({ profile: null, password: null, error: null }), 3000)
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessages({ ...messages, error: 'All password fields are required.' })
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessages({ ...messages, error: 'New password and confirm password do not match.' })
      return
    }
    if (passwordData.newPassword.length < 6) {
      setMessages({ ...messages, error: 'New password must be at least 6 characters.' })
      return
    }
    setMessages({
      profile: null,
      password: 'Password changed successfully!',
      error: null,
    })
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setTimeout(() => setMessages({ profile: null, password: null, error: null }), 3000)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <section className="settings-page">
      <div className="settings-hero">
        <span className="eyebrow">Settings</span>
        <h1>User Settings</h1>
        <p>
          Manage your profile information, change your password, and control your account access.
        </p>
      </div>

      <div className="settings-grid">
        <div>
          {messages.error && <div className="error-message">{messages.error}</div>}

          <div className="settings-card">
            <h2>Update Profile</h2>
            <p>Change your username and personal information.</p>
            {messages.profile && <div className="success-message">{messages.profile}</div>}
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleProfileChange}
                  placeholder="Enter your username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself (optional)"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="settings-card">
            <h2>Change Password</h2>
            <p>Keep your account secure by updating your password regularly.</p>
            {messages.password && <div className="success-message">{messages.password}</div>}
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="settings-sidebar">
          <div className="settings-card account-card">
            <div className="account-avatar" aria-hidden="true">
              {avatarInitial}
            </div>
            <div className="account-summary">
              <span className="account-label">Signed in as</span>
              <h2>{displayName}</h2>
              <p>{displayEmail}</p>
            </div>
            <dl className="account-details">
              <div>
                <dt>User ID</dt>
                <dd>{user?.userId ?? '-'}</dd>
              </div>
              <div>
                <dt>Login method</dt>
                <dd>{authProvider}</dd>
              </div>
            </dl>
          </div>

          <div className="settings-card danger-card">
            <h2>Account access</h2>
            <p>Sign out from this browser session when you are done.</p>
            <button type="button" onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserSettings
