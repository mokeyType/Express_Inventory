import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import storeIcon from '/src/logo.png'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products', path: '/products' },
  { label: 'Sales', path: '/sales' },
  { label: 'About', path: '/about' },
]

function Navbar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = async () => {
    await logout()
    closeMenu()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="brand" onClick={closeMenu}>
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
            end={item.path === '/'}
          >
            {item.label}
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
