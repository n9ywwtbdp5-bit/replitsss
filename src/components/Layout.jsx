import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../store.js'
import { useAuth } from '../lib/useAuth.jsx'

const NAV = [
  { to: '/app/dashboard',    label: 'Dashboard',    icon: '⬡' },
  { to: '/app/timer',        label: 'Study Timer',  icon: '⏱' },
  { to: '/app/progress',     label: 'Progress',     icon: '📈' },
  { to: '/app/achievements', label: 'Achievements', icon: '🏅' },
  { to: '/app/leaderboard',  label: 'Leaderboard',  icon: '🏆' },
  { to: '/app/planner',      label: 'AI Planner',   icon: '🧠' },
  { to: '/app/pricing',      label: 'Upgrade',      icon: '⚡' },
]

export default function Layout() {
  const { user, currentStreak, longestStreak, xp, level, xpToNextLevel } = useStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const xpPct = Math.min(100, Math.round((xp / xpToNextLevel) * 100))

  const planColors = {
    free:    { bg: 'rgba(100,116,139,0.12)', color: '#94A3B8', label: 'Free' },
    pro:     { bg: 'rgba(249,115,22,0.12)',  color: '#FB923C', label: 'Pro ⚡' },
    premium: { bg: 'rgba(139,92,246,0.12)',  color: '#A78BFA', label: 'Premium 👑' },
  }
  const plan = planColors[user.plan] || planColors.free

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', transition: 'background 0.3s ease, color 0.3s ease' }}>
      {/* Background orbs */}
      <div className="bg-orbs">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* Sidebar */}
      <aside style={{
        width: 240, minHeight: '100vh',
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        padding: '20px 14px',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 50, overflowY: 'auto',
        transition: 'background 0.3s ease',
      }}>

        {/* Logo */}
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '10px 12px', borderRadius: 12, marginBottom: 24,
          transition: 'background 0.2s', textAlign: 'left', width: '100%',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <span style={{ fontSize: 26, animation: 'streak-fire 1.6s ease-in-out infinite' }}>🔥</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>StudyStreak</span>
        </button>

        {/* User Card */}
        <div style={{
          background: 'var(--bg-glass)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '14px', marginBottom: 16,
          transition: 'background 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F97316, #FBBF24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>{user.avatar}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: 'rgba(99,102,241,0.18)', color: '#818CF8',
                borderRadius: 99, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700, marginTop: 2,
              }}>Level {level}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
            <span>XP Progress</span>
            <span style={{ color: 'var(--text-secondary)' }}>{xp} / {xpToNextLevel}</span>
          </div>
          <div style={{ background: 'var(--bg-glass)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99, width: `${xpPct}%`,
              background: 'linear-gradient(90deg, #F97316, #FBBF24)',
              transition: 'width 0.8s ease',
            }} />
          </div>
        </div>

        {/* Streak */}
        <div style={{
          background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 12, padding: '10px 14px', marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22, animation: 'streak-fire 1.6s ease-in-out infinite' }}>🔥</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#FB923C', lineHeight: 1 }}>{currentStreak}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(251,146,60,0.7)', fontWeight: 600 }}>day streak</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Best</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{longestStreak}d</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10,
              textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem',
              transition: 'all 0.18s',
              background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
              color: isActive ? '#818CF8' : 'var(--text-secondary)',
              borderLeft: isActive ? '2px solid #6366F1' : '2px solid transparent',
            })}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Plan badge */}
        <div style={{
          marginTop: 20, padding: '10px 12px', borderRadius: 10,
          background: plan.bg, border: `1px solid ${plan.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: plan.color }}>{plan.label} Plan</span>
          {user.plan === 'free' && (
            <button onClick={() => navigate('/app/pricing')} style={{
              background: 'var(--gradient-primary)', color: '#fff',
              border: 'none', borderRadius: 99, padding: '3px 10px',
              fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}>Upgrade</button>
          )}
        </div>

        {/* Log out */}
        <button onClick={logout} style={{
          marginTop: 10, width: '100%', padding: '9px 12px', borderRadius: 10,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)',
          color: '#F87171', fontFamily: 'var(--font-body)', fontWeight: 700,
          fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)'; }}
        >
          <span>↩</span> Log Out
        </button>
      </aside>

      {/* Main content */}
      <div style={{ width: 240, flexShrink: 0 }} />
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: '100%', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}
