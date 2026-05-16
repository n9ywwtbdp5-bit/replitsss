import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store.js'
import SubjectModal from '../components/SubjectModal.jsx'

const MOTIVATIONAL = [
  "Every champion was once a beginner. Keep going! 💪",
  "You're building something incredible, one day at a time. 🌟",
  "Your future self is cheering you on right now! 🎉",
  "Consistency beats perfection every single time. 🔥",
  "Small daily improvements lead to stunning results. ✨",
]

const StatCard = ({ emoji, label, value, sub, gradient, delay = 0 }) => (
  <div className="card animate-pop-in" style={{
    padding: '22px 20px', animationDelay: `${delay}ms`,
    background: gradient || undefined,
  }}>
    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: gradient ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
      <span style={{ fontSize: 36 }}>{emoji}</span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 700, color: gradient ? '#fff' : 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
    </div>
    <div style={{ fontSize: '0.82rem', color: gradient ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)', fontWeight: 500 }}>{sub}</div>
  </div>
)

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    user, currentStreak, longestStreak, xp, level, xpToNextLevel,
    todayMinutes, weeklyGoal, weeklyMinutes, weeklyXP,
    subjects, activeSubjects, achievements, openPaywall, setPlan,
  } = useStore()
  const [quote]           = useState(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)])
  const [greeting, setGreeting]       = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [showSubjectModal, setShowSubjectModal] = useState(false)

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const paidPlan      = searchParams.get('plan')
    if (paymentStatus !== 'success' || !['pro', 'premium'].includes(paidPlan)) return
    setPlan(paidPlan)
    setCheckoutMessage(`🎉 ${paidPlan === 'pro' ? 'Pro' : 'Premium'} activated successfully!`)
    const next = new URLSearchParams(searchParams)
    next.delete('payment')
    next.delete('plan')
    setSearchParams(next, { replace: true })
  }, [searchParams, setPlan, setSearchParams])

  const xpPct      = Math.min(100, Math.round((xp / xpToNextLevel) * 100))
  const weeklyPct  = Math.min(100, Math.round((weeklyMinutes / weeklyGoal) * 100))
  const unlockedAchievements = achievements.filter(a => a.unlocked)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {showSubjectModal && <SubjectModal onClose={() => setShowSubjectModal(false)} />}

      {/* Success toast */}
      {checkoutMessage && (
        <div className="toast toast-success" style={{ position: 'relative', inset: 'unset', marginBottom: 20, animation: 'slide-up 0.4s ease both' }}>
          <span style={{ fontSize: 20 }}>🎉</span>
          <span style={{ fontWeight: 700, color: '#34D399' }}>{checkoutMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32, animation: 'slide-up 0.5s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.4px' }}>
          {greeting}, {user.name} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>{quote}</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard emoji="🔥" label="Current Streak"  value={currentStreak} sub="days in a row"   gradient="linear-gradient(135deg, #F97316, #FBBF24)" delay={0} />
        <StatCard emoji="🏆" label="Longest Streak"  value={longestStreak} sub="personal best"   delay={80} />
        <StatCard emoji="⭐" label="Scholar Level"   value={`Lv.${level}`} sub={`${xp} XP total`} delay={160} />
        <StatCard emoji="⏱" label="Today's Study"   value={`${todayMinutes}m`} sub="studied today" delay={240} />
      </div>

      {/* Weekly + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Weekly Goal */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>📅 Weekly Goal</h3>
            <span style={{ color: '#FB923C', fontWeight: 700, fontSize: '0.88rem' }}>{weeklyMinutes}/{weeklyGoal} min</span>
          </div>
          <div style={{ background: 'var(--bg-glass)', borderRadius: 99, height: 14, overflow: 'hidden', marginBottom: 10, border: '1px solid var(--border)' }}>
            <div style={{
              height: '100%', borderRadius: 99, width: `${weeklyPct}%`,
              background: weeklyPct >= 100 ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #F97316, #FBBF24)',
              transition: 'width 1s var(--ease-bounce)',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
            }}>
              {weeklyPct > 18 && <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.68rem', fontWeight: 800 }}>{weeklyPct}%</span>}
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
            {weeklyPct >= 100 ? '🎉 Goal crushed! Amazing work!' : `${weeklyGoal - weeklyMinutes} minutes left this week`}
          </p>
          {/* Weekly XP callout */}
          <div style={{
            marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 12px', borderRadius: 10,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818CF8' }}>⚡ Weekly XP</span>
            <button onClick={() => navigate('/app/leaderboard')} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#818CF8', fontSize: '1rem' }}>{weeklyXP.toLocaleString()}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>View Leaderboard →</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 14, color: 'var(--text-primary)' }}>⚡ Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => navigate('/app/timer')} style={{ width: '100%', justifyContent: 'center', fontSize: '0.92rem' }}>
              ⏱ Start Study Session
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/app/leaderboard')} style={{ width: '100%', justifyContent: 'center', fontSize: '0.92rem' }}>
              🏆 View Leaderboard
            </button>
            {user.plan === 'free' && (
              <button onClick={() => openPaywall('Pro Features')} style={{
                width: '100%', padding: '11px 20px', borderRadius: 99,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.92rem',
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; }}
              >
                👑 Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>📚 Your Subjects</h3>
          <button onClick={() => setShowSubjectModal(true)} style={{
            background: 'none', border: 'none', color: '#FB923C',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
            fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            ⚙️ Manage →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
          {subjects.map(({ id, label, emoji, color }) => {
            const active = activeSubjects.includes(id)
            return (
              <button key={id} onClick={() => navigate('/app/timer')} style={{
                background: active ? `${color}15` : 'var(--bg-glass)',
                border: `1px solid ${active ? color + '50' : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 10px', cursor: 'pointer',
                transition: 'all 0.2s var(--ease-bounce)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font-body)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color + '80'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = active ? color + '50' : 'var(--border)'; }}
              >
                <span style={{ fontSize: 26 }}>{emoji}</span>
                <span style={{ fontWeight: 700, fontSize: '0.78rem', color: active ? color : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
                {!active && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>inactive</span>}
              </button>
            )
          })}
          {/* Add subject shortcut */}
          <button onClick={() => setShowSubjectModal(true)} style={{
            background: 'var(--bg-glass)',
            border: '1px dashed var(--border-strong)',
            borderRadius: 12, padding: '14px 10px', cursor: 'pointer',
            transition: 'all 0.2s var(--ease-bounce)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-body)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = 'rgba(99,102,241,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg-glass)'; }}
          >
            <span style={{ fontSize: 26 }}>➕</span>
            <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>Add New</span>
          </button>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>🏅 Recent Achievements</h3>
          <button onClick={() => navigate('/app/achievements')} style={{ background: 'none', border: 'none', color: '#FB923C', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>View All →</button>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {unlockedAchievements.length > 0 ? unlockedAchievements.map(({ id, label, emoji, desc }) => (
            <div key={id} title={desc} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
              borderRadius: 99, padding: '7px 14px', fontWeight: 700, fontSize: '0.85rem',
              color: 'var(--text-primary)',
            }}>
              <span style={{ fontSize: 18 }}>{emoji}</span> {label}
            </div>
          )) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Complete study sessions to unlock achievements! 🎯</p>
          )}
        </div>
      </div>
    </div>
  )
}
