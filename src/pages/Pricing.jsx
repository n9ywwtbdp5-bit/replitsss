import React, { useEffect, useState } from 'react'
import { startStripeCheckout } from '../lib/stripeCheckout.js'
import { useAuth } from '../lib/useAuth'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    emoji: '🌱',
    price: 0,
    period: 'forever',
    tagline: 'Get started and build your first habit',
    color: '#64748B',
    features: [
      { text: '1 active subject',         ok: true  },
      { text: 'Basic streak tracking',    ok: true  },
      { text: 'Pomodoro timer',           ok: true  },
      { text: '7-day history',            ok: true  },
      { text: '3 achievements',           ok: true  },
      { text: 'Advanced analytics',       ok: false },
      { text: 'All subjects unlocked',    ok: false },
      { text: 'Streak freeze shields',    ok: false },
      { text: 'AI study planner',         ok: false, note: 'Premium only' },
      { text: 'Leaderboards',             ok: false },
    ],
    cta: 'Current Plan',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    emoji: '⚡',
    price: 8.99,
    period: 'per month',
    tagline: 'For students serious about building habits',
    color: '#F97316',
    badge: '🏆 Most Popular',
    features: [
      { text: 'All 6 subjects unlocked',          ok: true  },
      { text: 'Advanced streak analytics',         ok: true  },
      { text: 'Full progress charts',              ok: true  },
      { text: '90-day history',                    ok: true  },
      { text: 'All 50+ achievements',              ok: true  },
      { text: '3 streak freeze shields/month',     ok: true  },
      { text: 'Custom timer modes',                ok: true  },
      { text: 'Weekly email reports',              ok: true  },
      { text: 'AI study planner',                  ok: false, note: 'Premium only' },
      { text: 'Priority support',                  ok: false },
    ],
    cta: 'Start Pro',
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    emoji: '👑',
    price: 12.99,
    period: 'per month',
    tagline: 'The full arsenal for top performers',
    color: '#8B5CF6',
    features: [
      { text: 'Everything in Pro',              ok: true },
      { text: 'AI-powered study planner',       ok: true },
      { text: 'Unlimited streak shields',       ok: true },
      { text: 'Leaderboard access',             ok: true },
      { text: '1-year history & exports',       ok: true },
      { text: 'Study group challenges',         ok: true },
      { text: 'Priority support (24hr)',        ok: true },
      { text: 'Early feature access',           ok: true },
      { text: 'Custom avatar & themes',         ok: true },
      { text: 'AI-powered daily study plans',   ok: true },
    ],
    cta: 'Go Premium',
    highlight: false,
  },
]

const FAQ = [
  { q: 'Can I cancel anytime?',       a: 'Absolutely. Cancel anytime with no hidden fees or penalties.' },
  { q: 'Is there a free trial?',      a: 'Yes! Pro and Premium include a 7-day free trial — no charge until it ends.' },
  { q: 'What happens if I cancel?',   a: 'Your progress and streaks remain saved forever on your free account.' },
  { q: 'Do you offer student discounts?', a: 'Yes! Contact support with your .edu email for 20% off.' },
]

export default function Pricing() {
  const { user } = useAuth()
  const [billing, setBilling]       = useState('monthly')
  const [activeFaq, setActiveFaq]   = useState(null)
  const [checkoutPlan, setCheckoutPlan] = useState('')
  const [errorMsg, setErrorMsg]     = useState('')

  useEffect(() => {
    const b = new URLSearchParams(window.location.search).get('billing')
    if (b === 'monthly' || b === 'annual') setBilling(b)
  }, [])

  const handleSelect = async (plan) => {
    if (plan === 'free' || checkoutPlan) return
    setCheckoutPlan(plan)
    setErrorMsg('')

    const result = await startStripeCheckout({ plan, billing, user })

    if (!result.ok) {
      setErrorMsg(result.message)
      setCheckoutPlan('')
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 44, animation: 'slide-up 0.4s ease both' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 99, padding: '6px 18px',
          fontWeight: 700, fontSize: '0.82rem', color: '#818CF8', marginBottom: 14,
        }}>💳 Simple, honest pricing</div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, marginBottom: 14, letterSpacing: '-0.6px' }}>
          Invest in Your{' '}
          <span style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Future Self 🚀
          </span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Start free. Upgrade when you're ready. No tricks, no surprises.
        </p>

        {/* Billing toggle */}
        <div style={{
          display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: 99,
          border: '1px solid rgba(255,255,255,0.1)', padding: 4,
        }}>
          {['monthly', 'annual'].map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{
              padding: '8px 22px', borderRadius: 99,
              background: billing === b ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: billing === b ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
              color: billing === b ? '#F1F5F9' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)', fontWeight: 700, cursor: 'pointer',
              fontSize: '0.88rem', transition: 'all 0.2s',
            }}>
              {b === 'monthly' ? 'Monthly' : '🎁 Annual (Save 20%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '12px 18px', marginBottom: 20, textAlign: 'center',
          color: '#FCA5A5', fontSize: '0.9rem', fontWeight: 600,
        }}>⚠️ {errorMsg}</div>
      )}

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 56 }}>
        {PLANS.map(plan => {
          const finalPrice = billing === 'annual' && plan.price > 0 ? (plan.price * 0.8).toFixed(2) : plan.price
          const isCurrent = user?.plan === plan.id

          return (
            <div key={plan.id} className="card hover-lift" style={{
              padding: '28px 24px',
              position: 'relative', overflow: 'visible',
              border: plan.highlight ? `1px solid ${plan.color}50` : '1px solid rgba(255,255,255,0.08)',
              background: plan.highlight
                ? `linear-gradient(145deg, ${plan.color}0D, rgba(22,29,46,0.95))`
                : 'linear-gradient(145deg, #161D2E, #111827)',
            }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: `linear-gradient(135deg, ${plan.color}, #FBBF24)`,
                  color: '#fff', borderRadius: 99, padding: '4px 16px',
                  fontWeight: 800, fontSize: '0.75rem', whiteSpace: 'nowrap',
                  boxShadow: `0 4px 14px ${plan.color}50`,
                }}>{plan.badge}</div>
              )}

              <div style={{ fontSize: 44, marginBottom: 14, textAlign: 'center' }}>{plan.emoji}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 700, color: plan.color, textAlign: 'center', marginBottom: 4 }}>{plan.name}</div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', textAlign: 'center', marginBottom: 22, lineHeight: 1.5 }}>{plan.tagline}</div>

              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: '#F1F5F9' }}>
                  {plan.price === 0 ? '$0' : `$${finalPrice}`}
                </span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', marginLeft: 4 }}>/{plan.period}</span>
                {billing === 'annual' && plan.price > 0 && (
                  <div style={{ color: '#34D399', fontSize: '0.78rem', fontWeight: 700, marginTop: 2 }}>
                    You save ${(plan.price * 0.2 * 12).toFixed(2)}/year
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                {plan.features.map(({ text, ok }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 9, opacity: ok ? 1 : 0.45 }}>
                    <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: 1, color: ok ? '#34D399' : '#EF4444' }}>
                      {ok ? '✓' : '✕'}
                    </span>
                    <span style={{ fontWeight: 500, fontSize: '0.88rem', color: ok ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: 1.4 }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={() => handleSelect(plan.id)}
                disabled={isCurrent || Boolean(checkoutPlan) || plan.id === 'free'}
                style={{
                  width: '100%', padding: '13px 20px', borderRadius: 99,
                  fontSize: '0.95rem', fontWeight: 700,
                  fontFamily: 'var(--font-body)',
                  cursor: isCurrent || plan.id === 'free' || checkoutPlan ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  background: isCurrent || plan.id === 'free'
                    ? 'rgba(255,255,255,0.06)'
                    : plan.highlight
                    ? `linear-gradient(135deg, ${plan.color}, #FBBF24)`
                    : `${plan.color}20`,
                  color: isCurrent || plan.id === 'free' ? 'var(--text-muted)' : '#fff',
                  border: `1px solid ${isCurrent || plan.id === 'free' ? 'rgba(255,255,255,0.08)' : plan.color + '60'}`,
                  boxShadow: plan.highlight && !isCurrent && plan.id !== 'free' ? `0 6px 20px ${plan.color}40` : 'none',
                  opacity: checkoutPlan && checkoutPlan !== plan.id ? 0.55 : 1,
                }}
                onMouseEnter={e => { if (!isCurrent && plan.id !== 'free' && !checkoutPlan) { e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
              >
                {isCurrent ? '✓ Current Plan' : checkoutPlan === plan.id ? 'Redirecting…' : plan.id === 'free' ? 'Free Forever' : plan.cta + ` — $${finalPrice}/mo`}
              </button>

              {plan.id !== 'free' && (
                <div style={{ textAlign: 'center', marginTop: 10, color: 'var(--text-muted)', fontSize: '0.76rem', fontWeight: 500 }}>
                  7-day free trial · Cancel anytime
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Testimonial */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ color: '#FBBF24', fontSize: '1.6rem', marginBottom: 10, letterSpacing: 3 }}>★★★★★</div>
        <p style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, fontStyle: 'italic' }}>
          "StudyStreak transformed my study habits and improved my grades significantly."
        </p>
        <div style={{ marginTop: 10, fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>— Alex T., University Student</div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 40 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 700, textAlign: 'center', marginBottom: 24, letterSpacing: '-0.3px' }}>
          Got Questions? 🙋
        </h2>
        {FAQ.map((faq, i) => (
          <div key={i} className="card" style={{ marginBottom: 10, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F1F5F9' }}>{faq.q}</span>
              <span style={{
                color: '#818CF8', fontWeight: 800, fontSize: '1.3rem',
                transition: 'transform 0.25s', transform: activeFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                display: 'inline-block', lineHeight: 1,
              }}>+</span>
            </div>
            {activeFaq === i && (
              <div style={{ padding: '0 22px 18px', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.7, fontSize: '0.9rem', animation: 'fade-in 0.2s ease both' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
