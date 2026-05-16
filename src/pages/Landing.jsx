import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/themeContext.jsx'

const FEATURES = [
  { icon: '🔥', title: 'Streak Tracking', desc: 'Never break the chain. Build daily habits with streak protection and freeze shields.' },
  { icon: '⚡', title: 'XP & Levels', desc: 'Earn XP for every minute you study. Level up your rank and unlock achievements.' },
  { icon: '⏱', title: 'Smart Timer', desc: 'Pomodoro or custom sessions. Auto-track time per subject with peak-hour insights.' },
  { icon: '📊', title: 'Deep Analytics', desc: 'Beautiful charts showing weekly patterns, subject breakdown, and consistency scores.' },
  { icon: '🏅', title: 'Achievements', desc: 'Unlock 50+ badges for milestones like Night Owl, Marathon Runner, and Centurion.' },
  { icon: '🎯', title: 'Daily Goals', desc: 'Set personal targets by subject. Get smart nudges to protect your streak.' },
]

const TESTIMONIALS = [
  { name: 'Sofia R.', role: 'Pre-med Student', avatar: '👩‍⚕️', text: 'I went from studying 20 mins a day to 2+ hours. The streak pressure is real — I literally can\'t stop!', stars: 5 },
  { name: 'Marcus T.', role: 'CS Major', avatar: '👨‍💻', text: 'Finally an app that gamifies studying without being cringe. The XP system is genuinely motivating.', stars: 5 },
  { name: 'Aisha K.', role: 'Law Student', avatar: '👩‍⚖️', text: 'My bar exam prep has never been this consistent. 67-day streak and counting!', stars: 5 },
]

const STATS = [
  { value: '2M+', label: 'Active Students' },
  { value: '94%', label: 'Streak Success Rate' },
  { value: '47min', label: 'Avg Daily Study' },
  { value: '4.5★', label: 'App Rating' },
]

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        border: isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.12)',
        borderRadius: 999, padding: '6px 12px 6px 8px',
        cursor: 'pointer', transition: 'all 0.25s var(--ease-smooth)',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'; }}
    >
      {/* Track */}
      <div style={{
        width: 38, height: 22, borderRadius: 999, position: 'relative',
        background: isDark ? 'rgba(99,102,241,0.6)' : 'linear-gradient(135deg, #F97316, #FBBF24)',
        transition: 'background 0.3s ease', flexShrink: 0,
        border: isDark ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(249,115,22,0.3)',
      }}>
        {/* Thumb */}
        <div style={{
          position: 'absolute', top: 2,
          left: isDark ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          transition: 'left 0.25s var(--ease-bounce)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9,
        }}>
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>
      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const cards = document.querySelectorAll('.feat-card')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }, i * 80)
        }
      })
    }, { threshold: 0.1 })
    cards.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  const sectionBg = isDark ? 'rgba(17,24,39,0.8)' : 'rgba(224,232,248,0.7)'
  const cardBg    = isDark ? undefined : 'rgba(255,255,255,0.8)'
  const navBg     = isDark ? 'rgba(13,17,23,0.88)' : 'rgba(248,250,252,0.92)'
  const navBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden', fontFamily: 'var(--font-body)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      {/* Orbs */}
      <div className="bg-orbs" style={{ opacity: isDark ? 1 : 0.55 }}>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: navBg, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${navBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 68,
        transition: 'background 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28, animation: 'streak-fire 1.6s ease-in-out infinite' }}>🔥</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>StudyStreak</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ThemeToggle />
          <button onClick={() => navigate('/app/pricing')} style={{
            background: 'none', border: 'none', fontFamily: 'var(--font-body)',
            fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >Pricing</button>
          <button className="btn btn-primary" onClick={() => navigate('/app/dashboard')} style={{ padding: '9px 22px', fontSize: '0.9rem' }}>
            Start Free 🚀
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '60px 24px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.1)',
          border: `1px solid ${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.25)'}`,
          borderRadius: 999, padding: '7px 20px', marginBottom: 32,
          fontSize: '0.85rem', fontWeight: 700, color: '#818CF8',
        }}>
          🎉 Over 2 million students building better habits
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 5rem)',
          fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-1px',
          maxWidth: 740, color: 'var(--text-primary)',
        }}>
          Build Study Habits<br />
          <span style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', animation: 'float 3.5s ease-in-out infinite' }}>
            That Actually Stick 🔥
          </span>
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--text-secondary)', marginBottom: 40, fontWeight: 500, lineHeight: 1.7, maxWidth: 520 }}>
          Track your streaks, earn XP, and gamify your grind.
          The study habit tracker students are obsessed with.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <button className="btn btn-primary" onClick={() => navigate('/app/dashboard')} style={{ fontSize: '1rem', padding: '14px 32px' }}>
            Start Free — No Card Needed 🚀
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/app/pricing')} style={{ fontSize: '1rem', padding: '14px 32px' }}>
            See Pricing ✨
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500 }}>
          Free forever · No credit card · Cancel anytime
        </p>

        {/* Floating emojis */}
        {['📚', '✏️', '🎯', '💡', '🧠', '⭐'].map((e, i) => (
          <div key={i} style={{
            position: 'absolute', fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
            opacity: isDark ? 0.18 : 0.22, animation: `float ${3.5 + i * 0.5}s ease-in-out ${i * 0.6}s infinite`,
            left: `${7 + i * 14}%`, top: `${18 + (i % 3) * 24}%`, pointerEvents: 'none',
          }}>{e}</div>
        ))}
      </section>

      {/* STATS STRIP */}
      <section style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', padding: '30px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(28px, 7vw, 90px)', flexWrap: 'wrap' }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.97)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, lineHeight: 1 }}>{value}</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', opacity: 0.85, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(60px, 8vw, 96px) clamp(20px, 5vw, 80px)', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            Everything You Need to{' '}
            <span style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Crush It 💪</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500 }}>
            Built for serious students who want serious results.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 20 }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="feat-card card" style={{
              padding: '28px 26px', opacity: 0,
              transform: 'translateY(24px)', transition: 'opacity 0.5s ease, transform 0.5s ease',
              background: cardBg,
            }}>
              <div style={{ fontSize: 38, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 500, fontSize: '0.9rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{
        background: sectionBg,
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: 'clamp(56px, 8vw, 96px) clamp(20px, 5vw, 80px)',
        position: 'relative', zIndex: 1, transition: 'background 0.3s ease',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 700, textAlign: 'center', marginBottom: 48, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            Students <span style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Love It ❤️</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(({ name, role, avatar, text, stars }) => (
              <div key={name} className="card" style={{ padding: '26px', background: cardBg }}>
                <div style={{ color: '#FBBF24', fontSize: '1.1rem', marginBottom: 14, letterSpacing: 2 }}>
                  {'★'.repeat(stars)}
                </div>
                <p style={{ fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 18, color: 'var(--text-secondary)' }}>
                  "{text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>{avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 96px) 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 60, marginBottom: 18, animation: 'streak-fire 1.6s ease-in-out infinite', display: 'inline-block' }}>🔥</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 700, marginBottom: 16, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            Start Your Streak Today
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500, marginBottom: 36, lineHeight: 1.7 }}>
            Join 2 million students. Free to start. Life-changing habits guaranteed.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/app/dashboard')} style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
            Begin Your Journey 🚀
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: isDark ? 'rgba(8,12,20,0.95)' : 'rgba(224,232,248,0.9)',
        borderTop: '1px solid var(--border)',
        padding: '28px 48px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
        transition: 'background 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>🔥</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#FB923C' }}>StudyStreak</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500 }}>
          © 2025 StudyStreak. Built for students, by students. 💪
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >{l}</a>
          ))}
          <ThemeToggle />
        </div>
      </footer>
    </div>
  )
}
