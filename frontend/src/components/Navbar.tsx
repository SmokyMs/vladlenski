import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import HashLink from './HashLink'

type Theme = 'light' | 'dark'

function Navbar() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )

  const nextTheme = theme === 'light' ? 'dark' : 'light'

  function toggleTheme() {
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <NavLink to="/" className="brand">
          Vlad
        </NavLink>
        <div className="nav-links">
          <NavLink to="/infrastructure" className="nav-text-link">
            Site's Infrastructure
          </NavLink>
          <HashLink to="/#projects" className="nav-text-link">
            Projects
          </HashLink>
          <a
            href="https://github.com/SmokyMs"
            className="nav-icon-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.17-1.11-1.48-1.11-1.48-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82c.85 0 1.71.12 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
              />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/vladislav-gavronski-800a4b21b/"
            className="nav-icon-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M6.5 8.25H3.25V21H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.68c0-3.84-2.05-5.63-4.79-5.63a4.16 4.16 0 0 0-3.76 2.07V8.25H9.2V21h3.25v-6.31c0-1.66.32-3.28 2.39-3.28 2.04 0 2.07 1.91 2.07 3.39V21H21v-7.32Z"
              />
            </svg>
          </a>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
          >
            {theme === 'light' ? (
              <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M20.35 15.35A9 9 0 0 1 8.65 3.65a9 9 0 1 0 11.7 11.7Z"
                />
              </svg>
            ) : (
              <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path
                  fill="currentColor"
                  d="M11 2h2v3h-2V2Zm0 17h2v3h-2v-3ZM2 11h3v2H2v-2Zm17 0h3v2h-3v-2ZM4.22 5.64l1.42-1.42 2.12 2.12-1.42 1.42-2.12-2.12Zm12.02 12.02 1.42-1.42 2.12 2.12-1.42 1.42-2.12-2.12ZM4.22 18.36l2.12-2.12 1.42 1.42-2.12 2.12-1.42-1.42ZM16.24 6.34l2.12-2.12 1.42 1.42-2.12 2.12-1.42-1.42Z"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
