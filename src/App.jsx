import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Timer from './pages/Timer.jsx'
import Progress from './pages/Progress.jsx'
import Achievements from './pages/Achievements.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import StudyPlanner from './pages/StudyPlanner.jsx'
import Pricing from './pages/Pricing.jsx'
import PaywallModal from './components/PaywallModal.jsx'
import { useStore } from './store.js'
import { AuthProvider } from './lib/useAuth'
import Auth from './pages/Auth'

export default function App() {
  const showPaywall = useStore((s) => s.showPaywall)

  return (
    <AuthProvider>
      <>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="timer"        element={<Timer />} />
            <Route path="progress"     element={<Progress />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="leaderboard"  element={<Leaderboard />} />
            <Route path="planner"      element={<StudyPlanner />} />
            <Route path="pricing"      element={<Pricing />} />
          </Route>
        </Routes>
        {showPaywall && <PaywallModal />}
      </>
    </AuthProvider>
  )
}
