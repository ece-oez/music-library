import { NavLink, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/collection" aria-label="Tracks n Plates home">
          <span className="brand-mark" aria-hidden="true">NG</span>
          <span>
            <strong>Tracks n Plates</strong>
            <small>Our shared record room</small>
          </span>
        </NavLink>
        <nav className="primary-nav" aria-label="Primary navigation">
          <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/collection">Collection</NavLink>
          <button className="nav-link nav-link-muted" type="button" disabled>Discover <span>soon</span></button>
        </nav>
        <div className="header-note"><span className="status-dot" /> shared library</div>
      </header>
      <main className="page-content"><Outlet /></main>
      <footer className="site-footer">
        <span>Tracks n Plates · private collection</span>
        <span>Two listeners, one shelf</span>
      </footer>
    </div>
  )
}
