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
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId
    const priceId = session.line_items?.data?.[0]?.price?.id

    // Map price ID to plan name
    const planMap: Record<string, string> = {
      [Deno.env.get('STRIPE_PRICE_PRO_MONTHLY') || '']: 'pro',
      [Deno.env.get('STRIPE_PRICE_PRO_ANNUAL') || '']: 'pro',
      [Deno.env.get('STRIPE_PRICE_PREMIUM_MONTHLY') || '']: 'premium',
      [Deno.env.get('STRIPE_PRICE_PREMIUM_ANNUAL') || '']: 'premium',
    }

    // Get priceId from the subscription instead since line_items needs expansion
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const subPriceId = subscription.items.data[0].price.id
    const plan = planMap[subPriceId] || 'pro'

    if (userId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )
      await supabase.from('users').update({ plan }).eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const userId = subscription.metadata?.userId
    if (userId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )
      await supabase.from('users').update({ plan: 'free' }).eq('id', userId)
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})