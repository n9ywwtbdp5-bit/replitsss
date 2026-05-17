const PRICE_IDS = {
  pro:     import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY     || '',
  premium: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY || '',
}

const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL || 'https://pxagibfmciysowbfpsds.supabase.co/functions/v1/stripe-checkout'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function startStripeCheckout({ plan, user }) {
  if (!plan || plan === 'free') {
    return { ok: false, message: 'Please choose Pro or Premium to continue.' }
  }

  const priceId = PRICE_IDS[plan]
  if (!priceId) {
    return { ok: false, message: `No price configured for ${plan}.` }
  }

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        priceId,
        userEmail: user?.email || '',
        userId: user?.id || '',
      }),
    })

    const data = await response.json()

    if (!response.ok || data.error) {
      return { ok: false, message: data.error || 'Failed to create checkout session.' }
    }

    if (data.url) {
      window.location.href = data.url
      return { ok: true }
    }

    return { ok: false, message: 'No checkout URL returned.' }
  } catch (err) {
    return { ok: false, message: err?.message || 'Checkout failed. Please try again.' }
  }
}
