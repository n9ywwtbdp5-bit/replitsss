import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@latest?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })

const priceIds = {
  monthly: {
    pro: Deno.env.get("STRIPE_PRICE_PRO_MONTHLY") || "",
    premium: Deno.env.get("STRIPE_PRICE_PREMIUM_MONTHLY") || "",
  },
  annual: {
    pro: Deno.env.get("STRIPE_PRICE_PRO_ANNUAL") || "",
    premium: Deno.env.get("STRIPE_PRICE_PREMIUM_ANNUAL") || "",
  },
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405)
  }

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY")
  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")

  if (!stripeSecret || !supabaseUrl || !supabaseAnonKey) {
    return json({ error: "Payments are not configured." }, 503)
  }

  const authHeader = req.headers.get("Authorization") || ""
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  })

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return json({ error: "Please log in before upgrading." }, 401)
  }

  const { plan, billing = "monthly" } = await req.json().catch(() => ({}))

  if (!["pro", "premium"].includes(plan)) {
    return json({ error: "Please choose Pro or Premium to continue." }, 400)
  }

  if (!["monthly", "annual"].includes(billing)) {
    return json({ error: "Please choose monthly or annual billing." }, 400)
  }

  const priceId = priceIds[billing as "monthly" | "annual"][plan as "pro" | "premium"]
  if (!priceId) {
    return json({ error: `${billing === "annual" ? "Annual" : "Monthly"} ${plan} is not configured yet.` }, 400)
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: "2026-04-22.dahlia",
    httpClient: Stripe.createFetchHttpClient(),
  })

  const origin = req.headers.get("origin") || Deno.env.get("SITE_URL") || "http://localhost:5000"
  const metadata = { userId: user.id, plan, billing }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email || undefined,
      success_url: `${origin}/app/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${origin}/app/pricing?billing=${billing}`,
      metadata,
      subscription_data: {
        metadata,
        trial_period_days: 7,
      },
      allow_promotion_codes: true,
    })

    return json({ url: session.url })
  } catch (err: any) {
    console.error("Failed to create checkout session:", err.message)
    return json({ error: "Checkout failed. Please try again." }, 500)
  }
})