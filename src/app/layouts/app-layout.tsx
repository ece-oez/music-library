import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/auth-context'

export function AppLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/collection" aria-label="Tracks n Plates home">
          <span className="brand-mark"><img src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=160&q=85" alt="Vinyl record" /></span>
          <span>
            <strong>Tracks n Plates</strong>
            <small>Our shared record room</small>
          </span>
        </NavLink>
        <nav className="primary-nav" aria-label="Primary navigation">
          <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/collection">Collection</NavLink>
          <button className="nav-link nav-link-muted" type="button" disabled>Discover <span>soon</span></button>
        </nav>
        <div className="header-account"><span className="account-avatar" style={{ backgroundColor: user?.accent }}>{user?.initials}</span><span className="header-note">{user?.displayName}</span><button className="sign-out-button" onClick={() => void signOut()} type="button">Sign out</button></div>
      </header>
      <main className="page-content"><Outlet /></main>
      <footer className="site-footer">
        <span>Tracks n Plates · private collection</span>
        <span>Two listeners, one shelf</span>
      </footer>
    </div>
  )
}
