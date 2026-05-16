import React, { useState } from 'react'
import { useStore } from '../store.js'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const FOCUS_OPTIONS = [
  { id: 'exam',     label: '📝 Exam Prep',        desc: 'Heavy on past papers & revision' },
  { id: 'mastery',  label: '🧠 Deep Mastery',      desc: 'Understanding concepts deeply' },
  { id: 'balanced', label: '⚖️ Balanced Review',   desc: 'Mix of all subjects evenly' },
  { id: 'catch_up', label: '🏃 Catch Up Mode',     desc: 'Focus on weaker subjects first' },
]

const INTENSITY_OPTIONS = [
  { id: 'light',    label: '🌱 Light',    hours: 1,   desc: '~1 hr/day' },
  { id: 'moderate', label: '⚡ Moderate', hours: 2,   desc: '~2 hrs/day' },
  { id: 'intense',  label: '🔥 Intense',  hours: 3.5, desc: '~3.5 hrs/day' },
  { id: 'grind',    label: '💀 Grind',    hours: 5,   desc: '~5 hrs/day' },
]

function generatePlan(subjects, focus, intensity, examDate) {
  if (!subjects.length) return null
  const hoursPerDay = intensity.hours
  const minsPerDay  = hoursPerDay * 60

  const weights = subjects.map((s, i) => {
    if (focus === 'balanced') return 1
    if (focus === 'catch_up') return subjects.length - i
    if (focus === 'exam')     return i === 0 ? 2.5 : 1
    return 1 + (i % 2 === 0 ? 0.4 : 0)
  })
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  const plan = DAYS.map((day, di) => {
    const isWeekend  = di >= 5
    const dayMins    = isWeekend ? Math.round(minsPerDay * 0.6) : minsPerDay
    const blocks     = []
    let remaining    = dayMins

    subjects.forEach((sub, si) => {
      if (remaining <= 0) return
      const subjectMins = Math.round((weights[si] / totalWeight) * dayMins)
      const actual      = Math.min(subjectMins, remaining)
      if (actual >= 15) {
        blocks.push({ subject: sub, minutes: actual })
        remaining -= actual
      }
    })

    return { day, blocks, totalMins: dayMins - remaining }
  })

  const insights = []
  const topSubject = subjects[0]
  insights.push(`Focus most on **${topSubject.label}** — it gets the highest daily allocation.`)

  if (examDate) {
    const daysLeft = Math.ceil((new Date(examDate) - new Date()) / 86400000)
    if (daysLeft > 0 && daysLeft <= 90) {
      insights.push(`You have **${daysLeft} days** until your exam. ${daysLeft < 14 ? '🚨 Final sprint mode!' : daysLeft < 30 ? '⚡ Ramp up intensity!' : '✅ Great time to build solid habits.'}`)
    }
  }

  insights.push(`Weekend sessions are ${Math.round(0.6 * hoursPerDay * 60)} min — lighter so you can recharge.`)
  insights.push(`At this pace, you'll log **${Math.round(hoursPerDay * 5.6 * 4)} hours/month** of focused study.`)

  return { plan, insights, hoursPerDay }
}

export default function StudyPlanner() {
  const { user, subjects, activeSubjects, openPaywall } = useStore()
  const isPremium = user.plan === 'premium'

  const [step, setStep]           = useState(1)
  const [selectedSubs, setSelectedSubs] = useState(activeSubjects.slice(0, 3))
  const [focus, setFocus]         = useState('balanced')
  const [intensity, setIntensity] = useState('moderate')
  const [examDate, setExamDate]   = useState('')
  const [generatedPlan, setGeneratedPlan] = useState(null)
  const [generating, setGenerating] = useState(false)

  const generate = () => {
    setGenerating(true)
    setTimeout(() => {
      const subs      = subjects.filter(s => selectedSubs.includes(s.id))
      const focusObj  = focus
      const intObj    = INTENSITY_OPTIONS.find(i => i.id === intensity)
      setGeneratedPlan(generatePlan(subs, focusObj, intObj, examDate))
      setGenerating(false)
      setStep(4)
    }, 1800)
  }

  const toggleSub = (id) => {
    setSelectedSubs(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  if (!isPremium) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 28, animation: 'slide-up 0.4s ease both' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.4px' }}>
            🧠 AI Study Planner
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.92rem' }}>
            Your personal AI-powered weekly study schedule.
          </p>
        </div>

        {/* Teaser */}
        <div className="card" style={{
          padding: 0, overflow: 'hidden',
          border: '1px solid rgba(139,92,246,0.3)',
          animation: 'pop-in 0.4s var(--ease-bounce) both',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 60%, #4F46E5 100%)',
            padding: '36px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ fontSize: 56, marginBottom: 14, animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🧠</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginBottom: 10, position: 'relative' }}>
              AI Study Planner
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '1rem', maxWidth: 400, margin: '0 auto', lineHeight: 1.6, position: 'relative' }}>
              Tell us your subjects, goals, and schedule — get a personalised weekly study plan built just for you.
            </p>
          </div>

          <div style={{ padding: '28px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '📅', title: 'Smart Scheduling', desc: 'Optimised blocks based on your available hours and exam dates' },
                { icon: '⚖️', title: 'Subject Balancing', desc: 'Automatically weights subjects by importance and weakness' },
                { icon: '🎯', title: 'Focus Modes', desc: 'Exam prep, deep mastery, catch-up, or balanced — you choose' },
                { icon: '📊', title: 'Progress Insights', desc: 'Weekly projections and monthly hour forecasts' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{
                  padding: '16px', borderRadius: 12,
                  background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 7 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>

            <button onClick={() => openPaywall('AI Study Planner')} style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              color: '#fff', border: 'none', borderRadius: 12,
              fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '1rem',
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 6px 24px rgba(139,92,246,0.45)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(139,92,246,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(139,92,246,0.45)'; }}
            >
              👑 Unlock with Premium — $23.99/mo
            </button>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500, marginTop: 10 }}>
              7-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    )
  }

  /* ── PREMIUM: Full planner ── */
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, animation: 'slide-up 0.4s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.4px' }}>
            🧠 AI Study Planner
          </h1>
          <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: '#fff', borderRadius: 99, padding: '3px 12px', fontSize: '0.72rem', fontWeight: 800 }}>PREMIUM</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.92rem' }}>
          Build your personalised weekly study schedule in seconds.
        </p>
      </div>

      {/* Progress steps */}
      {step < 4 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
          {['Subjects', 'Focus', 'Schedule', 'Your Plan'].map((label, i) => {
            const s = i + 1
            const done    = step > s
            const current = step === s
            return (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: done ? 'linear-gradient(135deg, #10B981, #34D399)' : current ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : 'var(--bg-glass)',
                    border: `2px solid ${done ? '#10B981' : current ? '#8B5CF6' : 'var(--border-strong)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 800,
                    color: done || current ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.3s',
                  }}>
                    {done ? '✓' : s}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: current ? '#818CF8' : done ? '#34D399' : 'var(--text-muted)' }}>{label}</span>
                </div>
                {i < 3 && <div style={{ height: 2, flex: 2, background: done ? '#10B981' : 'var(--border)', marginTop: -16, transition: 'background 0.3s' }} />}
              </React.Fragment>
            )
          })}
        </div>
      )}

      {/* Step 1: Subjects */}
      {step === 1 && (
        <div className="card" style={{ padding: '28px', animation: 'slide-up 0.3s ease both' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6, color: 'var(--text-primary)' }}>
            Which subjects are you focusing on?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 18 }}>Select up to 5 subjects to include in your plan.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 24 }}>
            {subjects.map(sub => {
              const sel = selectedSubs.includes(sub.id)
              return (
                <button key={sub.id} onClick={() => {
                  if (!sel && selectedSubs.length >= 5) return
                  toggleSub(sub.id)
                }} style={{
                  padding: '14px 10px', borderRadius: 12,
                  background: sel ? `${sub.color}18` : 'var(--bg-glass)',
                  border: `2px solid ${sel ? sub.color : 'var(--border)'}`,
                  cursor: selectedSubs.length >= 5 && !sel ? 'not-allowed' : 'pointer',
                  opacity: selectedSubs.length >= 5 && !sel ? 0.45 : 1,
                  transition: 'all 0.2s var(--ease-bounce)',
                  fontFamily: 'var(--font-body)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}
                  onMouseEnter={e => { if (!(selectedSubs.length >= 5 && !sel)) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                >
                  <span style={{ fontSize: 28 }}>{sub.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: sel ? sub.color : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{sub.label}</span>
                  {sel && <span style={{ width: 18, height: 18, borderRadius: '50%', background: sub.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', fontWeight: 900 }}>✓</span>}
                </button>
              )
            })}
          </div>
          <button className="btn btn-indigo" onClick={() => setStep(2)} disabled={selectedSubs.length === 0}
            style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
            Next: Choose Focus Mode →
          </button>
        </div>
      )}

      {/* Step 2: Focus mode */}
      {step === 2 && (
        <div className="card" style={{ padding: '28px', animation: 'slide-up 0.3s ease both' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6, color: 'var(--text-primary)' }}>
            What's your study goal?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 18 }}>This shapes how your time is distributed each day.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {FOCUS_OPTIONS.map(f => (
              <button key={f.id} onClick={() => setFocus(f.id)} style={{
                padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                background: focus === f.id ? 'rgba(139,92,246,0.14)' : 'var(--bg-glass)',
                border: `2px solid ${focus === f.id ? '#8B5CF6' : 'var(--border)'}`,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.label.split(' ')[0]}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: focus === f.id ? '#A78BFA' : 'var(--text-primary)' }}>{f.label.split(' ').slice(1).join(' ')}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginTop: 2 }}>{f.desc}</div>
                </div>
                {focus === f.id && <div style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#fff', fontWeight: 900 }}>✓</div>}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
            <button className="btn btn-indigo" onClick={() => setStep(3)} style={{ flex: 2, justifyContent: 'center', padding: '13px' }}>Next: Set Schedule →</button>
          </div>
        </div>
      )}

      {/* Step 3: Intensity + exam date */}
      {step === 3 && (
        <div className="card" style={{ padding: '28px', animation: 'slide-up 0.3s ease both' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6, color: 'var(--text-primary)' }}>
            How much can you study per day?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 18 }}>Be realistic — consistency beats overcommitting.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {INTENSITY_OPTIONS.map(i => (
              <button key={i.id} onClick={() => setIntensity(i.id)} style={{
                padding: '16px 14px', borderRadius: 12, textAlign: 'center',
                background: intensity === i.id ? 'rgba(249,115,22,0.14)' : 'var(--bg-glass)',
                border: `2px solid ${intensity === i.id ? '#F97316' : 'var(--border)'}`,
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
              }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{i.label.split(' ')[0]}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: intensity === i.id ? '#FB923C' : 'var(--text-primary)' }}>{i.label.split(' ').slice(1).join(' ')}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, marginTop: 2 }}>{i.desc}</div>
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
              📅 Exam or deadline date <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(optional)</span>
            </label>
            <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
              className="input-premium"
              min={new Date().toISOString().split('T')[0]}
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
            <button className="btn btn-primary" onClick={generate} style={{ flex: 2, justifyContent: 'center', padding: '13px', fontSize: '0.95rem' }}>
              {generating ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ animation: 'pulse-soft 1s infinite' }}>🧠</span> Generating your plan…
                </span>
              ) : '✨ Generate My Plan'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Generated plan */}
      {step === 4 && generatedPlan && (
        <div style={{ animation: 'slide-up 0.4s ease both' }}>
          {/* AI insights */}
          <div className="card" style={{
            padding: '22px 24px', marginBottom: 20,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.07))',
            border: '1px solid rgba(139,92,246,0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#A78BFA' }}>AI Insights</h3>
            </div>
            {generatedPlan.insights.map((insight, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#8B5CF6', flexShrink: 0, fontWeight: 900, marginTop: 1 }}>→</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.5 }}>
                  {insight.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}
                </span>
              </div>
            ))}
          </div>

          {/* Weekly schedule */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>📅 Your Weekly Plan</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                ~{generatedPlan.hoursPerDay} hrs/day
              </span>
            </div>
            {generatedPlan.plan.map(({ day, blocks, totalMins }, di) => (
              <div key={day} style={{
                padding: '14px 22px',
                borderBottom: di < 6 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', gap: 14,
                background: di >= 5 ? 'rgba(255,255,255,0.015)' : 'transparent',
              }}>
                <div style={{ width: 38, flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.78rem', color: di >= 5 ? '#FB923C' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{SHORT_DAYS[di]}</div>
                  {di >= 5 && <div style={{ fontSize: '0.65rem', color: 'rgba(251,146,60,0.6)', fontWeight: 700 }}>REST</div>}
                </div>
                <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {blocks.length > 0 ? blocks.map(({ subject, minutes }) => (
                    <div key={subject.id} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: `${subject.color}15`,
                      border: `1px solid ${subject.color}35`,
                      borderRadius: 8, padding: '5px 10px',
                    }}>
                      <span style={{ fontSize: 14 }}>{subject.emoji}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: subject.color }}>{subject.label}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{minutes}m</span>
                    </div>
                  )) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Rest day 🌙</span>
                  )}
                </div>
                <div style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: totalMins > 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                  {totalMins > 0 ? `${totalMins}m` : '—'}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => { setStep(1); setGeneratedPlan(null); }} style={{ flex: 1, justifyContent: 'center' }}>
              ↺ Start Over
            </button>
            <button className="btn btn-indigo" onClick={() => { setStep(3); setGeneratedPlan(null); }} style={{ flex: 1, justifyContent: 'center' }}>
              ✏️ Adjust Plan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
