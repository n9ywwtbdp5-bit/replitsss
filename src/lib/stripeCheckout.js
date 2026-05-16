import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY?.trim()

const PRICE_IDS = {
  monthly: {
    pro: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY || 'price_1TXgQPHU1AxqRSaJNNSYsxDc',
    premium: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY || 'price_1TXgQPHU1AxqRSaJnSB8BtEW',
  },
  annual: {
    pro: import.meta.env.VITE_STRIPE_PRICE_PRO_ANNUAL || '',
    premium: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_ANNUAL || '',
  },
}

const stripePromise = STRIPE_PUBLIC_KEY ? loadStripe(STRIPE_PUBLIC_KEY) : null

const getBillingLabel = (billing) => billing === 'annual' ? 'annual' : 'monthly'

export async function startStripeCheckout({ plan, billing = 'monthly' }) {
  if (!plan || plan === 'free') {
    return { ok: false, message: 'Please choose Pro or Premium to continue checkout.' }
  }

  if (!STRIPE_PUBLIC_KEY) {
    return {
      ok: false,
      message: 'Stripe is not configured yet. Add VITE_STRIPE_PUBLIC_KEY and try again.',
    }
  }

  const priceId = PRICE_IDS[billing]?.[plan]

  if (!priceId) {
    return {
      ok: false,
      message: `${getBillingLabel(billing)} checkout for ${plan} is not configured yet.`,
    }
  }

  try {
    const stripe = await stripePromise

    if (!stripe) {
      return {
        ok: false,
        message: 'Unable to load Stripe checkout right now. Please refresh and retry.',
      }
    }

    const result = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/app/dashboard?payment=success&plan=${plan}`,
      cancelUrl: `${window.location.origin}/app/pricing?billing=${billing}`,
    })

    if (result?.error) {
      return {
        ok: false,
        message: result.error.message || 'Checkout could not start. Please try again.',
      }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      message: error?.message || 'Checkout failed to start. Please try again.',
    }
  }
}
