import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import storeIcon from '/src/logo.png'

const navItems = [
  {
    label: 'Home',
    path: '/home',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1v-8.5Z" />
      </svg>
    ),
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h7v7H4V5Zm9 0h7v4h-7V5Zm0 6h7v8h-7v-8Zm-9 2h7v6H4v-6Z" />
      </svg>
    ),
  },
  {
    label: 'Products',
    path: '/products',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16v3H4V7Zm0 5h16v7H4v-7Zm0-9h16v2H4V3Z" />
      </svg>
    ),
  },
  {
    label: 'Sales',
    path: '/sales',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 18h16v2H4v-2Zm2-3h4v-8H6v8Zm6 0h4V8h-4v7Zm6 0h2V5h-2v10Z" />
      </svg>
    ),
  },
  {
    label: 'About',
    path: '/about',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
      </svg>
    ),
  },
]

function Navbar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = async () => {
    await logout()
    closeMenu()
    navigate('/', { replace: true })
  }

  return (
    <header className="navbar">
      <NavLink to="/home" className="brand" onClick={closeMenu}>
        <div className="brand-icon">
          <img src={storeIcon} alt="" width="40" height="40" />
        </div>
        <div className="brand-copy">
          <span>ExpressInventory</span>
          <strong>Inventory Manager</strong>
        </div>
      </NavLink>

      <button
        type="button"
        className="nav-menu-button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            end
          >
            <span className="nav-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={menuOpen ? 'nav-actions is-open' : 'nav-actions'}>
        <NavLink
          to="/settings"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? 'nav-link nav-settings active' : 'nav-link nav-settings'
          }
        >
          {user?.name || 'Settings'}
        </NavLink>
        <button type="button" className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
