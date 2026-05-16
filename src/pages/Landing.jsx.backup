import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { emoji: '🔥', title: 'Streak Tracking', desc: "Never break the chain. Build study habits that actually stick with daily streak protection and freeze shields." },
  { emoji: '⚡', title: 'XP & Levels', desc: "Earn experience points for every minute you study. Level up your scholar rank and show off your progress." },
  { emoji: '⏱️', title: 'Smart Timer', desc: "Pomodoro or custom sessions. Auto-track time per subject and get insights on your peak study hours." },
  { emoji: '📊', title: 'Deep Analytics', desc: "Beautiful charts showing your weekly patterns, subject breakdown, and consistency score over time." },
  { emoji: '🏆', title: 'Achievements', desc: "Unlock 50+ badges for milestones like Night Owl, Marathon Runner, and the legendary Centurion streak." },
  { emoji: '🎯', title: 'Daily Goals', desc: "Set personal targets by subject. Get smart nudges before midnight to protect your precious streak." },
]

const TESTIMONIALS = [
  { name: 'Sofia R.', role: 'Pre-med Student', avatar: '👩‍⚕️', text: "I went from studying 20 mins a day to 2+ hours. The streak pressure is real — I literally can't stop! 🔥", stars: 5 },
  { name: 'Marcus T.', role: 'CS Major', avatar: '👨‍💻', text: "Finally an app that gamifies studying without being cringe. The XP system is genuinely motivating.", stars: 5 },
  { name: 'Aisha K.', role: 'Law Student', avatar: '👩‍⚖️', text: "My bar exam prep has never been this consistent. 67-day streak and counting!", stars: 5 },
]

const STATS = [
  { value: '2M+', label: 'Active Students' },
  { value: '94%', label: 'Streak Success Rate' },
  { value: '47min', label: 'Avg Daily Study' },
  { value: '4.9★', label: 'App Rating' },
]

export default function Landing() {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  useEffect(() => {
    const cards = document.querySelectorAll('.feat-card')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('animate-pop-in'), i * 80)
        }
      })
    }, { threshold: 0.1 })
    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,251,245,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '2px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 70,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 30, animation: 'streak-fire 1.5s ease-in-out infinite' }}>🔥</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--brand-orange)' }}>StudyStreak</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={() => navigate('/app/pricing')} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.95rem' }}>Pricing</button>
          <button className="btn btn-primary" onClick={() => navigate('/app/dashboard')} style={{ padding: '10px 24px' }}>
            Start Free 🚀
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '90vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG blobs */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: -80, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,210,63,0.18) 0%, transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '40%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,160,0.12) 0%, transparent 70%)', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '2px solid var(--border)', borderRadius: 999, padding: '8px 20px', marginBottom: 28, fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-orange)', boxShadow: 'var(--shadow-sm)' }}>
            🎉 Over 2 million students building better habits
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            lineHeight: 1.05,
            marginBottom: 24,
            color: 'var(--text-primary)',
          }}>
            Build Study Habits<br />
            <span style={{ color: 'var(--brand-orange)', display: 'inline-block', animation: 'float 3s ease-in-out infinite' }}>
              That Actually Stick 🔥
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', color: 'var(--text-secondary)', marginBottom: 40, fontWeight: 600, lineHeight: 1.6, maxWidth: 580, margin: '0 auto 40px' }}>
            Track your streaks, earn XP, and gamify your grind.
            The study habit tracker students are obsessed with.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <button className="btn btn-primary" onClick={() => navigate('/app/dashboard')} style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
              Start Free — No Card Needed 🚀
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/app/pricing')} style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
              See Pricing ✨
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
            Free forever · No credit card · Cancel anytime
          </p>
        </div>

        {/* Floating emoji decorations */}
        {['📚', '✏️', '🎯', '💡', '🧠', '⭐'].map((e, i) => (
          <div key={i} style={{
            position: 'absolute',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            opacity: 0.25,
            animation: `float ${3 + i * 0.4}s ease-in-out ${i * 0.5}s infinite`,
            left: `${8 + i * 14}%`,
            top: `${15 + (i % 3) * 25}%`,
            zIndex: 0,
            pointerEvents: 'none',
          }}>{e}</div>
        ))}
      </section>

      {/* STATS STRIP */}
      <section style={{ background: 'var(--brand-orange)', padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 80px)', flexWrap: 'wrap' }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', opacity: 0.85, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: 16 }}>
            Everything You Need to <span style={{ color: 'var(--brand-orange)' }}>Crush It 💪</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>
            Built for serious students who want serious results.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {FEATURES.map(({ emoji, title, desc }) => (
            <div key={title} className="card feat-card" style={{ padding: 28, opacity: 0 }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>{emoji}</div>
              <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: 10 }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 600 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: 'white', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)', borderTop: '2px solid var(--border)', borderBottom: '2px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', marginBottom: 50 }}>
            Students <span style={{ color: 'var(--brand-orange)' }}>Love It ❤️</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map(({ name, role, avatar, text, stars }) => (
              <div key={name} className="card" style={{ padding: 28 }}>
                <div style={{ color: '#FFD23F', fontSize: '1.3rem', marginBottom: 16, letterSpacing: 2 }}>
                  {'★'.repeat(stars)}
                </div>
                <p style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.7, marginBottom: 20, color: 'var(--text-primary)' }}>
                  "{text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,107,53,0.06) 0%, rgba(255,210,63,0.06) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 64, marginBottom: 20, animation: 'streak-fire 1.5s ease-in-out infinite' }}>🔥</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', marginBottom: 20 }}>
            Start Your Streak Today
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 40 }}>
            Join 2 million students. Free to start. Life-changing habits guaranteed.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/app/dashboard')} style={{ fontSize: '1.15rem', padding: '18px 44px' }}>
            Begin Your Journey 🚀
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--text-primary)', color: 'white', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>🔥</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--brand-orange)' }}>StudyStreak</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600 }}>
          © 2025 StudyStreak. Built for students, by students. 💪
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', fontWeight: 700 }}>
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
