import { supabase, supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from './supabaseClient.js'

const DEFAULT_FUNCTION_URL = supabaseUrl
  ? `${supabaseUrl.replace(/\/$/, '')}/functions/v1/stripe-checkout`
  : ''
const SUPABASE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_FUNCTION_URL || DEFAULT_FUNCTION_URL

export async function startStripeCheckout({ plan, billing = 'monthly', user }) {
  if (!plan || plan === 'free') {
    return { ok: false, message: 'Please choose Pro or Premium to continue.' }
  }

  if (!['monthly', 'annual'].includes(billing)) {
    return { ok: false, message: 'Please choose monthly or annual billing.' }
  }

  if (!isSupabaseConfigured || !SUPABASE_FUNCTION_URL) {
    return { ok: false, message: 'Payments are not configured yet. Please contact support.' }
  }

  const { data: { session } } = await supabase.auth.getSession()
  const accessToken = session?.access_token

  if (!accessToken || !user?.id) {
    return { ok: false, message: 'Please log in before upgrading.' }
  }

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan,
        billing,
      }),
    })

    const text = await response.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { error: text }
    }

    if (!response.ok || data.error) {
      return { ok: false, message: data.error || 'Failed to create checkout session.' }
    }

    if (data.url) {
      window.location.href = data.url
      return { ok: true }
    }

    return { ok: false, message: 'No checkout URL returned from server.' }
  } catch (err) {
    return { ok: false, message: err?.message || 'Checkout failed. Please try again.' }
  }
}