import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store.js'

const MODES = [
  { id: 'pomodoro', label: '🍅 Pomodoro', seconds: 25 * 60 },
  { id: 'short',    label: '☕ Short Break', seconds: 5 * 60 },
  { id: 'long',     label: '🌙 Long Break', seconds: 15 * 60 },
  { id: 'custom',   label: '⚡ Custom', seconds: 0 },
]

export default function Timer() {
  const { subjects, activeSubjects, addXP, addMinutes, openPaywall, user } = useStore()
  const [mode, setMode]           = useState('pomodoro')
  const [seconds, setSeconds]     = useState(25 * 60)
  const [running, setRunning]     = useState(false)
  const [subject, setSubject]     = useState(activeSubjects[0] || 'math')
  const [customMins, setCustomMins] = useState(30)
  const [sessions, setSessions]   = useState(0)
  const [finished, setFinished]   = useState(false)
  const intervalRef = useRef(null)
  const totalRef    = useRef(25 * 60)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            handleComplete()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const handleComplete = () => {
    const minsStudied = Math.floor(totalRef.current / 60)
    addXP(minsStudied * 3)
    addMinutes(minsStudied)
    setSessions(s => s + 1)
    setFinished(true)
    setTimeout(() => setFinished(false), 4000)
  }

  const selectMode = (m) => {
    setMode(m.id)
    setRunning(false)
    const secs = m.id === 'custom' ? customMins * 60 : m.seconds
    setSeconds(secs)
    totalRef.current = secs
  }

  const toggleTimer = () => setRunning(r => !r)

  const resetTimer = () => {
    setRunning(false)
    const m    = MODES.find(x => x.id === mode)
    const secs = mode === 'custom' ? customMins * 60 : m.seconds
    setSeconds(secs)
    totalRef.current = secs
  }

  const pct  = totalRef.current > 0 ? 1 - seconds / totalRef.current : 0
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')

  const R    = 108
  const circ = 2 * Math.PI * R
  const dash = circ * (1 - pct)

  const selectedSubject = subjects.find(s => s.id === subject)
  const xpPreview = Math.floor((totalRef.current / 60) * 3)

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: 'slide-up 0.4s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.4px' }}>⏱ Study Timer</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.92rem' }}>Focus deep. Earn XP. Never break the chain.</p>
      </div>

      {/* Session dots */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: i < sessions ? 'linear-gradient(135deg, #F97316, #FBBF24)' : 'rgba(255,255,255,0.07)',
            border: `2px solid ${i < sessions ? '#F97316' : 'rgba(255,255,255,0.1)'}`,
            transition: 'all 0.3s var(--ease-bounce)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
          }}>
            {i < sessions && <span style={{ color: '#fff' }}>✓</span>}
          </div>
        ))}
        <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
          {sessions} session{sessions !== 1 ? 's' : ''} today
        </span>
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => selectMode(m)} style={{
            padding: '9px 16px', borderRadius: 99,
            background: mode === m.id ? 'linear-gradient(135deg, #F97316, #FBBF24)' : 'rgba(255,255,255,0.06)',
            color: mode === m.id ? '#fff' : 'var(--text-secondary)',
            border: `1px solid ${mode === m.id ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
            transition: 'all 0.2s var(--ease-bounce)',
            boxShadow: mode === m.id ? '0 4px 14px rgba(249,115,22,0.35)' : 'none',
          }}>{m.label}</button>
        ))}
      </div>

      {/* Custom input */}
      {mode === 'custom' && (
        <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
          <label style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Minutes:</label>
          <input type="number" min={1} max={180} value={customMins}
            onChange={e => {
              const v = parseInt(e.target.value) || 1
              setCustomMins(v)
              setSeconds(v * 60)
              totalRef.current = v * 60
            }}
            className="input-premium"
            style={{ width: 80, textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Timer card */}
        <div className="card" style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, position: 'relative', overflow: 'hidden' }}>
          {/* Completion banner */}
          {finished && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              background: 'linear-gradient(135deg, #10B981, #34D399)',
              color: '#fff', textAlign: 'center', padding: '11px',
              fontWeight: 800, fontSize: '1rem', borderRadius: '18px 18px 0 0',
              animation: 'slide-up 0.3s ease both',
            }}>
              🎉 Session Complete! +{xpPreview} XP Earned!
            </div>
          )}

          {/* SVG Clock */}
          <div style={{ position: 'relative', width: 248, height: 248 }}>
            <svg width={248} height={248} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={124} cy={124} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={13} />
              <circle cx={124} cy={124} r={R} fill="none"
                stroke={running ? '#F97316' : selectedSubject?.color || '#6366F1'}
                strokeWidth={13} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={dash}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <div style={{ fontSize: 28 }}>{selectedSubject?.emoji || '📚'}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', fontWeight: 700, color: '#F1F5F9', lineHeight: 1, letterSpacing: '-1px' }}>
                {mins}:{secs}
              </div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {mode === 'pomodoro' ? 'Focus Time' : mode === 'short' ? 'Short Break' : mode === 'long' ? 'Long Break' : 'Custom'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={toggleTimer} style={{ padding: '13px 34px', fontSize: '1rem', minWidth: 120 }}>
              {running ? '⏸ Pause' : '▶ Start'}
            </button>
            <button onClick={resetTimer} style={{
              width: 46, height: 46, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#F1F5F9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >↺</button>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: 99, padding: '5px 14px',
            color: '#FB923C', fontWeight: 700, fontSize: '0.85rem',
          }}>
            ⚡ +{xpPreview} XP on completion
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Subject picker */}
          <div className="card" style={{ padding: '20px', flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 12, color: '#F1F5F9' }}>📚 Study Subject</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {subjects.map(({ id, label, emoji, color }) => (
                <button key={id} onClick={() => setSubject(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 10,
                  background: subject === id ? `${color}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${subject === id ? color + '50' : 'rgba(255,255,255,0.07)'}`,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-body)', fontWeight: 700,
                  color: subject === id ? color : 'var(--text-secondary)',
                  fontSize: '0.88rem', textAlign: 'left',
                }}
                  onMouseEnter={e => { if (subject !== id) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#F1F5F9'; } }}
                  onMouseLeave={e => { if (subject !== id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                >
                  <span style={{ fontSize: 18 }}>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card" style={{ padding: '20px', background: 'linear-gradient(145deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 12, color: '#F1F5F9' }}>💡 Pro Tips</h3>
            {[
              '4 pomodoros = 1 full study block 🍅',
              'Same time daily = max streak gains 🔥',
              'Short breaks protect your focus 🧠',
            ].map(t => (
              <div key={t} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#818CF8', flexShrink: 0, marginTop: 2 }}>→</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.84rem', lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
            {user.plan === 'free' && (
              <button onClick={() => openPaywall('AI Study Planner')} style={{
                marginTop: 10, width: '100%', padding: '9px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: '#fff', border: 'none', borderRadius: 10,
                fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)'; }}
              >
                🔒 Unlock AI Study Planner →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
