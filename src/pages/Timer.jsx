import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store.js'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', seconds: 25 * 60, icon: '🍅' },
  { id: 'short',    label: 'Short Break', seconds: 5 * 60,  icon: '☕' },
  { id: 'long',     label: 'Long Break', seconds: 15 * 60, icon: '🌙' },
  { id: 'custom',   label: 'Custom',     seconds: 0,        icon: '⚡' },
]

const SUBJECT_TIME_KEY = 'ss_subject_time'

function getSubjectTimes() {
  try { return JSON.parse(localStorage.getItem(SUBJECT_TIME_KEY) || '{}') } catch { return {} }
}
function saveSubjectTime(id, mins) {
  const t = getSubjectTimes()
  t[id] = (t[id] || 0) + mins
  localStorage.setItem(SUBJECT_TIME_KEY, JSON.stringify(t))
}

export default function Timer() {
  const { subjects, activeSubjects, addXP, addMinutes, openPaywall, user } = useStore()
  const [mode, setMode]             = useState('pomodoro')
  const [seconds, setSeconds]       = useState(25 * 60)
  const [running, setRunning]       = useState(false)
  const [subject, setSubject]       = useState(activeSubjects[0] || 'math')
  const [customMins, setCustomMins] = useState(30)
  const [sessions, setSessions]     = useState(0)
  const [finished, setFinished]     = useState(false)
  const [subjectTimes, setSubjectTimes] = useState(getSubjectTimes())
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
    saveSubjectTime(subject, minsStudied)
    setSubjectTimes(getSubjectTimes())
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

  const R    = 90
  const circ = 2 * Math.PI * R
  const dash = circ * (1 - pct)

  const selectedSubject = subjects.find(s => s.id === subject)
  const xpPreview       = Math.floor((totalRef.current / 60) * 3)

  const totalTrackedMins = Object.values(subjectTimes).reduce((a, b) => a + b, 0)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 4px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700,
          marginBottom: 4, letterSpacing: '-0.5px', color: '#F1F5F9'
        }}>Study Timer</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
          Focus deep · Earn XP · Never break the chain
        </p>
      </div>

      {/* Mode tabs */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 28,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 14, padding: 5,
        border: '1px solid rgba(255,255,255,0.07)',
        width: 'fit-content',
      }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => selectMode(m)} style={{
            padding: '8px 18px', borderRadius: 10,
            background: mode === m.id ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'transparent',
            color: mode === m.id ? '#fff' : '#6B7280',
            border: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.83rem',
            cursor: 'pointer', transition: 'all 0.2s ease',
            boxShadow: mode === m.id ? '0 3px 12px rgba(249,115,22,0.4)' : 'none',
            whiteSpace: 'nowrap',
          }}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Custom duration */}
      {mode === 'custom' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
          background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 12, padding: '12px 18px', width: 'fit-content',
        }}>
          <span style={{ fontWeight: 700, color: '#FB923C', fontSize: '0.9rem' }}>⚡ Duration:</span>
          <input type="number" min={1} max={180} value={customMins}
            onChange={e => {
              const v = parseInt(e.target.value) || 1
              setCustomMins(v)
              setSeconds(v * 60)
              totalRef.current = v * 60
            }}
            className="input-premium"
            style={{ width: 70, textAlign: 'center', fontWeight: 800, fontSize: '1rem' }}
          />
          <span style={{ color: '#9CA3AF', fontSize: '0.88rem' }}>minutes</span>
        </div>
      )}

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* Left — Timer */}
        <div className="card" style={{
          padding: '40px 36px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 28, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(160deg, #161821 0%, #111318 100%)',
        }}>

          {/* Completion banner */}
          {finished && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              background: 'linear-gradient(90deg, #10B981, #34D399)',
              color: '#fff', textAlign: 'center', padding: '12px',
              fontWeight: 800, fontSize: '0.95rem',
              animation: 'slide-up 0.3s ease both',
            }}>
              🎉 +{xpPreview} XP earned! Great session!
            </div>
          )}

          {/* Session dots */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: i < sessions
                  ? 'linear-gradient(135deg, #F97316, #FBBF24)'
                  : 'rgba(255,255,255,0.1)',
                border: `1.5px solid ${i < sessions ? '#F97316' : 'rgba(255,255,255,0.15)'}`,
                transition: 'all 0.3s ease',
              }} />
            ))}
            <span style={{ color: '#6B7280', fontSize: '0.8rem', fontWeight: 600, marginLeft: 6 }}>
              {sessions} / 4 sessions
            </span>
          </div>

          {/* SVG ring */}
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            <svg width={220} height={220} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={110} cy={110} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
              <circle cx={110} cy={110} r={R} fill="none"
                stroke={running ? '#F97316' : (selectedSubject?.color || '#6366F1')}
                strokeWidth={10} strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={dash}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <div style={{ fontSize: 26, lineHeight: 1 }}>{selectedSubject?.emoji || '📚'}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700,
                color: '#F1F5F9', lineHeight: 1, letterSpacing: '-2px',
              }}>
                {mins}:{secs}
              </div>
              <div style={{
                color: '#4B5563', fontSize: '0.7rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '2px',
              }}>
                {mode === 'pomodoro' ? 'focus time' : mode === 'short' ? 'short break' : mode === 'long' ? 'long break' : 'custom'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={toggleTimer} style={{
              padding: '14px 44px', fontSize: '1rem', fontWeight: 800,
              borderRadius: 14, minWidth: 140,
              background: running
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #F97316, #EA580C)',
              border: running ? '1px solid rgba(255,255,255,0.12)' : 'none',
              color: '#fff',
              boxShadow: running ? 'none' : '0 5px 20px rgba(249,115,22,0.4)',
              transition: 'all 0.2s ease',
            }}>
              {running ? '⏸ Pause' : '▶ Start'}
            </button>
            <button onClick={resetTimer} style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6B7280', transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#F1F5F9' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#6B7280' }}
            >↺</button>
          </div>

          {/* XP badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: 99, padding: '6px 16px',
            color: '#FB923C', fontWeight: 700, fontSize: '0.82rem',
          }}>
            ⚡ +{xpPreview} XP on completion
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Subject picker */}
          <div className="card" style={{ padding: '20px 18px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.88rem', marginBottom: 14, color: '#9CA3AF',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>📚 Subject</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {subjects.map(({ id, label, emoji, color }) => (
                <button key={id} onClick={() => setSubject(id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 10,
                  background: subject === id ? `${color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${subject === id ? color + '45' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  fontFamily: 'var(--font-body)', fontWeight: 700,
                  color: subject === id ? color : '#6B7280',
                  fontSize: '0.86rem', textAlign: 'left',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{emoji}</span> {label}
                  </span>
                  {subjectTimes[id] > 0 && (
                    <span style={{
                      fontSize: '0.72rem', color: subject === id ? color : '#4B5563',
                      fontWeight: 600,
                    }}>
                      {subjectTimes[id]}m
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Subject time tracker */}
          {totalTrackedMins > 0 && (
            <div className="card" style={{ padding: '18px' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '0.88rem', marginBottom: 14, color: '#9CA3AF',
                textTransform: 'uppercase', letterSpacing: '1px',
              }}>📊 Today's Focus</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {subjects.filter(s => subjectTimes[s.id] > 0).map(({ id, label, emoji, color }) => {
                  const pct = Math.round((subjectTimes[id] / totalTrackedMins) * 100)
                  return (
                    <div key={id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 600 }}>
                          {emoji} {label}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: color, fontWeight: 700 }}>
                          {subjectTimes[id]}m
                        </span>
                      </div>
                      <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 99,
                          width: `${pct}%`,
                          background: color,
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Upgrade nudge */}
          {user.plan === 'free' && (
            <button onClick={() => openPaywall('AI Study Planner')} style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#fff', border: 'none', borderRadius: 14,
              fontFamily: 'var(--font-body)', fontWeight: 800, cursor: 'pointer',
              fontSize: '0.88rem', boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 7px 24px rgba(99,102,241,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(99,102,241,0.35)' }}
            >
              🔒 Unlock AI Study Planner →
            </button>
          )}

          {/* Tips */}
          <div className="card" style={{ padding: '18px', background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.15)' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.88rem', marginBottom: 12, color: '#9CA3AF',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>💡 Tips</h3>
            {[
              '4 pomodoros = 1 full study block 🍅',
              'Same time daily = max streak gains 🔥',
              'Short breaks protect your focus 🧠',
            ].map(t => (
              <div key={t} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
                <span style={{ color: '#818CF8', flexShrink: 0, marginTop: 1 }}>›</span>
                <span style={{ color: '#6B7280', fontWeight: 500, fontSize: '0.82rem', lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
