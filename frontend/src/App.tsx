import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Infrastructure from './pages/Infrastructure'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </main>
    </>
  )
}

export default App
