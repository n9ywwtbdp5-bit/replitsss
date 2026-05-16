import React, { useEffect, useState } from 'react'
import { useStore } from '../store.js'
import { startStripeCheckout } from '../lib/stripeCheckout.js'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    emoji: '🌱',
    price: 0,
    period: 'forever',
    tagline: 'Get started and build your first habit',
    color: '#6B6B8A',
    shadow: '#A9A9C0',
    features: [
      '✅ 1 active subject',
      '✅ Basic streak tracking',
      '✅ Pomodoro timer',
      '✅ 7-day history',
      '✅ 3 achievements',
      '❌ Advanced analytics',
      '❌ All subjects unlocked',
      '❌ Streak freeze shields',
      '❌ AI study planner',
      '❌ Leaderboards',
    ],
    cta: 'Current Plan',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    emoji: '⚡',
    price: 16.99,
    period: 'per month',
    tagline: 'For students serious about building habits',
    color: '#FF6B35',
    shadow: '#C94E1F',
    badge: '🏆 Most Popular',
    features: [
      '✅ All 6 subjects unlocked',
      '✅ Advanced streak analytics',
      '✅ Full progress charts',
      '✅ 90-day history',
      '✅ All 50+ achievements',
      '✅ 3 streak freeze shields/month',
      '✅ Custom timer modes',
      '✅ Weekly email reports',
      '❌ AI study planner',
      '❌ Priority support',
    ],
    cta: 'Start Pro — $16.99/mo',
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    emoji: '👑',
    price: 23.99,
    period: 'per month',
    tagline: 'The full arsenal for top performers',
    color: '#9B5DE5',
    shadow: '#7B3DB5',
    features: [
      '✅ Everything in Pro',
      '✅ AI-powered study planner',
      '✅ Unlimited streak shields',
      '✅ Leaderboard access',
      '✅ 1-year history & exports',
      '✅ Study group challenges',
      '✅ Priority support (24hr)',
      '✅ Early feature access',
      '✅ Custom avatar & themes',
      '✅ Monthly 1-on-1 coaching call',
    ],
    cta: 'Go Premium — $23.99/mo',
    highlight: false,
  },
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel anytime with no hidden fees.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes! Pro and Premium include a 7-day free trial.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'Your progress and streaks remain saved forever.',
  },
  {
    q: 'Do you offer student discounts?',
    a: 'Yes! Contact support with your .edu email.',
  },
]

export default function Pricing() {
  const { user } = useStore()

  const [billing, setBilling] = useState('monthly')
  const [activeFaq, setActiveFaq] = useState(null)
  const [checkoutPlan, setCheckoutPlan] = useState('')

  useEffect(() => {
    const billingFromUrl = new URLSearchParams(window.location.search).get('billing')
    if (billingFromUrl === 'monthly' || billingFromUrl === 'annual') {
      setBilling(billingFromUrl)
    }
  }, [])

  const handleSelect = async (plan) => {
    if (plan === 'free') return

    setCheckoutPlan(plan)

    const result = await startStripeCheckout({ plan, billing })

    if (!result.ok) {
      alert(result.message)
      setCheckoutPlan('')
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: 48,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'var(--border)',
            borderRadius: 99,
            padding: '6px 20px',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: 'var(--brand-orange)',
            marginBottom: 16,
          }}
        >
          💳 Simple, honest pricing
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            marginBottom: 16,
          }}
        >
          Invest in Your{' '}
          <span style={{ color: 'var(--brand-orange)' }}>
            Future Self 🚀
          </span>
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            fontWeight: 600,
            maxWidth: 500,
            margin: '0 auto 28px',
          }}
        >
          Start free. Upgrade when you're ready.
        </p>

        <div
          style={{
            display: 'inline-flex',
            background: 'var(--border)',
            borderRadius: 99,
            padding: 4,
          }}
        >
          {['monthly', 'annual'].map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: '8px 24px',
                borderRadius: 99,
                background: billing === b ? 'white' : 'transparent',
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {b === 'monthly'
                ? 'Monthly'
                : '🎁 Annual (Save 20%)'}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          marginBottom: 60,
        }}
      >
        {PLANS.map((plan) => {
          const finalPrice =
            billing === 'annual' && plan.price > 0
              ? (plan.price * 0.8).toFixed(2)
              : plan.price

          const isCurrent = user.plan === plan.id

          return (
            <div
              key={plan.id}
              style={{
                background: 'white',
                borderRadius: '24px',
                border: `3px solid ${
                  plan.highlight
                    ? plan.color
                    : 'var(--border)'
                }`,
                boxShadow: plan.highlight
                  ? `0 8px 0 ${plan.shadow}`
                  : 'var(--shadow-card)',
                padding: 32,
                position: 'relative',
              }}
            >
              {plan.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: plan.color,
                    color: 'white',
                    borderRadius: 99,
                    padding: '6px 20px',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div
                style={{
                  fontSize: 44,
                  marginBottom: 12,
                }}
              >
                {plan.emoji}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  color: plan.color,
                  marginBottom: 4,
                }}
              >
                {plan.name}
              </div>

              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  marginBottom: 20,
                }}
              >
                {plan.tagline}
              </div>

              <div style={{ marginBottom: 28 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  {plan.price === 0
                    ? '$0'
                    : `$${finalPrice}`}
                </span>

                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    marginLeft: 4,
                  }}
                >
                  /{plan.period}
                </span>
              </div>

              <div style={{ marginBottom: 28 }}>
                {plan.features.map((feature, i) => {
                  const enabled =
                    feature.startsWith('✅')

                  const icon = enabled ? '✅' : '❌'

                  const text = feature
                    .replace('✅ ', '')
                    .replace('❌ ', '')

                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        marginBottom: 10,
                        opacity: enabled ? 1 : 0.45,
                      }}
                    >
                      <span>{icon}</span>

                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color:
                            'var(--text-secondary)',
                          lineHeight: 1.5,
                          width: '100%',
                        }}
                      >
                        {text}
                      </span>
                    </div>
                  )
                })}
              </div>

              <button
                className="btn"
                onClick={() => handleSelect(plan.id)}
                disabled={isCurrent || Boolean(checkoutPlan)}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: isCurrent
                    ? 'var(--border)'
                    : plan.highlight
                    ? plan.color
                    : 'white',
                  color: isCurrent
                    ? 'var(--text-muted)'
                    : plan.highlight
                    ? 'white'
                    : plan.color,
                  border: `2px solid ${plan.color}`,
                  padding: '14px 18px',
                  borderRadius: 14,
                  fontWeight: 800,
                  cursor: (isCurrent || Boolean(checkoutPlan))
                    ? 'default'
                    : 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                {isCurrent
                  ? '✓ Current Plan'
                  : checkoutPlan === plan.id
                  ? 'Redirecting…'
                  : plan.cta}
              </button>

              {plan.id !== 'free' && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: 12,
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  7-day free trial · Cancel anytime
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div
        style={{
          textAlign: 'center',
          marginBottom: 48,
        }}
      >
        <div
          style={{
            color: '#FFD23F',
            fontSize: '1.8rem',
            marginBottom: 12,
            letterSpacing: 4,
          }}
        >
          ★★★★★
        </div>

        <p
          style={{
            fontWeight: 700,
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          "StudyStreak Pro changed my GPA."
        </p>

        <div
          style={{
            marginTop: 12,
            fontWeight: 900,
          }}
        >
          — Jake M., Engineering Student
        </div>
      </div>

      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          Got Questions? 🙋
        </h2>

        {FAQ.map((faq, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: '20px 24px',
              marginBottom: 12,
              cursor: 'pointer',
            }}
            onClick={() =>
              setActiveFaq(
                activeFaq === i ? null : i
              )
            }
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                }}
              >
                {faq.q}
              </span>

              <span
                style={{
                  color: 'var(--brand-orange)',
                  fontWeight: 900,
                }}
              >
                {activeFaq === i ? '−' : '+'}
              </span>
            </div>

            {activeFaq === i && (
              <div
                style={{
                  marginTop: 12,
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  lineHeight: 1.7,
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}