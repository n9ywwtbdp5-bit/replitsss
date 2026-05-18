import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store.js'
import { startStripeCheckout } from '../lib/stripeCheckout.js'
import { useAuth } from '../lib/useAuth.jsx'

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    icon: '⚡',
    price: '$8.99',
    period: '/month',
    color: '#F97316',
    colorDim: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.35)',
    gradient: 'linear-gradient(135deg, #F97316, #FBBF24)',
    shadow: 'rgba(249,115,22,0.45)',
    badge: 'MOST POPULAR',
    cta: 'Upgrade to Pro',
    features: [
      'All 6 subjects unlocked',
      'Advanced analytics & charts',
      '3 streak freeze shields/mo',
      '50+ achievements',
      '90-day study history',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: '👑',
    price: '$12.99',
    period: '/month',
    color: '#8B5CF6',
    colorDim: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.35)',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
    shadow: 'rgba(139,92,246,0.45)',
    badge: null,
    cta: 'Go Premium',
    features: [
      'Everything in Pro',
      'AI-powered study planner',
      'Unlimited streak shields',
      'Leaderboard & challenges',
      '1-year history & exports',
    ],
  },
]

export default function PaywallModal() {
  const { closePaywall, paywallFeature } = useStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleUpgrade = async (planId) => {
    if (loadingPlan) return
    setLoadingPlan(planId)
    setErrorMsg('')
    const result = await startStripeCheckout({ plan: planId, billing: 'monthly', user })
    if (!result.ok) {
      setErrorMsg(result.message)
      setLoadingPlan('')
    }
  }

  return (
    <div onClick={closePaywall} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(4,8,16,0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 560, width: '100%',
        borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
        animation: 'pop-in 0.32s var(--ease-bounce) forwards',
        position: 'relative',
      }}>

        {/* ── Gradient Banner Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 55%, #F97316 100%)',
          padding: '32px 28px 28px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          {/* Shine overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)',
            pointerEvents: 'none',
          }} />
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

          {/* Close button — white version for banner */}
          <button onClick={closePaywall} style={{
            position: 'absolute', top: 14, right: 14,
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.18s', fontWeight: 700,
            zIndex: 2,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >×</button>

          {/* Icon */}
          <div style={{
            fontSize: 52, marginBottom: 12, display: 'inline-block',
            filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))',
            animation: 'float 3.5s ease-in-out infinite',
          }}>🔥</div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800,
            color: '#fff', marginBottom: 6, letterSpacing: '-0.3px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)', position: 'relative',
          }}>
            Unlock{' '}
            <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 6, padding: '0 6px', display: 'inline-block' }}>
              {paywallFeature || 'Pro Features'}
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 600, fontSize: '0.95rem', position: 'relative' }}>
            One subscription separates good from great. 💪
          </p>
        </div>

        {/* ── Content Body ── */}
        <div style={{
          background: 'linear-gradient(180deg, #111827, #0F172A)',
          padding: '24px',
        }}>

          {/* Error message */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
              color: '#FCA5A5', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <span>⚠️</span> {errorMsg}
            </div>
          )}

          {/* Plan cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            {PLANS.map((p) => (
              <div key={p.id} style={{
                background: p.colorDim,
                border: `1px solid ${p.border}`,
                borderRadius: 16, padding: '20px 16px',
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'visible',
                transition: 'transform 0.2s var(--ease-bounce)',
              }}>
                {/* Popular badge */}
                {p.badge && (
                  <div style={{
                    position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                    background: p.gradient, color: '#fff',
                    borderRadius: 99, padding: '3px 12px',
                    fontSize: '0.62rem', fontWeight: 800, whiteSpace: 'nowrap',
                    letterSpacing: '0.5px', boxShadow: `0 4px 12px ${p.shadow}`,
                  }}>{p.badge}</div>
                )}

                {/* Plan header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: p.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                    boxShadow: `0 4px 12px ${p.shadow}`,
                  }}>{p.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#F1F5F9' }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: p.color }}>{p.price}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{p.period}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div style={{ flex: 1, marginBottom: 16 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 7 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        background: p.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 900 }}>✓</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <button onClick={() => handleUpgrade(p.id)} disabled={Boolean(loadingPlan)} style={{
                  width: '100%', padding: '11px 12px',
                  borderRadius: 10, border: 'none',
                  background: p.gradient, color: '#fff',
                  fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '0.88rem',
                  cursor: loadingPlan ? 'not-allowed' : 'pointer',
                  opacity: loadingPlan && loadingPlan !== p.id ? 0.5 : 1,
                  boxShadow: `0 4px 16px ${p.shadow}`,
                  transition: 'all 0.2s var(--ease-bounce)',
                }}
                  onMouseEnter={e => { if (!loadingPlan) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${p.shadow}`; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 16px ${p.shadow}`; }}
                >
                  {loadingPlan === p.id ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span style={{ animation: 'pulse-soft 1s infinite', display: 'inline-block' }}>●</span> Redirecting…
                    </span>
                  ) : `${p.cta} →`}
                </button>
              </div>
            ))}
          </div>

          {/* See all pricing */}
          <button onClick={() => { closePaywall(); navigate('/app/pricing') }}
            disabled={Boolean(loadingPlan)}
            style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94A3B8', fontFamily: 'var(--font-body)', fontWeight: 700,
              fontSize: '0.88rem', cursor: loadingPlan ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', marginBottom: 14,
            }}
            onMouseEnter={e => { if (!loadingPlan) { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#F1F5F9'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94A3B8'; }}
          >
            Compare all plans →
          </button>

          {/* Trust bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 18, marginBottom: 12, flexWrap: 'wrap',
          }}>
            {[['🔒', 'Secure payment'], ['✓', '7-day free trial'], ['↩', 'Cancel anytime']].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#475569', fontSize: '0.78rem', fontWeight: 700 }}>
                <span style={{ color: '#10B981', fontWeight: 900 }}>{icon}</span> {text}
              </div>
            ))}
          </div>

          {/* Dismiss */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={closePaywall} disabled={Boolean(loadingPlan)} style={{
              background: 'none', border: 'none', color: '#475569',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.83rem',
              cursor: loadingPlan ? 'not-allowed' : 'pointer',
              transition: 'color 0.2s', padding: '4px 8px',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              Maybe later, I'll stay on Free
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
