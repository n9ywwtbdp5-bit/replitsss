import express from "express";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/auth/user", (req, res) => {
  const userId = req.headers["x-replit-user-id"];
  const userName = req.headers["x-replit-user-name"];
  const userImage = req.headers["x-replit-user-profile-image"];

  if (!userId) {
    return res.status(401).json({ user: null });
  }

  res.json({
    user: {
      id: userId,
      name: userName || "Student",
      profileImage: userImage || null,
    },
  });
});

app.get("/api/auth/login", (req, res) => {
  res.redirect(
    "https://replit.com/auth_with_repl_site?domain=" + req.headers.host
  );
});

app.get("/api/auth/logout", (req, res) => {
  res.redirect("/");
});

app.post("/api/stripe/checkout", async (req, res) => {
  const { plan, billing = "monthly" } = req.body;

  if (!plan || plan === "free") {
    return res.status(400).json({ message: "Please choose Pro or Premium." });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({ message: "Payments are not configured yet. Please add your Stripe keys." });
  }

  const PRICE_IDS = {
    monthly: {
      pro: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
      premium: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || "",
    },
    annual: {
      pro: process.env.STRIPE_PRICE_PRO_ANNUAL || "",
      premium: process.env.STRIPE_PRICE_PREMIUM_ANNUAL || "",
    },
  };

  const priceId = PRICE_IDS[billing]?.[plan];
  if (!priceId) {
    return res.status(400).json({ message: `No price configured for ${plan} (${billing}).` });
  }

  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secretKey);

    const origin = req.headers.origin || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/app/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${origin}/app/pricing?billing=${billing}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ message: err.message || "Checkout failed." });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("*", (_req, res) => {
    res.sendFile("dist/index.html", { root: "." });
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dev server running on port ${PORT}`);
  });
}
