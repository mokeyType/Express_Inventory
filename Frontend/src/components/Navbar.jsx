import { NavLink } from 'react-router-dom'
import storeIcon from '/src/logo.png'

const navItems = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products', path: '/products' },
  { label: 'Sales', path: '/sales' },
  { label: 'About Us', path: '/about', icon: 'about' },
  { label: 'User Settings', path: '/settings', icon: 'settings' },
]

function NavIcon({ type }) {
  if (type === 'home') {
    return (
      <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m3 10.8 9-7.3 9 7.3" />
        <path d="M5 10v10h5v-6h4v6h5V10" />
      </svg>
    )
  }

  if (type === 'about') {
    return (
      <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M9 9h6" />
        <path d="M9 13h4" />
      </svg>
    )
  }

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.35 1.08V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.08-.35H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .35-1.08V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.26.39.61.74 1 1 .3.17.67.23 1.08.23H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.77Z" />
    </svg>
  )
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <img src={storeIcon} alt="ExpressInventory" width="64" height="64" />
        </div>
      </div>

      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            end={item.path === '/'}
          >
            {item.icon ? (
              <>
                <NavIcon type={item.icon} />
                <span className="sr-only">{item.label}</span>
              </>
            ) : (
              item.label
            )}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
