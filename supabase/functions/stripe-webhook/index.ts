// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
  })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret)
  } catch (err: any) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // User just completed payment — upgrade their plan
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const userId = session.metadata?.userId

    if (userId && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription)
      const subPriceId = subscription.items.data[0].price.id

      const planMap: Record<string, string> = {
        [Deno.env.get('STRIPE_PRICE_PRO_MONTHLY') || '']: 'pro',
        [Deno.env.get('STRIPE_PRICE_PRO_ANNUAL') || '']: 'pro',
        [Deno.env.get('STRIPE_PRICE_PREMIUM_MONTHLY') || '']: 'premium',
        [Deno.env.get('STRIPE_PRICE_PREMIUM_ANNUAL') || '']: 'premium',
      }

      const plan = planMap[subPriceId] || 'pro'
      await supabase.from('users').update({ plan }).eq('id', userId)
    }
  }

  // Subscription cancelled — downgrade back to free
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    const userId = subscription.metadata?.userId
    if (userId) {
      await supabase.from('users').update({ plan: 'free' }).eq('id', userId)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
