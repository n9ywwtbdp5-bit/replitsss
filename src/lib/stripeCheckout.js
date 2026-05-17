import { loadStripe } from '@stripe/stripe-js'

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY?.trim()

const PRICE_IDS = {
  monthly: {
    pro:     import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY     || '',
    premium: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY || '',
  },
  annual: {
    pro:     import.meta.env.VITE_STRIPE_PRICE_PRO_ANNUAL      || '',
    premium: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_ANNUAL  || '',
  },
}

const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null

export async function startStripeCheckout({ plan, billing = 'monthly' }) {
  if (!plan || plan === 'free') {
    return { ok: false, message: 'Please choose Pro or Premium to continue.' }
  }
  if (!STRIPE_KEY) {
    return { ok: false, message: 'Stripe is not configured. Add VITE_STRIPE_PUBLIC_KEY to your .env file.' }
  }

  const priceId = PRICE_IDS[billing]?.[plan]
  if (!priceId) {
    return { ok: false, message: `No price configured for ${plan} (${billing}).` }
  }

  try {
    const stripe = await stripePromise
    if (!stripe) return { ok: false, message: 'Could not load Stripe. Please refresh.' }

    const result = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/app/dashboard?payment=success&plan=${plan}`,
      cancelUrl:  `${window.location.origin}/app/pricing?billing=${billing}`,
    })

    if (result?.error) return { ok: false, message: result.error.message }
    return { ok: true }
  } catch (err) {
    return { ok: false, message: err?.message || 'Checkout failed. Please try again.' }
  }
}