export async function startStripeCheckout({ plan, billing = 'monthly' }) {
  if (!plan || plan === 'free') {
    return { ok: false, message: 'Please choose Pro or Premium to continue.' }
  }

  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, billing }),
    })

    const data = await res.json()

    if (!res.ok || !data.url) {
      return { ok: false, message: data.message || 'Checkout failed. Please try again.' }
    }

    window.location.href = data.url
    return { ok: true }
  } catch (err) {
    return { ok: false, message: err?.message || 'Checkout failed. Please try again.' }
  }
}
