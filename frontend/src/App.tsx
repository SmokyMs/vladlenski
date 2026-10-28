import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Infrastructure from './pages/Infrastructure'
import './App.css'

function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    const normalizedPathname = pathname.replace(/\/+$/, '') || '/'
    document.title =
      normalizedPathname === '/infrastructure'
        ? 'Infrastructure | Vladislav Gavronski'
        : 'Vladislav Gavronski | Cloud & Platform Engineering'
  }, [pathname])

  return (
    <div className="site-layout">
      <ScrollToTop />
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/projects" element={<Navigate to="/#projects" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
