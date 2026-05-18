// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@latest?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

const planMap = Object.fromEntries(
  [
    [Deno.env.get("STRIPE_PRICE_PRO_MONTHLY"), "pro"],
    [Deno.env.get("STRIPE_PRICE_PRO_ANNUAL"), "pro"],
    [Deno.env.get("STRIPE_PRICE_PREMIUM_MONTHLY"), "premium"],
    [Deno.env.get("STRIPE_PRICE_PREMIUM_ANNUAL"), "premium"],
  ].filter(([priceId]) => Boolean(priceId))
) as Record<string, "pro" | "premium">

function planForSubscription(subscription: Stripe.Subscription) {
  const status = subscription.status
  if (["canceled", "unpaid", "incomplete_expired"].includes(status)) {
    return "free"
  }

  const priceId = subscription.items.data[0]?.price.id || ""
  return planMap[priceId] || "free"
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY")
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")
  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

  if (!stripeSecret || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    return new Response("Webhook is not configured", { status: 503 })
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: "2026-04-22.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
  })

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return new Response(`Webhook error: ${err.message}`, { status: 400 })
  }

  const { data: alreadyProcessed, error: lookupError } = await supabase
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle()

  if (lookupError) {
    console.error("Failed to check Stripe event idempotency:", lookupError.message)
    return new Response("Database lookup failed", { status: 500 })
  }

  if (alreadyProcessed) {
    return json({ received: true, duplicate: true })
  }

  const findUserId = async (subscription: Stripe.Subscription) => {
    if (subscription.metadata?.userId) return subscription.metadata.userId

    const { data: userRow, error } = await supabase
      .from("users")
      .select("id")
      .eq("stripe_customer_id", subscription.customer as string)
      .maybeSingle()

    if (error) throw error
    return userRow?.id || null
  }

  const updateSubscription = async (subscription: Stripe.Subscription, customerId?: string) => {
    const userId = await findUserId(subscription)
    if (!userId) {
      console.error("Could not find user for Stripe customer", subscription.customer)
      return
    }

    const plan = planForSubscription(subscription)
    const { error } = await supabase
      .from("users")
      .update({
        plan,
        stripe_customer_id: customerId || subscription.customer,
        stripe_subscription_id: plan === "free" ? null : subscription.id,
        subscription_status: subscription.status,
      })
      .eq("id", userId)

    if (error) throw error
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId

      if (!userId) {
        console.error("checkout.session.completed missing userId metadata", session.id)
      } else if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        const plan = planForSubscription(subscription)

        const { error } = await supabase
          .from("users")
          .update({
            plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
          })
          .eq("id", userId)

        if (error) throw error
      }
    }

    if (event.type === "customer.subscription.updated") {
      await updateSubscription(event.data.object as Stripe.Subscription)
    }

    if (event.type === "customer.subscription.deleted") {
      await updateSubscription(event.data.object as Stripe.Subscription)
    }
  } catch (err: any) {
    console.error(`Error processing ${event.type}:`, err.message)
    return new Response("Internal error processing event", { status: 500 })
  }

  const { error: insertError } = await supabase
    .from("stripe_events")
    .insert({ id: event.id, type: event.type })

  if (insertError) {
    console.error("Failed to record Stripe event:", insertError.message)
    return new Response("Database insert failed", { status: 500 })
  }

  return json({ received: true })
})