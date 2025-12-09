import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  )
}

export default App
