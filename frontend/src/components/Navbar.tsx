import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <NavLink to="/" className="brand">
          Vlad
        </NavLink>
        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/infrastructure">Infrastructure</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/resume">Resume</NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
